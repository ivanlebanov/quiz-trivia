var Category = require('./models/Category.js')
const axios = require('axios')

module.exports = function (io) {
  var CategoryFunctions = {}

  CategoryFunctions.sync = (req, res) => {
    Category.deleteMany({})
    axios.get('https://opentdb.com/api_category.php')
      .then(response => {
        for (var i = 0; i < response.data.trivia_categories.length; i++) {
          let categoryObj = new Category({
            id: response.data.trivia_categories[i].id,
            name: response.data.trivia_categories[i].name
          })
          categoryObj.save(function (err, userUpdated) {
            if (err) return res.json(err)
          })
        }
        return res.send(200)
      })
      .catch(error => {
        console.log(error)
      })
  }

  CategoryFunctions.list = (req, res) => {
    Category.find({}, (err, categories) => {
      if (err) return res.json({ error: err })
      res.send(categories)
    })
      .sort('name')
  }

  return CategoryFunctions
}
