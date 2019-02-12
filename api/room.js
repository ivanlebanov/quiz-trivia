var Room = require('./models/Room.js')
const axios = require('axios')

module.exports = function(io) {
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
        roomObj.save(function(err, room) {
            if (err) return res.json(err)
            if (room) {
              res.json(room)
            } else {
              res.status(500).json({
                error: 'Failed to create'
              })
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

        let duplicate = false;
        if (room.participants.length > 0) {
          for (var i = 0; i < room.participants.length; i++) {
            if (room.participants[i].id === req.userId) {
              duplicate = true;
            }
          }
        }
        if (!duplicate && req.userId != room.created_by) {
          room.participants.push({
            id: req.userId
          });
        }

        //  savve stuff
        room.save(function(err, roomSaved) {
          if (err) return res.json({
            error: err
          })

          res.json(roomSaved)
        })
      }

    })
  }

  RoomFunctions.list = (req, res) => {
    res.send(200)
  }

  return RoomFunctions
}