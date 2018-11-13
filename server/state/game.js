import CollisionMath from "../math/collision_math.js";
import PointMath from "../math/point_math.js";
import Barrel from "./barrel.js";
import Wall from "./wall.js";
import Player from "./player.js";
import Laser from "./projectile/laser.js";
import Pistol from "./weapon/pistol.js";
import Rifle from "./weapon/rifle.js";
import Shotgun from "./weapon/shotgun.js";

function randomNumber(to) {
    return Math.ceil(Math.random() * to) - 1;
}

export default class Game {
    contructor(){
        this.playerIds = new Set();
        this.laserIds = new Set();
        this.entities = {};
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
        this.processProjectiles();
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
        for(let i = 0; i < this.playerIds.length; i++) {
            if(!this.entities[this.playerIds[i]].movementConfirmed) {
                return false;
            }
        }
        return true;
    }

    addEntity(entity) {
        entity.entityId = this.currentEntityID;
        this.entities[entity.entityId] = entity;
        this.currentEntityID++;

        if(entity.prototype instanceof Player) {
            this.playerIds.push(entity.entityId);
        } else if(entity.prototype instanceof Laser) {
            this.laserIds.push(entity.entityId);
        }

        return entity.entityId;
    }

    updateEntity(id, data) {
        this.entities[id] = data;
    }

    getEntity(id) {
        return this.entities[id];
    }

    fireWeapons() {
        let game = this;
        this.playerIds.forEach((id) => {
            let player = game.entities[id];
            let weapon = game.entities[player.equipedId];
            let projectiles = weapon.fire();
            projectiles.forEach((proj) => {
                game.addEntity(proj);
            });
        });
    }

    processProjectiles() {
        let hitIds = this.determineCollision();
        let game = this;
        hitIds.forEach((id) => {
            let entity = game.entities[id];
            if(entity.prototype instanceof Player) {
                entity.lives -= 1;
            } else if(entity.prototype instanceof Laser) {
                game.entities[id] = null;
                game.laserIds.remove(id);
            }
        });
    }

    determineCollision() {
        let entitiesHit = new Set();

        for (let i = 0; i < lasers.length; i++) {
            let laser = lasers[i];
            let predicted_laser = laser.predictPosition(laser);
            let closest_time = -1;
            let closest_entity_hit_id = -1;

            Object.keys(this.entities).forEach(function(id) {
                let entity = this.entities[id];
                if (laser.ownerId == entity.entityId) { return; } // skip if laser is owned by entity
                if (entity.type == 'laser') { return; } // skip if entity is laser
                if (!entity.physical) { return; } // skip non-physical objects

                let intersection = CollisionMath.intersects(laser, predicted_laser, entity, entity.predictPosition());
                if (!intersection) { return; } // skip if no intersection

                let mag = PointMath.distance(laser, intersection);
                let time_hit = mag / laser.magnitude;

                // skip if laser is not going to hit entity closer
                if (closest_time != -1 && time_hit > closest_time) { return; }

                if (Game.determineEntityHit(entity.predictPosition(time_hit), laser)) {
                    closest_time = time_hit;
                    closest_entity_hit_id = entity.entityId;
                }
            });

            if (closest_time > -1) {
                entitiesHit.add(laser.entityId);
                entitiesHit.add(closest_entity_hit_id);
            }
        }

        return entitiesHit;
    }

    static createHitBox(entity) {
        let offset = entity.size/2;

        return [
            { x: (entity.x-offset), y: (entity.y+offset) },
            { x: (entity.x+offset), y: (entity.y+offset) },
            { x: (entity.x+offset), y: (entity.y-offset) },
            { x: (entity.x-offset), y: (entity.y-offset) }
         ]
    }

    static determineEntityHit(entity, laser) {
        let next_laser = laser.getEndPoint();

        if(PointMath.distance(entity, laser) <= entity.size) { return true; }
        if(PointMath.distance(entity, next_laser) <= entity.size) { return true; }

        // determine if crossed
        return CollisionMath.intersectsPolygon(Game.createHitBox(entity), laser, next_laser);
    }

    createPlayer(name) {
        let weapon = Game.generateRandomWeapon();
        this.addEntity(weapon);

        let player = new Player();
        player.name = name;
        player.x = randomNumber(this.width);
        player.y = randomNumber(this.height);
        player.color = Game.getRandomColor();
        player.addItem(pistol.entityId);
        this.addEntity(player);
        this.newPlayerTimeStamp = new Date().getTime();

        return player.entityId;
    }

    createWalls(numOfWalls, width, height) {
        for (let i = 0; i < numOfWalls; i++) {
            let wall = new Wall();
            wall.x = randomNumber(width);
            wall.y = randomNumber(height);
            wall.size = 30;
            wall.angle = randomNumber(2*Math.PI) + - Math.PI; // random angle from -180 to 180
            this.addEntity(wall);
        }
    }

    createBarrels(numOfBarrels, width, height){
        for (let i = 0; i < numOfBarrels; i++) {
            let barrel = new Barrel();
            barrel.x = randomNumber(width);
            barrel.y = randomNumber(height);
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
        let num = randomNumber(3);

        if(num == 1) {
            return new Shotgun();
        } else if(num == 2) {
            return new Rifle();
        }
        return new Pistol();
    }
}