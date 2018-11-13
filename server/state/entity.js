module.exports = class Entity {
    constructor() {
        this.entityId = -1;
        this.x = 0;
        this.y = 0;
        this.color = "#FFFFFF";
        this.angle = 0;
        this.magnitude = 0;
        this.size = 30;
        this.physical = true;
        this.name = "entity";
    }

    setMovement(angle, magnitude) {
        this.angle = angle;
        this.magnitude = magnitude;
    }

    predictPosition(time=1.0) {
        return {
            x: this.x + Math.cos(this.angle) * this.magnitude * time,
            y: this.y + Math.sin(this.angle) * this.magnitude * time
        }
    }
}