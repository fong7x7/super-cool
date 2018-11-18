const CollisionMath = require("../math/collision_math.js");
const PointMath = require("../math/point_math.js");
const Barrel = require("./barrel.js");
const Wall = require("./wall.js");
const Player = require("./player.js");
const Laser = require("./projectile/laser.js");
const Pistol = require("./weapon/pistol.js");
const Rifle = require("./weapon/rifle.js");
const Shotgun = require("./weapon/shotgun.js");

module.exports = class Game {
    constructor(){
        this.playerIds = new Set();
        this.laserIds = new Set();
        this.entities = {};
        this.previousEntities = {};
        this.currentEntityID = 0;
        this.updateTimeStamp = 0;
        this.newPlayerTimeStamp = 0;
        this.roundTime = 0;
        this.height = 720;
        this.width = 1280;

    };

    startRoundTime() {
        let game = this;
        setInterval(function() {
            game.roundTime += 1;
        }, 1000);
    }

    update() {
        this.fireWeapons();

        this.previousEntities = JSON.parse(JSON.stringify(this.entities)); // deep copy

        this.processProjectiles();
        this.updateEntityPositions();
        this.resetPlayerMovements();
        this.updateTimeStamp = new Date().getTime();
        this.roundTime = 0; // Reset round time once update is done
    }

    resetPlayerMovements() {
        this.playerIds.forEach((id) => {
            this.entities[id].movementConfirmed = false;
        })
    }

    arePlayersReady() {
        let ready = true;
        this.playerIds.forEach((id) => {
            if(!this.entities[id].movementConfirmed) {
                ready = false;
            }
        });
        return ready;
    }

    addEntity(entity) {
        console.log("Adding new entity (" + entity.type + "). ID: ", this.currentEntityID);
        entity.entityId = this.currentEntityID;
        this.entities[entity.entityId] = entity;
        this.currentEntityID++;

        if(entity.type === "player") {
            this.playerIds.add(entity.entityId);
        } else if(entity.type === "laser") {
            this.laserIds.add(entity.entityId);
        }

        return entity.entityId;
    }

    removeEntities(ids) {
        if(ids.length <= 0) { return; }
        let game = this;
        ids.forEach((id) => {
            delete game.entities[id];
        });
    }

    getEntity(id) {
        return this.entities[id];
    }

    fireWeapons() {
        let game = this;
        this.playerIds.forEach((id) => {
            let player = game.entities[id];
            let weapon = game.entities[player.equipedId];
            weapon.x = player.x;
            weapon.y = player.y;
            let projectiles = weapon.fire();
            projectiles.forEach((proj) => {
                game.addEntity(proj);
            });
        });
    }

    processProjectiles() {
        let entitiesHit = this.determineCollision();
        let game = this;
        let entitiesAlreadyHit = new Set();
        let lasersAlreadyHit = new Set();
        entitiesHit.forEach((hit) => {
            if(entitiesAlreadyHit.has(hit.entityId)) { return; }
            if(lasersAlreadyHit.has(hit.laserId)) { return; }

            let entity = game.entities[hit.entityId];
            entitiesAlreadyHit.add(hit.entityId);
            lasersAlreadyHit.add(hit.laserId);
            entity.lives -= 1;
            entity.deathTime = hit.time;
            game.entities[hit.laserId].deathTime = hit.time;
        });
    }

    updateEntityPositions() {
        let game = this;
        Object.keys(this.entities).forEach(function(id) {
            let entity = game.entities[id];
            if(!entity.physical) { return; }

            // increment position based on entity velocity in pixels/second
            entity.x += entity.vx;
            entity.y += entity.vy;
        });
    }

    determineCollision() {
        let entitiesHit = []; // hit_data = { time, entityId, laserId }
        let game = this;

        this.laserIds.forEach((laserId) => {
            let laser = game.entities[laserId];
            let predicted_laser = laser.predictPosition();
            let endpoint = laser.getEndPoint();
            let laser_mag = laser.getVelocityMagnitude();
            let predicted_endpoint = Laser.calculateEndPoint(predicted_laser, laser.getVelocityAngle(), laser.size);

            game.playerIds.forEach(function(id) {
                let entity = game.entities[id];
                if (laser.ownerId == entity.entityId) { return; } // skip if laser is owned by entity

                let path_hit_box = CollisionMath.createPathHitBox(entity.x, entity.y, entity.vx, entity.vy, entity.size);
                let intersection = CollisionMath.intersectsPolygon(path_hit_box, laser, predicted_endpoint);

                // skip if no intersection
                if (!intersection) { return; }

                let int_dist = PointMath.distance(endpoint, intersection);
                let time_hit = int_dist / laser_mag;

                // skip if laser doesn't actually hit player
                if (!Game.determineEntityHit(entity.predictPosition(time_hit), laser, predicted_laser)) { return; }

                // add every entity that gets hit by the laser and the time hit
                let hit = { time: time_hit, entityId: id, laserId: laserId};
                entitiesHit.push(hit);
            });
        });
        // sort all hits by time
        entitiesHit.sort((a, b) => {
            return a.time-b.time;
        });
        return entitiesHit;
    }

    static determineEntityHit(entity, start, end) {
        if(PointMath.distance(entity, start) <= entity.size/2) { return true; }
        if(PointMath.distance(entity, end) <= entity.size/2) { return true; }

        // determine if crossed
        return CollisionMath.intersectsPolygon(CollisionMath.createHitBox(entity), start, end);
    }

    createPlayer(name) {
        let weapon = Game.generateRandomWeapon();
        weapon.physical = false;
        this.addEntity(weapon);

        let player = new Player();
        player.name = name;
        player.x = Game.randomNumber(this.width);
        player.y = Game.randomNumber(this.height);
        player.color = Game.getRandomColor();
        player.addItem(weapon.entityId);
        this.addEntity(player);
        this.newPlayerTimeStamp = new Date().getTime();
        weapon.ownerId = player.entityId;

        return player;
    }

    createWalls(numOfWalls, width, height) {
        for (let i = 0; i < numOfWalls; i++) {
            let wall = new Wall();
            wall.x = Game.randomNumber(width);
            wall.y = Game.randomNumber(height);
            wall.size = 30;
            wall.wall_angle = Game.randomNumber(2*Math.PI) + - Math.PI; // random angle from -180 to 180
            this.addEntity(wall);
        }
    }

    createBarrels(numOfBarrels, width, height){
        for (let i = 0; i < numOfBarrels; i++) {
            let barrel = new Barrel();
            barrel.x = Game.randomNumber(width);
            barrel.y = Game.randomNumber(height);
            this.addEntity(barrel);
        }
    }

    static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static generateRandomWeapon() {
        let num = Game.randomNumber(3);

        if(num == 1) {
            return new Shotgun();
        } else if(num == 2) {
            return new Rifle();
        }
        return new Pistol();
    }

    static randomNumber(to) {
        return Math.ceil(Math.random() * to) - 1;
    }
};