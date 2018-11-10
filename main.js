var express = require('express');
var app = express();
const port = 8080;


//          Future Weapons        //
//           Variables           //
var playersArray = [];
var lasers = [];
var laser_id = 1;
var playerCount = 0;
var windowWidth = 1280;
var windowHeight = 720;
var weaponsArray = ["barrel"];//"shotgun", "grenade", "rocketLauncher"];
var itemsOnGroundArray = [];
var roundTimer = 0;
var numOfWalls = 8, wallsArray = [], numOfBarrels = 5, barrelsArray = [];
var newPlayerTimeStamp = 0;
var playersReadyTimeStamp = 0;
var guns = {'pistol': {'spread': 10, 'shots': 1, 'ammo': 50},'shotgun': {'spread': 45, 'shots': 5, 'ammo': 8 }, 'rifle': {'spread': 25, 'shots': 3, 'ammo': 12} };
//           SERVER                 //

app.use(express.json());

app.use(express.urlencoded());

app.use(express.static(__dirname + '/public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gamestate', function (req, res) {
	res.json({players: playersArray, lasers: lasers, items: itemsOnGroundArray, walls: wallsArray, barrels: barrelsArray});
});

app.get('/heartbeat', function (req, res) {
	res.json({ readyTimeStamp: playersReadyTimeStamp, newPlayerTimeStamp: newPlayerTimeStamp, roundTime: roundTimer })
});

app.post('/player/action', function (req, res) {
	let index = getPlayerIndexByID(req.body.playerId);
	let currentPlayer = playersArray[index];
	currentPlayer.setMovement(req.body.move.angle, req.body.move.magnitude);
	currentPlayer.aimWeapon(req.body.shoot.angle, req.body.shoot.magnitude);
	if (!req.body.move.swap) {
		console.log("noSwap");
	} else {
		currentPlayer.swapWeapon(req.body.swap);
	}
	currentPlayer.movementConfirmed = true;

    if (playersArray.length > 0) {
        let allPlayersReady = true;
    	for(let i = 0; i < playersArray.length; i++) {
    		if(playersArray[i].movementConfirmed !== true) {
    			allPlayersReady = false;
    			break;
			}
		}
		console.log('Players ready? ' + allPlayersReady);
		if(allPlayersReady) {
            playersReadyTimeStamp = new Date().getTime();
            update();
		}
    }

	res.json({playerActionReceived: true})
});

app.post('/player/login', function (req, res) {
	const player = createPlayer(req.body.name);
	console.log("player created");
	newPlayerTimeStamp = new Date().getTime();
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
		this.name = name;
		this.movementConfirmed = false;
		this.size = 10;
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
	constructor(id, x, y, angle, magnitude, ownerId) {
		super(id, x, y, angle, magnitude, 'laser');
		this.ownerId = ownerId;
        this.size = 30;
	}
}

class Wall extends Entity {
	constructor(id, x, y, angle, magnitude, entityType, width=10, height=50) {
		super(id, x, y, angle, magnitude, entityType)
		this.width = width;
		this.height = height;
		wallsArray.push(this);
	}
}


class ItemGround {
	constructor(isBarrel=false) {
		this.x = randomNumber(windowWidth)
		this.y = randomNumber(windowHeight)
		this.pickupAble = true;
		if (isBarrel) {
			this.entityType = "barrel";
		} else {
			this.entityType = weaponsArray[randomNumber(weaponsArray.length)];
		}
		if (this.entityType == "barrel") {
			barrelsArray.push(this);
		} else {
			itemsOnGroundArray.push(this);
		}
	}
}
// var guns = {'pistol': {'spread': 10, 'shots': 1, 'ammo': 50},'shotgun': {'spread': 45, 'shots': 5, 'ammo': 8 }, 'rifle': {'spread': 25, 'shots': 3, 'ammo': 12} };

class Item {
	constructor(name, ammo, angle ) {
		this.name = name;
		this.ammo = guns[this.name]["ammo"];
		this.angle = angle;
		this.angleDeviation = guns[this.name]["spread"];

	}
}


//            Initiation Functions           //
createWalls(numOfWalls);
createBarrels(numOfBarrels);




//                Functions             //
// constructor(id, x, y, angle, magnitude, entityType="player" ,lives=3, items=["pistol"], name){
	// constructor(name, entityId, ammo, angle ) {
	// constructor(id, x, y, angle, magnitude, entityType='laser', ownerId) {

function randomNumber(to){
	return Math.ceil(Math.random() * to) - 1;
}

function createPlayer(name) {
	//1280, 720
	playerCount += 1;
	newPlayer = new Player(playerCount, randomNumber(windowWidth), randomNumber(windowHeight), 0, 0, 'player', 3, new Item(Object.keys(guns)[0], 1000, 0), name );
	playersArray.push(newPlayer);
	return newPlayer
}

function getPlayerIndexByID(id){
    for(let i = 0; i < playersArray.length; i++) {
        if(playersArray[i].entityId == id) {
            return i;
        }
    }
    return null;
}

function createWalls(numOfWalls){
	for (let i = 0; i < numOfWalls; i++) {
// constructor(id, x, y, angle, magnitude, entityType, width=10, height=50) {
		new Wall(1, randomNumber(windowWidth), randomNumber(windowHeight), 'wall', 4, randomNumber(50) + 10);
	}
}

function createBarrels(numOfBarrels){
	for (i = 0; i < numOfBarrels; i++) {
		new ItemGround(true);
	}
}

//                 Update Function             //
function update() {
    // spawn lasers
	playersArray.forEach((player) => {
	    let weapon = player.equiped;
        if (weapon.ammo > 0) {
            for(let i = 0; i < guns[weapon.name]['shots']; i++) {
                let angleOfLaser = weapon.angle + (randomNumber(weapon.angleDeviation * 2) - weapon.angleDeviation);
                let laser = new Laser(laser_id, player.x, player.y, angleOfLaser, 250, player.entityId);
                lasers.push(laser);
                laser_id++;
            }
            weapon.ammo -= 1;
        }

        player.movementConfirmed = false;
    });

	let result = determineCollision();
    result.playersHit.forEach((index) => {
        let player = playersArray[index];
        player.lives -= 1;
        player.x = randomNumber(windowWidth);
        player.y = randomNumber(windowHeight);
        player.vx = 0;
        player.vy = 0;
    });
    playersArray = playersArray.filter((player) => {
        return player.lives > 0;
    });

    result.lasersHit.forEach((index)=> {
        lasers[index] = null; // remove laser!
    });

    lasers = lasers.filter((laser)=> {
        return laser != null;
    });

    new ItemGround();
}

function determineCollision() {
    let result = {
        playersHit: [],
        lasersHit: []
    };
    for(let i = 0; i < lasers.length; i++) {
        let laser = lasers[i];
        let q1 = new Point(laser.x, laser.y);
        let q2 = new Point(laser.x+Math.cos(laser.angle)*laser.magnitude, laser.y+Math.sin(laser.angle)*laser.magnitude);
        let closest_time = -1;
        let closest_player_index = 0;

        for(let j = 0; j < playersArray.length; j++) {
            let player = playersArray[j];
            let p1 = new Point(player.x, player.y);
            let p2 = new Point(player.x+Math.cos(player.angle)*player.magnitude, player.y+Math.sin(player.angle)*player.magnitude);

            let intersection = MathEngine.intersects(p1, p2, q1, q2);
            if(intersection) {
                let dx = intersection.x-q1.x;
                let dy = intersection.y-q1.y;
                let mag = Math.sqrt(dx*dx+dy*dy);
                let time_hit = mag/laser.magnitude;
                if(closest_time == -1 || time_hit < closest_time) {
                    let player_at_time = new Point(player.x+Math.cos(player.angle)*player.magnitude*time_hit, player.y+Math.sin(player.angle)*player.magnitude*time_hit);
                    if(determinePlayerHit(player_at_time, player.size, laser)) {
                        closest_time = time_hit;
                        closest_player_index = j;
                    }
                }
            }
        }
        if(closest_time > -1) {
            result.playersHit.push(closest_player_index);
            result.lasersHit.push(i);
        }
    }

    return result;
}

function determinePlayerHit(player, player_size, laser) {
    let poly = new Polygon();
    let offset = player_size/2;
    poly.add(new Point(player.x-offset, player.y+offset));
    poly.add(new Point(player.x+offset, player.y+offset));
    poly.add(new Point(player.x+offset, player.y-offset));
    poly.add(new Point(player.x-offset, player.y-offset));

    let q1 = new Point(laser.x, laser.y);
    let q2 = new Point(laser.x+Math.cos(laser.angle)*laser.size, laser.y+Math.sin(laser.angle)*laser.size);

    return MathEngine.intersectsPolygon(poly, q1, q2);
}

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
     * @return {Point} if the segments intersect
     */
    static intersects(p1, p2, q1, q2) {
        if(MathEngine.isOnLine(p1, q1, q2)) {
            return p1;
        }
        if(MathEngine.isOnLine(q1, p1, p2)) {
            return q1;
        }
        if(MathEngine.isOnLine(q2, p1, p2)) {
            return q2;
        }
        if(MathEngine.isOnLine(p2, q1, q2)) {
            return p2;
        }

        let r = Point.sub(p2, p1);
        let s = Point.sub(q2, q1);

        let u = Point.cross((p1-q1), r)/Point.cross(s,r);
        let cross_r_s = Point.cross(r,s);

        if(cross_r_s == 0) { return null; }

        let t = Point.cross((q1-p1), s)/cross_r_s;

        if((0 < t && t < 1) && (0 < u && u < 1)) {
            return Point.add(p1, Point.scale(r, t));
        }
        return null;
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

        return Point.distance(a, check_point) + Point.distance(b, check_point) <= Point.distance(a,b) + 0.00000001;
    }

}