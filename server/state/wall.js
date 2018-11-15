const Entity = require("./entity.js");

module.exports = class Wall extends Entity {
    constructor(wall_angle) {
        super();
        this.wall_angle = wall_angle;
        this.type = "wall";
    }
};