const ANIMATE_TIME = 1.0;

class GraphicsEngine {
    constructor() {
        this.canvas = document.getElementById("game_screen");
        this.ctxt = this.canvas.getContext("2d");
        this.loop_rate = 60; // 60 frames per second
        this.delta_time = 1.0/this.loop_rate;
        this.entities = {};
        this.do_animation = false;
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
        window.setInterval(() => { engine.animate(); }, this.delta_time*1000);
    }

    clear() {
        this.ctxt.fillStyle = "#000000";
        this.ctxt.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    updateEntities(entities) {
        let engine = this;
        Object.keys(entities).forEach(function(id) {
            let entity = entities[id];
            let existing = engine.entities[entity.entityId];
            if(existing) {
                existing.vx = entity.vx;
                existing.vy = entity.vy;
            } else {
                engine.entities[entity.entityId] = jQuery.extend(true, {}, entity); // deep copy
            }
        });
    }

    play() {
        this.animate_time = 0;
        this.do_animation = true;
    }

    animateEntities(entities) {
        let engine = this;
        Object.keys(entities).forEach(function(id) {
            let entity = entities[id];
            if(!entity.physical) { return; } // don't animate non-physical objects

            entity.x += entity.vx * engine.delta_time;
            entity.y += entity.vy * engine.delta_time;
        });
    }

    animate() {
        if(!this.do_animation) { return; }

        this.animateEntities(this.entities);
        this.animate_time += this.delta_time;
        if(this.animate_time >= ANIMATE_TIME) {
            this.do_animation = false;
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
        Object.keys(engine.entities).forEach(function(id) {
            let entity = engine.entities[id];
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