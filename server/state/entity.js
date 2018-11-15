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
        this.angle = 0;             // Velocity angle of the entity
        this.magnitude = 0;         // Velocity magnitude of the entity
        this.color = "#FFFFFF";     // Color of the entity (used on client side)
        this.size = 30;             // Size of the entity (used for collision and client side rendering)
        this.physical = true;       // Determines if the entity is physically on the map
        this.name = "entity";       // Name of the entity

        // abstract class check
        if (new.target === Entity) {
            throw new TypeError("Cannot construct Entity instances directly");
        }
        if (this.type === undefined) { // Type is used by the client on how to render the entity
            throw new TypeError(new.target + " Class must implement type attribute");
        }
    }

    /**
     * Sets the movement velocity of the entity
     * @param angle
     * @param magnitude
     */
    setMovement(angle, magnitude) {
        this.angle = angle;
        this.magnitude = magnitude;
    }

    /**
     * Predicts the position of the entity based on it's velocity angle and magnitude.
     * @param time
     * @returns {{x: number, y: number}}
     */
    predictPosition(time=1.0) {
        return {
            x: this.x + Math.cos(this.angle) * this.magnitude * time,
            y: this.y + Math.sin(this.angle) * this.magnitude * time
        }
    }
};