// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8081);
console.log('Server listening on port 8081');

function requestHandler(req, res) {
    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);
    // Read in the file they requested
    fs.readFile(__dirname + parsedUrl.pathname
        , // Callback function for reading
        function (err, data) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(data);
        });
}
// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection'
    , // We are given a websocket object in our function
    function (socket) {
        console.log("We have a new client: " + socket.id);
    
        // When this user "send" from clientside javascript, we get a "message"
        // client side: socket.send("the message");  or socket.emit('message', "the message");
        socket.on('message'
            , // Run this function when a message is sent
            function (data) {
                console.log("message: " + data);
                // Call "broadcast" to send it to all clients (except sender), this is equal to
                // socket.broadcast.emit('message', data);
                // To all clients, on io.sockets instead
                io.sockets.emit('message', data);
            });
    
        //Here is a socket function for if they use the drawing app
        socket.on('othermouse', function (data) {
            // Data comes in as whatever was sent, including objects
            console.log("Received: 'othermouse' " + data.x + " " + data.y);
            // Send it to all of the clients
            io.sockets.emit('othermouse', data);
        });
    
        //Here is a socket function for if a user is uploading an image
        socket.on('image', function (data) {
            // Data comes in as whatever was sent, including objects
            console.log("New Images posted");
            // Send it to all of the clients
            io.sockets.emit('image', data);
        });
        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    });