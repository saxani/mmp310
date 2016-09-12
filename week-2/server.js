var http = require('http'); //Since it's online it requires http
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url'); //Since it's online it also has a url

//This is where we actually make our server listen on the port
httpServer.listen(8080); //This is the port you'd change
console.log('Server listening on port 8080'); //This is a comment that will read in terminal


//When there is a domain request, this will figure out what to serve up to the client
function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
	
	// Read in the file they requested
	
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

