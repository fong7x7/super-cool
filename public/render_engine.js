class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    draw(ctxt) {
    }
}

class Player extends Entity {
    constructor() {
        super();
    }

    draw(ctxt) {
        // draw circle size
        // draw name above
    }
}

class Laser extends Entity {
    constructor() {
        super();
    }

    draw(ctxt) {
        // line segment from x to y
    }
}

class RenderEngine {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctxt = this.canvas.getContext("2d");
        this.loop_rate = 60; // 60 frames per second
        this.delta_time = 1000/loop_rate;
        this.entities = [];
    }

    start() {
        window.requestAnimationFrame(this.draw);
        window.setInterval(this.update, this.delta_time);
    }

    clear() {
        this.ctxt.clearRect(0,0,this.canvas.width,this.canvas.height);
    }

    add(entity) {
        this.entities.push(entity);
    }

    update() {
        let engine = this;
        this.entities.forEach((entity) => {
            entity.update(engine.delta_time);
        });
    }

    draw() {
        let engine = this;
        this.clear();

        // draw stuff here
        this.entities.forEach((entity) => {
            entity.draw(engine.ctxt);
        });

        this.ctxt.fillStyle = "#FF0000";
        this.ctxt.fillRect(0,0,150,75);

        this.ctxt.save();

        window.requestAnimationFrame(this.draw);
    }
}

var render = new RenderEngine();
render.start();