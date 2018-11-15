const Weapon = require("./weapon.js");
const Laser = require("../projectile/laser.js");
const AngleMath = require("../../math/angle_math.js");

module.exports = class Pistol extends Weapon {
    constructor() {
        super("pistol");
        this.angleDeviation = 0.05;
        this.ammo = 1000;
        this.type = "pistol";
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        let spread_angle = AngleMath.formatAngle(this.aim_angle + (Weapon.randomNumber(this.angleDeviation*2) - this.angleDeviation));
        this.ammo -= 1;
        return [
            new Laser(this.x, this.y, spread_angle, this.ownerId)
        ];
    }
};