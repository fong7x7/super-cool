var http = require('http');
var fs = require('fs');
var url = require('url');


http.createServer(function (req, res) {
	// console.log(req);
	fs.readFile('startup.html', function(err, data) {
		if (err) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		}
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	})

}).listen(8080);