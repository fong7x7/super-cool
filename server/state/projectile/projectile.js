const Entity = require("../entity.js");

module.exports = class Projectile extends Entity {
    constructor(x, y, angle, magnitude, ownerId) {
        super();
        this.x = x;
        this.y = y;
        this.setVelocityFromAngle(angle, magnitude);
        this.ownerId = ownerId;
    }
};