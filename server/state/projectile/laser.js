const Projectile = require("./projectile.js");

module.exports = class Laser extends Projectile {
    constructor(x, y, angle, ownerId) {
        super(x, y, angle, 150, ownerId);
        this.type = "laser";
        this.color = "#00FFFF";
        this.size = 50;
    }

    getEndPoint() {
        let angle = this.getVelocityAngle();
        return Laser.calculateEndPoint(this, angle, this.size);
    }

    static calculateEndPoint(point, angle, size) {
        return {
            x: point.x + Math.cos(angle) * size,
            y: point.y + Math.sin(angle) * size
        }
    }
};