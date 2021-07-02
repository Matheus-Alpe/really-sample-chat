
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = [];

io.on('connection', (socket) => {
    socket.on('send-nickname', (user) => {
        user.id = socket.id;
        users.push(user);
        io.emit('chat message', {
            nickname: `${user.nickname}`,
            message: `>> connected <<`
        });
    })

    socket.on('disconnect', () => {
        const user = users.find(user => user.id === socket.id);
        if (!user) return;
        io.emit('chat message', {
            nickname: `${user.nickname}`,
            message: `<< disconnected >>`
        });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
    console.log('listening on localhost:3000');
});