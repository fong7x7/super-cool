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

app.use(express.json());

app.use(express.urlencoded());

app.use(express.static(__dirname + '/public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gamestate', function (req, res) {
	res.json({players: playersArray, items: itemsOnGroundArray})
});

app.get('/heartbeat', function (req, res) {
	var allPlayersReady = false
	if (playersArray.length != 0) {
		allPlayersReady = playersArray.every(checkMovement);
		function checkMovement(player, index, array) {
			return player.movementConfirmed === true;
		}
	}


	res.json({ ready: allPlayersReady, roundTime: roundTimer })
});

app.post('/player/action', function (req, res) {
	console.log(req)
	json = {playerId: 1, move: {angle: 20, magnitude: 40}, shoot: {angle: 30, magnitude: 60}, swap: null}
	console.log(json["playerId"])
	currentPlayer = getPlayerById(json["playerId"])
	currentPlayer.setMovement(json["move"]["angle"], json["move"]["magnitude"]);
	currentPlayer.aimWeapon(json["shoot"]["angle"], json["shoot"]["magnitude"]);
	if (json["swap"] == null) {
		console.log("noSwap");
	} else {
		currentPlayer.swapWeapon(json["swap"]);
	}
	currentPlayer.movementConfirmed = true;
	res.json({playerActionReceived: true})
});

app.post('/player/login', function (req, res) {
	const player = createPlayer(req.body.name);
	console.log("player created");
	res.json({ playerId: player.entityId});
});

app.listen(port, () => console.log(`Server running on ${port}!`));



//               ENTITIES               //

class Entity {
	constructor(id, x, y, angle, magnitude, entityType) {
		this.entityId = id;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.magnitude = magnitude;
		this.entityType = entityType;
	}

	setMovement(angle, magnitude) {
		this.angle = angle;
		this.magnitude = magnitude;
	}

}

class Player extends Entity {
	constructor(id, x, y, angle, magnitude, entityType="player" ,lives=3, item="pistol", name){
		super(id, x, y, angle, magnitude, entityType)
		this.lives = lives;
		this.equiped = item;
		this.items = [item];
		console.log(this.items);
		this.name = name;
		this.movementConfirmed = false;
	}
	aimWeapon(angle, magnitude) {
		console.log(this.equiped);
		this.equiped.angle = angle;
	}
	swapWeapon(index) {
		this.equiped = this.items[index];
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

function getPlayerById(id){
	return playersArray.find(myFunction);
	function myFunction(player, index, array){
		return player.entityId === id;
	}
}

new ItemGround

setInterval(function(){
 ++roundTimer;
 if (roundTimer > 10) {roundTimer = 0}
}, 1000);

//                         Math Engine              //

class Polygon {
    constructor() {
        this.points = [];
    }

    add(point) {
        this.points.push(point);
    }

    size() {
        return this.points.length;
    }

    last() {
        if(this.points.length == 0) {
            return new Point(0,0);
        }
        return this.points[this.points.length-1];
    }

    at(i) {
        return this.points[i];
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Determines if a the point is equal to the given point
     * @param point2
     * @returns {boolean}
     */
    equals(point2) {
        return this.x == point2.x && this.y == point2.y;
    }

    /**
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static add(point1, point2) {
        return new Point(point1.x + point2.x, point1.y + point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static sub(point1, point2) {
        return new Point(point1.x - point2.x, point1.y - point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static multiply(point1, point2) {
        return new Point(point1.x * point2.x, point1.y * point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static divide(point1, point2) {
        return new Point(point1.x / point2.x, point1.y / point2.y);
    }

    /**
     *
     * @param v
     * @param w
     * @returns {number}
     */
    static cross(v, w) {
        return ((v).x*(w).y - (v).y*(w).x);
    }

    /**
     *
     * @param point1
     * @param value
     * @returns {Point}
     */
    static scale(point1, value) {
        return new Point(point1.x * value, point1.y * value);
    }

    /**
     *
     * @param point1
     * @param value
     * @returns {Point}
     */
    static divideByNum(point1, value) {
        return new Point(point1.x / value, point1.y / value);
    }

    /**
     * @param a
     * @param b
     * @returns {number}
     */
    static distance(a, b) {
        let delta_x = b.x - a.x;
        let delta_y = b.y - a.y;

        return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
    }
}

class MathEngine {
    /**
     *
     * @param polygon1
     * @param polygon2
     * @returns {boolean}
     */
    static collides(polygon1, polygon2) {
        let p1 = polygon1.last();
        for(let i = 0; i < polygon1.size(); i++) {
            let p2 = polygon1.at(i);

            if(MathEngine.intersectsPolygon(polygon2, p1, p2)) {
                return true;
            }

            p1 = p2;
        }
        return false
    }

    /**
     *
     * @param polygon
     * @param q1
     * @param q2
     * @returns {boolean}
     */
    static intersectsPolygon(polygon, q1, q2) {
        let p1 = polygon.last();
        for(let i = 0; i < polygon.size(); i++) {
            let p2 = polygon.at(i);

            if(MathEngine.intersects(p1, p2, q1, q2)) {
                return true;
            }

            p1 = p2;
        }
        return false
    }

    /**
     * Determines if two line segments starting from p1 to p2 and q1 to q2 cross.
     * Uses vector math to determine if they cross.
     * @param p1
     * @param p2
     * @param q1
     * @param q2
     * @return boolean if the segments intersect
     */
    static intersects(p1, p2, q1, q2) {
        if(MathEngine.isOnLine(p1, q1, q2)) {
            return true;
        }
        if(MathEngine.isOnLine(q1, p1, p2)) {
            return true;
        }
        if(MathEngine.isOnLine(q2, p1, p2)) {
            return true;
        }
        if(MathEngine.isOnLine(p2, q1, q2)) {
            return true;
        }

        let r = Point.sub(p2, p1);
        let s = Point.sub(q2, q1);

        let u = Point.cross((p1-q1), r)/Point.cross(s,r);
        let cross_r_s = Point.cross(r,s);

        if(cross_r_s == 0) { return false; }

        let t = Point.cross((q1-p1), s)/cross_r_s;

        return (0 < t && t < 1) && (0 < u && u < 1);
    }

    /**
     * Determines if a given point is on the line between a and b
     * @param check_point
     * @param a
     * @param b
     * @returns {boolean}
     */
    static isOnLine(check_point, a, b) {
        if(check_point.equals(a)) { return true; }
        if(check_point.equals(a)) { return true; }

        return MathEngine.distance(a, check_point) + MathEngine.distance(b, check_point) <= MathEngine.distance(a,b) + 0.00000001;
    }

}