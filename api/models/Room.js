var mongoose = require('mongoose')
var shortid = require('shortid')

var roomSchema = mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  questions: {
    type: Number,
    required: true
  },
  time_per_questions: {
    type: Number,
    required: true
  },
  api_data: [
    {
      category: { type: String },
      type: { type: String },
      difficulty: { type: String },
      question: { type: String },
      correct_answer: { type: String },
      incorrect_answers: { type: String }
    }
  ],
  code: {
    type: String,
    required: true,
    default: shortid.generate
  }
})

module.exports = mongoose.model('Room', roomSchema, 'rooms')
