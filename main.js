var express = require('express');
var app = express();
const port = 8080;


//          Future Weapons        //
//           Variables           //

// TODO: link this
const game = new Game();

var windowWidth = 1280;
var windowHeight = 720;
var weaponsArray = ["barrel"];//"shotgun", "grenade", "rocketLauncher"];
var roundTimer = 0;
var numOfWalls = 8, wallsArray = [], numOfBarrels = 5, barrelsArray = [];
var newPlayerTimeStamp = 0;
var playersReadyTimeStamp = 0;
var guns = {'pistol': {'spread': 0.05, 'shots': 1, 'ammo': 50},'shotgun': {'spread': 0.15, 'shots': 5, 'ammo': 8 }, 'rifle': {'spread': 0.1, 'shots': 3, 'ammo': 12} };
//           SERVER                 //

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
        roundTime: roundTimer
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
    player.addItem(pistol.entityId);
    game.addEntity(player);
	game.newPlayerTimeStamp = new Date().getTime();

    console.log("Player created: " + player.entityId);

	res.json({ playerId: player.entityId});
});

app.listen(port, () => console.log(`Server running on ${port}!`));

//            Initiation Functions           //

function randomNumber(to){
	return Math.ceil(Math.random() * to) - 1;
}

setInterval(function(){
 ++roundTimer;
 if (roundTimer > 10) {roundTimer = 0}
}, 1000);