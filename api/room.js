var Room = require('./models/Room.js')
const axios = require('axios')

module.exports = function (io, onlineUsers) {
  var RoomFunctions = {}

  RoomFunctions.add = (req, res) => {
    axios.get(`https://opentdb.com/api.php?amount=${req.body.questions}&category=${req.body.category.id}`)
      .then(response => {
        let roomObj = new Room({
          created_by: req.userId,
          category: req.body.category._id || null,
          questions: req.body.questions,
          time_per_questions: req.body.time_per_questions,
          api_data: response.data.results
        })
        roomObj.save(function (err, room) {
          if (err) return res.json(err)
          if (room) {
            res.json(room)
          } else {
            res.status(500).json({ error: 'Failed to create' })
          }
        })
          .populate('created_by')
          .populate('category')
      })
      .catch(error => {
        console.log(error)
      })
  }

  RoomFunctions.joinRoom = (req, res) => {
    Room.findOne({
      code: req.params.code
    }, (err, room) => {
      if (err) return res.json(err)
      if (room) {
        let duplicate = false
        let initialLength = room.participants.length
        if (room.active) {
          if (room.participants.length > 0 && req.userId !== room.created_by.toString()) {
            for (var i = 0; i < room.participants.length; i++) {
              if (room.participants[i].id === req.userId) {
                duplicate = true
              }
            }
          }
          if (!duplicate && req.userId !== room.created_by.toString()) {
            room.participants.push({
              id: req.userId
            })
          }

          //  save stuff
          room.save(async function (err, roomSaved) {
            if (err) return res.json({ error: err })
            if (initialLength !== roomSaved.participants.length) {
              Room.findOne({
                code: req.params.code
              }, (err, roomLatest) => {
                if (err) return res.json(err)
                let participants = []
                participants.push(roomLatest.created_by._id)
                if (roomLatest.participants.length > 0) {
                  for (var i = 0; i < roomLatest.participants.length; i++) {
                    if (roomLatest.participants[i].id) {
                      participants.push(roomLatest.participants[i].id._id)
                    }
                  }
                }

                for (var m = 0; m < participants.length; m++) {
                  if (onlineUsers[participants[m]]) {
                    for (var l = 0; l < onlineUsers[participants[m]].length; l++) {
                      io.to(`${onlineUsers[participants[m]][l]}`).emit('UPDATED_ROOM', roomLatest)
                    }
                  }
                }
                // res.send(200)
              })
                .populate('created_by')
                .populate('category')
                .populate('participants.id')
            }
            res.json(roomSaved)
          })
        } else {
          res.json({ error: 'Game has already started.' })
        }
      }
    })
  }

  RoomFunctions.getOne = (req, res) => {
    Room.findOne({
      code: req.params.code
    }, (err, room) => {
      if (err) return res.json({ error: err })
      res.status(200).json(room)
    })
      .populate('created_by')
      .populate('category')
      .populate('participants.id')
  }

  RoomFunctions.list = (req, res) => {
    res.send(200)
  }

  RoomFunctions.kicKUser = (req, res) => {
    Room.findOne({
      code: req.params.code
    }, (err, room) => {
      if (err) return res.json(err)
      if (room) {
        let initialLength = room.participants.length
        if (room.active) {
          if (room.participants.length > 0) {
            room.participants = room.participants.filter((item) => {
              return item.id != req.params.id
            })
          }

          //  save stuff
          room.save(async function (err, roomSaved) {
            if (err) return res.json({ error: err })
            if (initialLength !== roomSaved.participants.length) {
              Room.findOne({
                code: req.params.code
              }, (err, roomLatest) => {
                if (err) return res.json(err)
                let participants = []
                participants.push(roomLatest.created_by._id)
                if (roomLatest.participants.length > 0) {
                  for (var i = 0; i < roomLatest.participants.length; i++) {
                    if (roomLatest.participants[i].id) {
                      participants.push(roomLatest.participants[i].id._id)
                    }
                  }
                }

                for (var m = 0; m < participants.length; m++) {
                  if (onlineUsers[participants[m]]) {
                    for (var l = 0; l < onlineUsers[participants[m]].length; l++) {
                      io.to(`${onlineUsers[participants[m]][l]}`).emit('UPDATED_ROOM', roomLatest)
                    }
                  }
                  if (onlineUsers[req.params.id]) {
                    for (var l = 0; l < onlineUsers[req.params.id].length; l++) {
                      io.to(`${onlineUsers[req.params.id][l]}`).emit('UPDATED_ROOM', roomLatest)
                      io.to(`${onlineUsers[req.params.id][l]}`).emit('DELETED_PARTICIPANT', roomLatest)
                    }
                  }
                }
                // res.send(200)
              })
                .populate('created_by')
                .populate('category')
                .populate('participants.id')
            }
            res.json(roomSaved)
          })
        } else {
          res.json({ error: 'Game has already started.' })
        }
      }
    })
  }

  return RoomFunctions
}
