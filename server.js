const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

var connections = {};
users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server is presently running....');

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));


io.sockets.on('connection', (socket) => {
    console.log('Connected: %s connection(s) currently active.', connections.length);

    // Disconnect
    socket.on('disconnect', (data) => {
        if (!socket.username) return;
        delete connections[socket.username];
        updateUsername();
        delete users[socket.username];
        console.log('Disconnected: %s connection(s) currently active.', connections.length);
    });
    // Message
    socket.on('send message', (data) => {
        console.log(data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });
    // User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        connections[socket.username] = socket;
        updateUsername();
    });

    socket.on('private message', (data) => {
      var user = data[0];
      var message = data[1];
      if(user in connections){
        connections[user].emit("private message", [user, message]);
      }else{
        socket.emit("error-msg", "User " + user + " does not exist!");
      }
    })

    function updateUsername() {
        io.sockets.emit('get users', users);
    }
});
