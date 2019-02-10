const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose').set('debug', true)
const passport = require('passport')
const auth = require('./auth')
const app = express()
const server = app.listen(3000)
const io = require('socket.io').listen(server)
const user = require('./user.js')(io)
// var VerifyToken = require('./VerifyToken')
auth(passport)
mongoose.connect('mongodb://jimbo:uniofpompey2019@ds123465.mlab.com:23465/quiz_trivia', { useNewUrlParser: true })
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(passport.initialize())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8082')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

  next()
})

let onlineUsers = {}

io.on('connection', function (socket) {
  socket.on('SET_SOCKET_USER', (userTokenOrId) => {
    if (!onlineUsers[userTokenOrId]) {
      onlineUsers[userTokenOrId] = []
    }
    onlineUsers[userTokenOrId].push(socket.id)
    io.emit('USERS_ONLINE', onlineUsers)
  })

  socket.on('disconnect', (userTokenOrId) => {
    let users = Object.keys(onlineUsers)

    for (var i = 0; i < users.length; i++) {
      for (var m = 0; m < onlineUsers[users[i]].length; m++) {
        if (onlineUsers[users[i]][m] === socket.id) {
          onlineUsers[users[i]].splice(m, 1)
        }
      }
      if (onlineUsers[users[i]].length === 0) {
        delete onlineUsers[users[i]]
      }
    }

    io.emit('USERS_ONLINE', onlineUsers)
  })
})

app.get('/', (req, res) => res.sendStatus(200))
app.post('/auth/google', user.google_callback)
app.get('/users', user.list)
app.get('/user/:token', user.getByTokenOrId)
app.post('/user', user.add)