import Entity from "./entity.js";

export default class Wall extends Entity {
    constructor(wall_angle) {
        super();
        this.wall_angle = wall_angle;
    }
}