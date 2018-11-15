const Entity = require("../entity.js");

/**
 * Weapons are items equipable by the player.
 * The weapon class is an abstract class that must be extended upon for proper use.
 * Weapons have an ownerId that can be used to link back to the player that owns it.
 * Weapons have a fire function that produces an array of projectiles.
 * @type {Weapon}
 */
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
        this.type = "weapon";

        // abstract class check
        if (new.target === Weapon) {
            throw new TypeError("Cannot construct Weapon instances directly");
        }
        if (this.fire === undefined) {
            throw new TypeError(new.target + " Class must implement fire function");
        }
    }

    /**
     * Aims the weapon at a given direction.
     * The values provided will be used to fire the weapon in a direction.
     * @param angle
     * @param mag
     */
    aim(angle, mag) {
        this.aim_angle = angle;
        this.aim_magnitude = mag;
    }

    static randomNumber(to) {
        return Math.ceil(Math.random() * to) - 1;
    }
};