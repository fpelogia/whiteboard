/*Autor: Frederico José Ribeiro Pelogia
 *Fontes: 
    [1] - https://youtu.be/2hhEOGXcCvg
 * */
var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;

var server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

app.use(express.static('.'));
console.log("Servidor rodando!");

//var mj = require("mathjax");
var socket = require("socket.io");
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New connection:' + socket.id);
    socket.on('data', dataMsg);
    socket.on('equation', eqMsg);
    socket.on('eq-rm', eqRmMsg);

    function dataMsg(data){
        socket.broadcast.emit('data', data);
        //caso precise mandar para o cliente que enviou tbm, usar:
        // io.sockets.emit('data', data);
        console.log(data);
    }

    function eqMsg(data){
        socket.broadcast.emit('equation', data);
        //caso precise mandar para o cliente que enviou tbm, usar:
        // io.sockets.emit('equation', data);
        console.log(data);
    }

    function eqRmMsg(data){
        socket.broadcast.emit('eq-rm', data);
        //caso precise mandar para o cliente que enviou tbm, usar:
        // io.sockets.emit('eq-rm', data);
        console.log(data);
    }
}
