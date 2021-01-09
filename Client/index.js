/**
 * 
 * Client side , node + socke.io client
 * 
 */
const requests = require('requests');
var needle = require('needle');
const socket = require('socket.io-client')('http://localhost:8082');
socket.on('connect', function(){
    console.log("Client connected");
});

socket.on('new_request', function(data){

    console.log(data);
    const _this = this;
    console.log('New request');
    const request_id = data.request_id;
    //console.log(request_id);
    
    //'https://app.workiz.com/api/Testn/test/'
    
    const parseHeaders = () => {

        let headersParsed = {};
        let headersJson = JSON.parse(data.headers || {});
        if('host' in headersJson) delete headersJson['host'];
        if('accept-encoding' in headersJson) delete headersJson['accept-encoding'];
        if('connection' in headersJson) delete headersJson['connection'];
        if('accept' in headersJson) delete headersJson['accept'];
        if('content-length' in headersJson) delete headersJson['content-length'];
        if('cache-control' in headersJson) delete headersJson['cache-control'];
        // trying to leave only custom headers and content-type to keep it simple and naive 
        return headersJson;


    }

    if(data.method.toString().toLowerCase() == "get") 
    {
        //needle.get(url[, options][, callback])
        needle.get(process.env.REDIRECT_URL, function(err, resp) {
            _this.emit(request_id.toString(), resp.body);
        });
    }
    else 
    {
      //needle.post(url, data[, options][, callback])
      const options = {
        headers: parseHeaders()
      }
      
      needle.post(process.env.REDIRECT_URL, data.body, options, function(err, resp) {
         _this.emit(request_id.toString(), resp.body);
      });


    }
});


socket.on('disconnect', function(){
    console.log("adios");
});