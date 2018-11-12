import Projectile from "./projectile.js";

export default class Laser extends Projectile {
    constructor(x, y, angle, magnitude, ownerId) {
        super(x, y, angle, magnitude, ownerId);
    }

    getEndPoint() {
        return {
            x: this.x + Math.cos(this.angle) * this.size,
            y: this.y + Math.sin(this.angle) * this.size
        }
    }
}