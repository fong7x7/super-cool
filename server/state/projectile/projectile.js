import Entity from "../entity.js";

export default class Projectile extends Entity {
    constructor(x, y, angle, magnitude, ownerId) {
        super();
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.magnitude = magnitude;
        this.ownerId = ownerId;
    }
}