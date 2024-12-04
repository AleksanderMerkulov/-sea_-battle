const express = require('express');
// const socketIo = require('socket.io');

const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

const http = require('http').Server(app)
const cors = require('cors')
const io = require('socket.io')(http, {
    cors: {
        origin: [
            `http://127.0.0.1:3000`,
            `http://localhost:3000`]
    }
})


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

    console.log(socket.id)

    console.log('New client connected');

    socket.on('Login', (user)=>{
        console.log(user)

        socket.emit('login response', {})

    })

    socket.on('ready', ()=>{

        socket.emit('rival_ready')
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// server.listen(4000, () => {
//     console.log('Server is running on port 4000');
// });

http.listen(4000, ()=>{
    console.log('Server is working')
})