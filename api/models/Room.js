var mongoose = require('mongoose')

var roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Room', roomSchema, 'rooms')
