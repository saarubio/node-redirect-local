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
const IO_PORT = process.env.IO_PORT || 8082;
console.log(`Io Listening on ${IO_PORT}`);
IOserver.listen(IO_PORT);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(forms.array()); 

app.post('/', (req, res) => {
    const request_id = new Date().getTime();
    GlobalSocket.on(request_id.toString(), (data) => {
        
        console.log('got my handshake for ',request_id);
        // transfer cookies - at the moment as session cookies - need to be solved or do global setting 
        try 
        {
            for(const key in data.cookies)
            {
                res.cookie(key, data.cookies[key]);
            }    
        } 
        catch (error) { /* do nothing */ }
        try 
        {
            for(const key in data.headers)
            {
                res.header(key, data.headers[key]);
            }    
        }catch (error) { /* do nothing */ }

        res.send(data.body);
        //res.sendStatus(200);
    }); // listen to the event
    GlobalSocket.emit('new_request', {
        "request_id":request_id.toString(),
        body:JSON.stringify(req.body),
        headers:JSON.stringify(req.headers),
        cookies:JSON.stringify(req.cookies),
        method:"post"
    }); // emit an event to the socket
});

app.get('/', (req, res) => {
 
    const request_id = new Date().getTime();
    GlobalSocket.on(request_id.toString(), (data) => {
        console.log('got my handshake for non',request_id);
        try 
        {
            for(const key in data.cookies)
            {
                res.cookie(key, data.cookies[key]);
            }    
        } 
        catch (error) { /* do nothing */ }
        try 
        {
            for(let key in data.headers)
            {
                res.header(key, data.headers[key]);
            }    
        }catch (error) { /* do nothing */ }
        res.send(data.body);
    }); // listen to the event


    GlobalSocket.emit('new_request', {
        "request_id":request_id.toString(),
        body:JSON.stringify(req.query),
        headers:JSON.stringify(req.headers),
        cookies:JSON.stringify(req.cookies),
        method:"get"
    }); // emit an event to the socket


});


app.listen(process.env.SERVER_PORT || 8080, () =>  {
    console.log(`Started server at http://localhost:${process.env.SERVER_PORT || 8080}!`);
});




