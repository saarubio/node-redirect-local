/**
 * Server side , web + socket.io
 *  
 */
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const forms = multer();
const app = express();

/**
 *  Let's start socket server 
 * 
 */

const IOapp = require('express')();
const IOserver = require('http').createServer(IOapp);
const io = require('socket.io')(IOserver);
let GlobalSocket = {};
io.on('connection', socket => {
    GlobalSocket = socket; //one socket connection
    //console.log('got request');
    // socket.emit('request', /* … */); // emit an event to the socket
    // io.emit('broadcast', /* … */); // emit an event to all connected sockets
    // socket.on('reply', () => { /* … */ }); // listen to the event
});

console.log('Io Listening on 8082');
IOserver.listen(8082);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(forms.array()); 

app.post('/', (req, res) => {
    const request_id = new Date().getTime();
    // console.log('Got body POST:', req.body);
    // console.log('ID:', request_id);
    GlobalSocket.on(request_id.toString(), (data) => {
        console.log('got my handshake for ',request_id);
        res.send(data);
        res.sendStatus(200);
    }); // listen to the event
    GlobalSocket.emit('new_request', {"request_id":request_id.toString()}); // emit an event to the socket
});

app.get('/', (req, res) => {
    // console.log('Got body GET:', req.query);
    res.sendStatus(200);
});


app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));




