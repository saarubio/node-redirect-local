# node-redirect-local
# A simple implementation for a local "Ngrok" using Express, Needle And Socket.IO

To Install:

# Server
use any remote machine with node 
1. Download repository 
2. Go to "Server" folder 
3. ``` npm i  ```
4. type ``` export SERVER_PORT=5000 && export IO_PORT=5001  && node index.js  ``` (use any ports ofyour choice) 
(You can use reverse proxy or any other moethod to expose your service)

# Client 

1. Download the repository to your local machine
2. Go to "Client" folder 
3. ``` npm i ```
4. type  ``` export REDIRECT_URL=[Your localhost URL]  &&  export SOCKET_SERVER_URL=[Your Exposed Server]:IO_PORT &&  node index.js ```
