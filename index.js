const express = require('express');
const socket = require('socket.io');


const app = express();
if (process.env.PORT !== undefined) {
  app.set('port', process.env.PORT);
} else {
  app.set('port', 3000);
}

app.use(express.static('public'));

// Listen to port
var server = app.listen(app.get('port'), function() {
    console.log(`Listen to requests on port ${app.get('port')}`);
});


// socket setup
var io = socket(server);

io.on('connection', (socket) => {
  console.log("Connected to socket", socket.id);

  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });

  socket.on('typing', (data) => {
    console.log(data + " is typing");

    socket.broadcast.emit('typing', data);
  });
});



