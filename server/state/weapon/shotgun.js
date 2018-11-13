const Weapon = require("./weapon.js");
const Laser = require("../projectile/laser.js");

module.exports = class Shotgun extends Weapon {
    constructor() {
        super("shotgun");
        this.angleDeviation = 0.15;
        this.ammo = 10;
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        this.ammo -= 1;
        return [ // spread 3 lasers in different directions
            new Laser(this.x, this.y, Weapon.formatAngle(this.aim_angle - this.angleDeviation), this.aim_magnitude, this.ownerId),
            new Laser(this.x, this.y, this.aim_angle, this.aim_magnitude, this.ownerId),
            new Laser(this.x, this.y, Weapon.formatAngle(this.aim_angle + this.angleDeviation), this.aim_magnitude, this.ownerId)
        ];
    }
}