const Weapon = require("./weapon.js");
const Laser = require("../projectile/laser.js");
const AngleMath = require("../../math/angle_math.js");

module.exports = class Shotgun extends Weapon {
    constructor() {
        super("shotgun");
        this.angleDeviation = 0.15;
        this.ammo = 10;
        this.type = "shotgun";
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        this.ammo -= 1;
        return [ // spread 3 lasers in different directions
            new Laser(this.x, this.y, AngleMath.formatAngle(this.aim_angle - this.angleDeviation), this.ownerId),
            new Laser(this.x, this.y, this.aim_angle, this.ownerId),
            new Laser(this.x, this.y, AngleMath.formatAngle(this.aim_angle + this.angleDeviation), this.ownerId)
        ];
    }
};