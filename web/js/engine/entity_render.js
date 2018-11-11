class EntityRender {
    constructor() {

    }

    draw(ctxt, entity) {

    }

    addRenderFunction(type, drawCallback) {

    }
}

class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.entityId = 0;
        this.type = 'entity';
    }

    update(delta_time) {
        this.x += this.vx*delta_time;
        this.y += this.vy*delta_time;
    }

    draw(ctxt) {}
}

class Player extends Entity {
    constructor() {
        super();
        this.size = 10;
        this.vx = 20;
        this.vy = 20;
        this.color = getRandomColor();
        this.name = "LOSER";
        this.type = 'player';
    }

    draw(ctxt) {
        // draw circle size
        // draw name above

        ctxt.beginPath();
        ctxt.fillStyle = this.color;
        ctxt.arc(this.x,this.y,10,0,2*Math.PI);
        ctxt.fill();

        ctxt.fillStyle = this.color;
        ctxt.font = "12px Impact";
        ctxt.fillText(this.name, this.x - (this.size*1.5), this.y - this.size-2);
    }
}

class Laser extends Entity {
    constructor() {
        super();
        this.size = 30;
        this.velocity = 250;
        this.color = "#00FFFF";
        this.type = 'laser';
    }

    setDirection(angle) {
        this.vx = Math.cos(angle)*this.velocity;
        this.vy = Math.sin(angle)*this.velocity;
    }

    draw(ctxt) {
        // line segment from x to y
        let angle = Math.atan2(this.vy, this.vx);
        let next_x = this.x + Math.cos(angle)*this.size;
        let next_y = this.y + Math.sin(angle)*this.size;

        ctxt.beginPath();
        ctxt.lineWidth = 2;
        ctxt.strokeStyle = this.color;
        ctxt.moveTo(this.x, this.y);
        ctxt.lineTo(next_x, next_y);
        ctxt.stroke();
    }
}


class Wall extends Entity {
    constructor() {
        super();
        this.size = 50;
        this.velocity = 0;
        this.color = "#000000";
        this.type = 'wall';
    }

    draw(ctxt) {
        // line segment from x to y
        let angle = Math.atan2(this.vy, this.vx);
        let next_x = this.x + Math.cos(angle)*this.size;
        let next_y = this.y + Math.sin(angle)*this.size;

        ctxt.beginPath();
        ctxt.lineWidth = 4;
        ctxt.strokeStyle = this.color;
        ctxt.moveTo(this.x, this.y);
        ctxt.lineTo(next_x, next_y);
        ctxt.stroke();
    }
}