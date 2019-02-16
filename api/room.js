var Room = require('./models/Room.js')
const axios = require('axios')

module.exports = function (io, onlineUsers) {
  var RoomFunctions = {}
  function shuffle (array) {
    var i = 0
      , j = 0
      , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    return array
  }
  RoomFunctions.add = (req, res) => {
    axios.get(`https://opentdb.com/api.php?amount=${req.body.questions}&category=${req.body.category.id}`)
      .then(response => {
        for (var i = 0; i < response.data.results.length; i++) {
          if (response.data.results[i].incorrect_answers.indexOf(',') > -1) {
            response.data.results[i].incorrect_answers = response.data.results[i].incorrect_answers.split(',')
          } else {
            response.data.results[i].incorrect_answers = [response.data.results[i].incorrect_answers]
          }

          response.data.results[i].incorrect_answers.push(response.data.results[i].correct_answer)
          response.data.results[i].incorrect_answers = shuffle(response.data.results[i].incorrect_answers)
        }
        let roomObj = new Room({
          created_by: req.userId,
          category: req.body.category._id || null,
          questions: req.body.questions,
          time_per_questions: req.body.time_per_questions,
          api_data: response.data.results,
          participants: [{
            id: req.userId
          }]
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

                for (var i = 0; i < roomLatest.participants.length; i++) {
                  if (roomLatest.participants[i].id) {
                    participants.push(roomLatest.participants[i].id._id)
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

                for (var i = 0; i < roomLatest.participants.length; i++) {
                  if (roomLatest.participants[i].id) {
                    participants.push(roomLatest.participants[i].id._id)
                  }
                }

                for (var m = 0; m < participants.length; m++) {
                  if (onlineUsers[participants[m]]) {
                    for (var l = 0; l < onlineUsers[participants[m]].length; l++) {
                      io.to(`${onlineUsers[participants[m]][l]}`).emit('UPDATED_ROOM', roomLatest)
                    }
                  }
                  if (onlineUsers[req.params.id]) {
                    for (var z = 0; z < onlineUsers[req.params.id].length; z++) {
                      io.to(`${onlineUsers[req.params.id][z]}`).emit('UPDATED_ROOM', roomLatest)
                      io.to(`${onlineUsers[req.params.id][z]}`).emit('DELETED_PARTICIPANT', roomLatest)
                    }
                  }
                }
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

  RoomFunctions.startGame = (req, res) => {
    Room.findOne({
      code: req.params.code,
      created_by: req.userId
    }, (err, room) => {
      if (err) return res.json(err)

      if (room && room.active) {
        room.active = false
        room.save(async function (err, roomSaved) {
          if (err) return res.json({ error: err })
          Room.findOne({
            code: req.params.code
          }, (err, roomLatest) => {
            if (err) return res.json(err)
            let participants = []

            for (var i = 0; i < roomLatest.participants.length; i++) {
              if (roomLatest.participants[i].id) {
                participants.push(roomLatest.participants[i].id._id)
              }
            }

            for (var m = 0; m < participants.length; m++) {
              if (onlineUsers[participants[m]]) {
                for (var l = 0; l < onlineUsers[participants[m]].length; l++) {
                  io.to(`${onlineUsers[participants[m]][l]}`).emit('GAME_STARTED', roomLatest)
                }
              }
            }
            // res.send(200)
          })
            .populate('created_by')
            .populate('category')
            .populate('participants.id')

          res.json(roomSaved)
        })
      } else {
        res.json({ error: 'Game has already started.' })
      }
    })
  }

  RoomFunctions.addPoints = (req, res) => {
    Room.findOne({
      code: req.params.code
    }, (err, room) => {
      if (err) return res.json(err)

      if (room && !room.active) {
        for (var m = 0; m < room.participants.length; m++) {
          if (room.participants[m].id._id == req.userId && !room.participants[m].finished && req.body.question >= room.participants[m].question) {
            //
            room.participants[m].points = room.participants[m].points + req.body.points
            room.participants[m].question = req.body.question
            if (req.body.points !== 0) {
              room.participants[m].corrects = room.participants[m].corrects + 1
            }
          }
        }
        room.save(async function (err, roomSaved) {
          if (err) return res.json({ error: err })
          Room.findOne({
            code: req.params.code
          }, (err, roomLatest) => {
            if (err) return res.json(err)
            let participants = []

            for (var i = 0; i < roomLatest.participants.length; i++) {
              if (roomLatest.participants[i].id) {
                participants.push(roomLatest.participants[i].id._id)
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

          res.json(roomSaved)
        })
      } else {
        res.json({ error: 'Game has already started.' })
      }
    })
  }
  RoomFunctions.finishGame = (req, res) => {
    Room.findOne({
      code: req.params.code
    }, (err, room) => {
      if (err) return res.json(err)

      if (room && !room.active) {
        for (var m = 0; m < room.participants.length; m++) {
          if (room.participants[m].id._id == req.userId) {
            room.participants[m].finished = true
          }
        }
        room.save(async function (err, roomSaved) {
          if (err) return res.json({ error: err })
          Room.findOne({
            code: req.params.code
          }, (err, roomLatest) => {
            if (err) return res.json(err)
            let participants = []

            for (var i = 0; i < roomLatest.participants.length; i++) {
              if (roomLatest.participants[i].id) {
                participants.push(roomLatest.participants[i].id._id)
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

          res.json(roomSaved)
        })
      } else {
        res.json({ error: 'Game has already started.' })
      }
    })
  }
  return RoomFunctions
}
