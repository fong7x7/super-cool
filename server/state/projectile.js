class Projectile extends Entity {
    constructor(x, y, angle, magnitude, ownerId) {
        super();
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.magnitude = magnitude;
        this.ownerId = ownerId;
    }
}

class Laser extends Projectile {
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