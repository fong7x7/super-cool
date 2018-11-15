const Entity = require("./entity.js");

module.exports = class Barrel extends Entity {
    constructor() {
        super();
        this.name = "barrel";
        this.type = "barrel";
    }
};