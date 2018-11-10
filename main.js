var express = require('express');
var app = express();
const port = 8080;



app.use(express.static(__dirname + '/public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gamestate', function (req, res) {
	console.log("login in progress")
});

app.get('/heartbeat', function (req, res) {
	console.log("login in progress")
});

app.post('/player/action', function (req, res) {
	console.log("login in progress")
});

app.post('/player/login', function (req, res) {
	console.log("login in progress")
});

app.listen(port, () => console.log(`Server running on ${port}!`));
