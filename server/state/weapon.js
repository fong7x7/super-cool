function randomNumber(to) {
    return Math.ceil(Math.random() * to) - 1;
}

class Weapon extends Entity {
    constructor(name) {
        super();
        this.name = name;
        this.ammo = 1;
        this.angleDeviation = 1;
        this.ownerId = -1;
        this.physical = false;
        this.aim_angle = 0;
        this.aim_magnitude = 0;

        // abstract class check
        if (new.target === Weapon) {
            throw new TypeError("Cannot construct Weapon instances directly");
        }
        if (this.fire === undefined) {
            throw new TypeError(new.target + " Class must implement fire function");
        }
    }

    aim(angle, mag) {
        this.aim_angle = angle;
        this.aim_magnitude = mag;
    }
}

class Pistol extends Weapon {
    constructor() {
        super("pistol");
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        let spread_angle = this.aim_angle + (randomNumber(this.angleDeviation*2) - this.angleDeviation);
        this.ammo -= 1;
        return [
            new Laser(this.x, this.y, spread_angle, this.aim_magnitude, this.ownerId)
        ];
    }
}