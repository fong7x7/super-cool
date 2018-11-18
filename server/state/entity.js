/**
 * Entities are any objects that can be displayed on the main map of the game.
 * Entities cannot be instantiated directly. The class must be extended and overridden.
 * @type {Entity}
 */
module.exports = class Entity {
    constructor() {
        this.entityId = -1;         // ID of the entity
        this.x = 0;                 // X coordinate of the entity
        this.y = 0;                 // Y coordinate of the entity
        this.vx = 0;                // Velocity X in pixels/second of the entity
        this.vy = 0;                // Velocity Y in pixels/second of the entity
        this.color = "#FFFFFF";     // Color of the entity (used on client side)
        this.size = 30;             // Size of the entity (used for collision and client side rendering)
        this.physical = true;       // Determines if the entity is physically on the map
        this.name = "entity";       // Name of the entity
        this.deathTime = -1;

        // abstract class check
        if (new.target === Entity) {
            throw new TypeError("Cannot construct Entity instances directly");
        }
    }

    /**
     * Sets the velocity of the entity
     * @param x
     * @param y
     */
    setVelocity(x, y) {
        this.vx = x;
        this.vy = y;
    }

    /**
     * Sets the velocity of the entity from the given angle and magnitude
     * @param angle
     * @param magnitude
     */
    setVelocityFromAngle(angle, magnitude) {
        this.vx = Math.cos(angle)*magnitude;
        this.vy = Math.sin(angle)*magnitude;
    }

    /**
     * Gets the velocity angle of the entity
     * @returns {number}
     */
    getVelocityAngle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Gets the velocity magnitude of the entity
     * @returns {number}
     */
    getVelocityMagnitude() {
        return Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    }

    /**
     * Predicts the position of the entity based on it's velocity vector
     * @param time
     * @returns {{x: number, y: number}}
     */
    predictPosition(time=1.0) {
        return {
            x: this.x + this.vx * time,
            y: this.y + this.vy * time
        }
    }
};