/**
 * 
 * Client side , node + socke.io client
 * 
 */
const requests = require('requests');
var needle = require('needle');
needle.defaults({
    user_agent: 'Client-Tunnel',
    decode_response:false,
    parse:false
});

const socket = require('socket.io-client')(process.env.SOCKET_SERVER_URL || 'http://localhost:8082');
socket.on('connect', function(){
    console.log("Connection Initiated");
});

socket.on('new_request', function(data){

    const _this = this;
    const request_id = data.request_id;

    const query_string = Object.keys(data.query).length > 0 ? "?" + new URLSearchParams(data.query).toString() : "";
    const url = process.env.REDIRECT_URL + data.path + query_string;
    console.log('url is ',url);
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
        needle.get(url, function(err, resp) {
            console.log(resp.statusCode);
            _this.emit(request_id.toString(), {
                cookies:resp.cookies || {},
                body:resp.body || {},
                headers:resp.headers || {}
            });
        });
    }
    else 
    {
      //needle.post(url, data[, options][, callback])
      const options = {
        headers: parseHeaders(),
        cookies: data.cookies
      }
      needle.post(url, data.body, options, function(err, resp) {
         

         _this.emit(request_id.toString(), {
             cookies:resp.cookies || {},
             body:resp.body || {},
             headers:resp.headers || {}
         });
      });
    }
});


socket.on('disconnect', function(){
    console.log("Connection Terminated");
});