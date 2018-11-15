const Projectile = require("./projectile.js");

module.exports = class Laser extends Projectile {
    constructor(x, y, angle, ownerId) {
        super(x, y, angle, 150, ownerId);
        this.type = "laser";
        this.color = "#00FFFF";
    }

    getEndPoint() {
        let angle = this.getVelocityAngle();
        return {
            x: this.x + Math.cos(angle) * this.size,
            y: this.y + Math.sin(angle) * this.size
        }
    }
};