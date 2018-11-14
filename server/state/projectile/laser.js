const Projectile = require("./projectile.js");

module.exports = class Laser extends Projectile {
    constructor(x, y, angle, magnitude, ownerId) {
        super(x, y, angle, magnitude, ownerId);
        this.type = "laser";
    }

    getEndPoint() {
        return {
            x: this.x + Math.cos(this.angle) * this.size,
            y: this.y + Math.sin(this.angle) * this.size
        }
    }
}