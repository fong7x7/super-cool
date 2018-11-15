const Weapon = require("./weapon.js");
const Laser = require("../projectile/laser.js");

module.exports = class Rifle extends Weapon {
    constructor() {
        super("rifle");
        this.angleDeviation = 0.01;
        this.rifle = 10;
        this.type = "rifle";
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        let spread_angle = this.aim_angle + (Weapon.randomNumber(this.angleDeviation*2) - this.angleDeviation);
        this.ammo -= 1;
        return [ // spawn 3 direct lasers for maximum damage!
            new Laser(this.x, this.y, spread_angle, this.ownerId),
            new Laser(this.x, this.y, spread_angle, this.ownerId),
            new Laser(this.x, this.y, spread_angle, this.ownerId)
        ];
    }
};