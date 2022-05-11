const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const { Socket } = require('socket.io-client');
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);

const io = new Server(server)

const userSocketMap = {};
function getAllConnectedClient(roomId){
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) =>{
        return{
            socketId,
            username: userSocketMap[socketId],
        }
    });
}

io.on('connection',(socket) =>{
    console.log('socket connected ',socket.id);
    socket.on(ACTIONS.JOIN,({roomId , username}) =>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClient(roomId);
    });
})




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))