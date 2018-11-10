const ANIMATE_TIME = 0.5;
const MOVE_COLOR = '#00FF00';
const SHOOT_COLOR = '#FF0000';
const MOUSE_LINE_LENGTH = 50;

class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
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
        this.color = "#00FF00";
        this.name = "LOSER";
    }

    draw(ctxt) {
        // draw circle size
        // draw name above

        ctxt.beginPath();
        ctxt.fillStyle = this.color;
        ctxt.arc(this.x+this.size,this.y+this.size,10,0,2*Math.PI);
        ctxt.fill();

        ctxt.fillStyle = this.color;
        ctxt.font = "12px Impact";
        ctxt.fillText(this.name, this.x - 6, this.y - 2);
    }
}

class Laser extends Entity {
    constructor() {
        super();
        this.size = 30;
        this.color = "#00FFFF";
        this.vx = 250;
        this.vy = 250;
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

class MouseLine extends Entity {
    constructor() {
        super();
        this.size = 10;
        this.start_x = 0;
        this.start_y = 0;
        this.color = MOVE_COLOR;
        this.is_enabled = false;
        this.is_scaled = true;
    }

    enable(x, y, size, is_scaled, color) {
        this.start_x = x;
        this.start_y = y;
        this.size = size;
        this.is_scaled = is_scaled;
        this.is_enabled = true;
        if(color) {
            this.color = color;
        }
    }

    disable() {
        this.is_enabled = false;
    }

    draw(ctxt) {
        if(!this.is_enabled) { return; }

        ctxt.beginPath();
        ctxt.lineWidth = 2;
        ctxt.strokeStyle = this.color;
        ctxt.moveTo(this.start_x, this.start_y);

        let dx = this.x-this.start_x;
        let dy = this.y-this.start_y;
        if(this.is_scaled && Math.sqrt(dx*dx + dy*dy) < this.size) {
            ctxt.lineTo(this.x, this.y);
        } else {
            let angle = Math.atan2(dy, dx);
            ctxt.lineTo(this.start_x + Math.cos(angle)*this.size, this.start_y + Math.sin(angle) * this.size);
        }
        ctxt.stroke();
    }
}

class RenderEngine {
    constructor() {
        this.canvas = document.getElementById("game_screen");
        this.ctxt = this.canvas.getContext("2d");
        this.loop_rate = 60; // 60 frames per second
        this.delta_time = 1.0/this.loop_rate;
        this.entities = [];
        this.animate = false;
        this.animate_time = 0;
    }

    start() {
        let engine = this;
        window.requestAnimationFrame(() => {
            engine.draw();
        });
        window.setInterval(() => { engine.update(); }, this.delta_time*1000);
    }

    clear() {
        this.ctxt.fillStyle = "#000000";
        this.ctxt.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    add(entity) {
        this.entities.push(entity);
    }

    play() {
        this.animate_time = 0;
        this.animate = true;
    }

    update() {
        let engine = this;
        if(this.animate) {
            this.entities.forEach((entity) => {
                entity.update(engine.delta_time);
            });
            this.animate_time += engine.delta_time;
            if(this.animate_time >= ANIMATE_TIME) {
                this.animate = false;
            }
        }
    }

    draw() {
        let engine = this;
        this.clear();

        // draw stuff here
        this.entities.forEach((entity) => {
            entity.draw(engine.ctxt);
        });

        this.ctxt.save();

        window.requestAnimationFrame(() => {
            engine.draw();
        });
    }
}