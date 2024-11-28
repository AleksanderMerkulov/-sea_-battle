const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


function create_user(socket_id, name){
    return {
        socket_id: socket_id,
        name: name,
        game_status: false, //готов к игре или нет
        hod: false, //ходит или ждёт удара
        game_card: {
            4: [],
            3: [],
            2: [],
            1: [],
        }
    }
}

users = {
    0: create_user()

}


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('login', (user)=>{

    })

    socket.on('ready', ()=>{

        socket.emit('rival_ready')
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
