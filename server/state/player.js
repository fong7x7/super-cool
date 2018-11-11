class Player extends Entity {
    constructor(name){
        super();
        this.name = name;
        this.lives = 3;
        this.equipedId = -1;
        this.inventoryIds = [];
        this.movementConfirmed = false;
        this.color = "#FFFFFF";
        this.size = 10;
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