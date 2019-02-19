const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose').set('debug', true)
const passport = require('passport')
const path = require('path')
const auth = require('./auth')
const app = express()
const server = app.listen(80)
const io = require('socket.io').listen(server)
const user = require('./user.js')(io)
const category = require('./category.js')(io)
var VerifyToken = require('./VerifyToken')
auth(passport)
mongoose.connect('mongodb://jimbo:uniofpompey2019@ds123465.mlab.com:23465/quiz_trivia', {
  useNewUrlParser: true,
  useMongoClient: true
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(passport.initialize())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8082')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

  next()
})

let onlineUsers = {}

io.on('connection', function(socket) {
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
let room = require('./room.js')(io, onlineUsers)
app.get('/room/lobby/:id', (req, res) => {
  res.sendfile(path.join(__dirname, '..', 'client', 'dist'))
})
app.get('/room/lobby/:id/lobby', (req, res) => {
  res.sendfile(path.join(__dirname, '..', 'client', 'dist'))
})
app.get('/ranking', function (req, res) {
  res.json({ success: 'test' })
  res.sendfile(path.join(__dirname, '..', 'client', 'dist'))
})
app.post('/auth/google', user.google_callback)
app.get('/users', user.list)
app.get('/user/:token', user.getByTokenOrId)
app.post('/user', user.add)
app.post('/categories/sync', category.sync)
app.get('/categories', category.list)
app.post('/room', VerifyToken, room.add)
app.put('/room/:code', VerifyToken, room.joinRoom)
app.put('/room/:code/start', VerifyToken, room.startGame)
app.put('/room/:code/points', VerifyToken, room.addPoints)
app.put('/room/:code/finish', VerifyToken, room.finishGame)
app.put('/room/:code/message', VerifyToken, room.message)
app.put('/room/:code/user/:id', VerifyToken, room.kicKUser)
app.get('/room/:code', VerifyToken, room.getOne)
app.get('/api/ranking', room.getRanking)

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
