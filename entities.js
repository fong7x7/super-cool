
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
		this.name = name
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

class Item {
	constructor(name, entityId, ammo) {
		this.name = name;
		this.entityId = entityId;
		this.ammo = ammo;
	}
	fire() {
		console.log("fire")
	}
}

var gun = new Item('pistol', 1, 3)
