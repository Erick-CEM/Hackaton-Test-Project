const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
const votes = {};

io.on('connection', (socket) => {
  console.log('New client connected');
  let voteCount = 0;
  const totalUsers = 2; // Set this to the number of expected users
  const voteDuration = 30000; // 30 seconds

  socket.on('vote', (vote) => {
    voteCount++;
    votes[vote] = (votes[vote] || 0) + 1;
    io.emit('voteUpdate', votes);

    if (voteCount >= totalUsers) {
      io.emit('revealVotes', votes);
    }
  });

  setTimeout(() => {
    io.emit('revealVotes', votes);
  }, voteDuration);

  socket.on('disconnect', () => {
    votes[vote] = (votes[vote] || 0) + 1;
    io.emit('voteUpdate', votes);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 53777;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});