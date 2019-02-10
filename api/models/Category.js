var mongoose = require('mongoose')

var categorySchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Category', categorySchema, 'categories')
