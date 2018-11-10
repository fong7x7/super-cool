var express = require('express');
var app = express();
const port = 8080;


//           Variables           //
var playersArray = [];
var playerCount = 0;
var windowWidth = 1280;
var windowHeight = 720;
var weaponsArray = ["shotgun", "grenade", "rocketLauncher"];
var itemsOnGroundArray = [];
var roundTimer = 0;


//           SERVER                 //

app.use(express.static(__dirname + '/public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gamestate', function (req, res) {
	res.json({players: playersArray, items: itemsOnGroundArray})
});

app.get('/heartbeat', function (req, res) {
	var allPlayersReady = playersArray.every(checkMovement);

	function checkMovement(player, index, array) {
		return player.movementConfirmed === true;
	}


	res.json({ ready: allPlayersReady, roundTime: roundTimer })
});

app.post('/player/action', function (req, res) {
	console.log("login in progress")
});

app.post('/player/login', function (req, res) {
	let name = "johnny";
	const player = createPlayer(name);
	console.log("player created");
	res.json(player.entityId);
});

app.listen(port, () => console.log(`Server running on ${port}!`));



//               ENTITIES               //

class Entity {
	constructor(id, x, y, angle, magnitude, entityType) {
		this.entityId = id;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.magnetude = magnitude;
		this.entityType = entityType;
	}

}

class Player extends Entity {
	constructor(id, x, y, angle, magnitude, entityType="player" ,lives=3, items=["pistol"], name){
		super(id, x, y, angle, magnitude, entityType)
		this.lives = lives;
		this.items = items;
		this.equiped = this.items[0];
		this.name = name;
		this.movementConfirmed = false;
	}
}

class Laser extends Entity {
	constructor(id, x, y, angle, magnitude, entityType='laser', ownerId) {
		super(id, x, y, angle, magnitude, entityType)
		this.entityType = 'laser'
		this.ownerId = ownerId
	}
}

class wall extends Entity {
	constructor(id, x, y, angle, magnitude, entityType, width=10, height=50) {
		super(id, x, y, angle, magnitude, entityType)
		this.width = width;
		this.height = height;
	}
}


class ItemGround {
	constructor() {
		this.x = randomNumber(windowWidth)
		this.y = randomNumber(windowHeight)
		this.entityType = weaponsArray[randomNumber(weaponsArray.length)]
		itemsOnGroundArray.push(this);
	}
}

class Item {
	constructor(name, ammo, angle ) {
		this.name = name;
		this.ammo = ammo;
		this.angle = angle;
	}
	fire() {
		console.log("fire")
	}
}




//                Functions             //
// constructor(id, x, y, angle, magnitude, entityType="player" ,lives=3, items=["pistol"], name){
	// constructor(name, entityId, ammo, angle ) {

function randomNumber(to){
	return Math.ceil(Math.random() * to) - 1;
}

function createPlayer(name) {
	//1280, 720
	playerCount += 1;
	newPlayer = new Player(playerCount, randomNumber(windowWidth), randomNumber(windowHeight), 0, 0, 'player', 3, new Item("pistol", 1000, 0), name );
	playersArray.push(newPlayer);
	return newPlayer
}


new ItemGround

setInterval(function(){
 ++roundTimer;
 if (roundTimer > 10) {roundTimer = 0}
}, 1000);