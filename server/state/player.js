const Entity = require("./entity.js");

module.exports = class Player extends Entity {
    constructor() {
        super();
        this.name = "Unnamed Player";
        this.lives = 3;
        this.equipedId = -1;
        this.inventoryIds = [];
        this.movementConfirmed = false;
        this.color = "#FFFFFF";
        this.size = 10;
        this.type = "player";
    }

    equipItem(index) {
        this.equipedId = this.inventoryIds[index];
    }

    addItem(id) {
        this.inventoryIds.push(id);
        if(this.equipedId == -1) {
            this.equipItem(0);
        }
    }
}