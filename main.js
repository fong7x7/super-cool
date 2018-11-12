import Game from "./server/state/game.js";

var express = require('express');
var app = express();
const port = 8080;

const game = new Game();
game.startRoundTime();

var windowWidth = 1280;
var windowHeight = 720;

app.use(express.json());

app.use(express.urlencoded());

app.use(express.static(__dirname + '/web'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/html/index.html');
});

app.get('/gamestate', function (req, res) {
	res.json(game.entities);
});

app.get('/heartbeat', function (req, res) {
	res.json({
	    readyTimeStamp: game.updateTimeStamp,
        newPlayerTimeStamp: game.newPlayerTimeStamp,
        roundTime: game.roundTime
	});
});

app.post('/player/action', function (req, res) {
    // get player from game
	let player = game.getEntity(req.body.playerId);
	if(!player) {
	    console.log("Player by id " + req.body.playerId + " does not exist");
        res.json({playerActionReceived: false});
	    return;
    }

    // update equipped item if possible (before shooting)
    if (req.body.move.swap) {
        console.log("Player swapping weapons");
        player.equipItem(req.body.swap);
    }

    // update weapon aim for player
    let weapon = game.getEntity(player.equipedId);
	weapon.aim(req.body.shoot.angle, req.body.shoot.magnitude);

	// update player movement
	player.setMovement(req.body.move.angle, req.body.move.magnitude);
	player.movementConfirmed = true;

	// update turn if all players are ready
	if(game.arePlayersReady()) {
	    console.log("All players ready. Updating...");
	    game.update();
    }

	res.json({playerActionReceived: true})
});

app.post('/player/login', function (req, res) {
    let pistol = new Pistol();
    game.addEntity(pistol);

    let player = new Player();
    player.x = randomNumber(windowWidth);
    player.y = randomNumber(windowHeight);
    player.color = Game.getRandomColor();
    player.addItem(pistol.entityId);
    game.addEntity(player);
	game.newPlayerTimeStamp = new Date().getTime();

    console.log("Player created: " + player.entityId);

	res.json({ playerId: player.entityId});
});

app.listen(port, () => console.log(`Server running on ${port}!`));

function randomNumber(to){
	return Math.ceil(Math.random() * to) - 1;
}