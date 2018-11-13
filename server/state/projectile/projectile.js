const Entity = require("../entity.js");

module.exports = class Projectile extends Entity {
    constructor(x, y, angle, magnitude, ownerId) {
        super();
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.magnitude = magnitude;
        this.ownerId = ownerId;
    }
}