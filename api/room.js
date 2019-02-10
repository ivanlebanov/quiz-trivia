var Room = require('./models/Room.js')
const axios = require('axios')

module.exports = function (io) {
  var RoomFunctions = {}

  RoomFunctions.add = (req, res) => {
    res.send(200)
  }

  RoomFunctions.list = (req, res) => {
    res.send(200)
  }

  return RoomFunctions
}
