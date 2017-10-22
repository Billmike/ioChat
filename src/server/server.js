'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server is presently running....');

app.use(express['static'](__dirname + '/../client'));

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: %s connection(s) currently active.', connections.length);

  // Disconnect
  socket.on('disconnect', (data) => {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsername();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s connection(s) currently active.', connections.length);
  });

  // Message
  socket.on('send message', (data) => {
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });
  // User

  socket.on('new user', (data, callback) => {
    try {
      socket.username = data;
      users.push(socket.username);
      updateUsername();
      callback(true);
    } catch (error) {
      console.log("Create new user Error: ", error);
      callback(false);
    }
  });

  function updateUsername() {
    io.sockets.emit('get users', users);
  }
});