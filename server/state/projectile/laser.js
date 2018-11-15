const Projectile = require("./projectile.js");

module.exports = class Laser extends Projectile {
    constructor(x, y, angle, ownerId) {
        super(x, y, angle, 150, ownerId);
        this.type = "laser";
        this.color = "#00FFFF";
    }

    getEndPoint() {
        return {
            x: this.x + Math.cos(this.angle) * this.size,
            y: this.y + Math.sin(this.angle) * this.size
        }
    }
};