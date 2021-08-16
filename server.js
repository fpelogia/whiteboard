/*Autor: Frederico José Ribeiro Pelogia
 *Fontes: 
    [1] - https://youtu.be/2hhEOGXcCvg
 * */
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("Servidor rodando!");

//var mj = require("mathjax");
var socket = require("socket.io");
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New connection:' + socket.id);
    socket.on('shapes', shapesMsg);

    function shapesMsg(data){
        socket.broadcast.emit('shapes', data);
        //caso precise mandar para o cliente que enviou tbm, usar:
        // io.sockets.emit('shapes', data);
        console.log(data);
    }
}
