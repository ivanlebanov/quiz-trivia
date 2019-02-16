var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  occupation: String,
  lastName: String,
  token: {
    type: String
  },
  active: Boolean,
  avatar: String,
  email: {
    type: String,
    required: true
  },
  created: Date,
  points: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema, 'users')
