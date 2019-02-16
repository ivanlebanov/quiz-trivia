var User = require('./models/User.js')
var jwt = require('jsonwebtoken')
var config = require('./config')

module.exports = function (io) {
  var UserFunctions = {}

  UserFunctions.google_callback = (req, res) => {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) return res.json(err)
      let userObj = null
      if (user) {
        user.set({
          token: req.body.token,
          occupation: ''
        })

        user.save(function (err, userUpdated) {
          if (err) return res.json(err)
          if (user) {
            var token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: 720 * 48 // expires in 24h
            })
            return res.status(200).json({ id: user._id, token: token })
          } else {
            return res.status(500).json({ error: 'User not found' })
          }
        })
      } else {
        userObj = new User({
          firstName: req.body.givenName,
          lastName: req.body.familyName,
          avatar: req.body.avatar,
          email: req.body.email,
          token: req.body.token,
          active: 1,
          created: new Date().toString()
        })

        userObj.save(function (err, user) {
          if (err) return res.json({ error: err })
          io.emit('NEW_USER', user)
          if (user) {
            var token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: 720 * 48 // expires in 24h
            })
            return res.status(200).json({ id: user._id, token: token })
          } else {
            return res.status(500).json({ error: 'User not found' })
          }
        })
      }
    })
  }

  UserFunctions.list = (req, res) => {
    User.find({}, (err, users) => {
      if (err) return res.json({ error: err })
      res.send(users)
    })
  }

  UserFunctions.getByTokenOrId = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    var objId = (req.params.token.length === 24) ? new ObjectId(req.params.token) : req.params.token

    User.findOne({
      $or: [{
        _id: objId
      }, {
        token: req.params.token
      }]
    }, (err, user) => {
      if (err) {
        return res.status(200).json(err)
      }
      return res.status(200).json(user)
    })
  }

  UserFunctions.add = (req, res) => {
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      created: new Date().toString()
    })

    user.save(function (err, user) {
      if (err) return res.json({ error: err })
      io.emit('NEW_USER', user)
      res.sendStatus(200)
    })
  }

  return UserFunctions
}
