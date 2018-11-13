import EntityRender from "./entity_render.js";
import MouseLine from "./mouse_line.js";

const ANIMATE_TIME = 1.0;

export default class GraphicsEngine {
    constructor() {
        this.canvas = document.getElementById("game_screen");
        this.ctxt = this.canvas.getContext("2d");
        this.loop_rate = 60; // 60 frames per second
        this.delta_time = 1.0/this.loop_rate;
        this.entities = {};
        this.animate = false;
        this.animate_time = 0;
        this.animate_done = function(){};

        this.move_line = new MouseLine();
        this.shoot_line = new MouseLine();
        this.shoot_line.color = "#FF0000";
        this.shoot_line.is_scaled = false;
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

    updateEntities(entities) {
        let engine = this;
        entities.forEach((entity) => {
            let existing = engine.entities[entity.entityId];
            if(existing) {
                existing.angle = entity.angle;
                existing.magnitude = entity.magnitude;
            } else {
                engine.entities[entity.entityId] = entity;
            }
        });
    }

    play() {
        this.animate_time = 0;
        this.animate = true;
    }

    animateEntities(entities) {
        let engine = this;
        entities.forEach((entity) => {
            entity.x += Math.cos(entity.angle)*entity.magnitude*engine.delta_time;
            entity.y += Math.sin(entity.angle)*entity.magnitude*engine.delta_time;
        });
    }

    animate() {
        if(!this.animate) { return; }

        this.animateEntities(this.entities);
        this.animate_time += this.delta_time;
        if(this.animate_time >= ANIMATE_TIME) {
            this.animate = false;
            if(this.animate_done) {
                this.animate_done();
            }
        }
    }

    hideMouseLines() {
        this.move_line.is_visible = false;
        this.move_line.is_enabled = false;
        this.shoot_line.is_visible = false;
        this.shoot_line.is_enabled = false;
    };

    draw() {
        let engine = this;
        this.clear();

        this.animate();

        // draw stuff here
        this.entities.forEach((entity) => {
            EntityRender.drawEntity(engine.ctxt, entity);
        });

        this.move_line.draw(engine.ctxt);
        this.shoot_line.draw(engine.ctxt);

        this.ctxt.save();

        window.requestAnimationFrame(() => {
            engine.draw();
        });
    }
}