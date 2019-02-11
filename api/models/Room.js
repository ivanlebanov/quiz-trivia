var mongoose = require('mongoose')
var shortid = require('shortid')

var roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    default: shortid.generate
  }
})

module.exports = mongoose.model('Room', roomSchema, 'rooms')
