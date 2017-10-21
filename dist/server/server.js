'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = new _socket2.default(server);
var users = [];
var connections = [];
var port = process.env.PORT || 3000;
server.listen(port);

console.log('Server is presently running at http://localhost:', port);

app.use(_express2.default['static'](__dirname + '/../client'));

io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log('Connected: %s connection(s) currently active.', connections.length);

  // Disconnect
  socket.on('disconnect', function (data) {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsername();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s connection(s) currently active.', connections.length);
  });

  // Message
  socket.on('send message', function (data) {
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });
  // User

  socket.on('new user', function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsername();
  });

  function updateUsername() {
    io.sockets.emit('get users', users);
  }
});