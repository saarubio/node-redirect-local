/**
 * 
 * Client side , node + socke.io client
 * 
 */
const requests = require('requests');
const socket = require('socket.io-client')('http://localhost:8082');
socket.on('connect', function(){
    console.log("Client connected");
});

socket.on('new_request', function(data){
    const _this = this;
    console.log('New request');
    const request_id = data.request_id;
    //console.log(request_id);
    requests('https://app.workiz.com/api/Testn/test/', { streaming:false })
    .on('data', function (response) {
        _this.emit(request_id.toString(), response);
    })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
       console.log('end request forwarding');
    });

    
});


socket.on('disconnect', function(){
    console.log("adios");
});