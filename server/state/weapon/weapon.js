const Entity = require("../entity.js");

module.exports = class Weapon extends Entity {
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

    static randomNumber(to) {
        return Math.ceil(Math.random() * to) - 1;
    }

    static formatAngle(angle) {
        // TODO: format yaw angle to be between -180 and 180
        return angle;
    }
}