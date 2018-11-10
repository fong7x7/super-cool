const ANIMATE_TIME = 1.0;
const MOVE_COLOR = '#00FF00';
const SHOOT_COLOR = '#FF0000';
const MOUSE_LINE_LENGTH = 50;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

class MouseLine extends Entity {
    constructor() {
        super();
        this.size = 50;
        this.start_x = 0;
        this.start_y = 0;
        this.color = MOVE_COLOR;
        this.is_enabled = false;
        this.is_visible = false;
        this.is_scaled = true;
    }

    setStart(x, y) {
        this.start_x = x;
        this.start_y = y;
    }

    getLimitedMousePos() {
        let dx = this.x-this.start_x;
        let dy = this.y-this.start_y;
        if(this.is_scaled && Math.sqrt(dx*dx + dy*dy) > this.size) {
            let angle = Math.atan2(dy, dx);
            return { x: this.start_x + Math.cos(angle) * this.size, y: this.start_y + Math.sin(angle) * this.size };

        }
        return { x: this.x, y: this.y}
    }

    draw(ctxt) {
        if(!this.is_visible) { return; }

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
        this.players = [];
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

    addPlayer(player) {
        this.players.push(player);
    }

    resetPlayers(players, render_player) {
        let engine = this;
        engine.players = [];
        players.forEach((player) => {
            if(player.entityId == render_player.entityId) {
                render_player.x = player.x;
                render_player.y = player.y;
                render_player.vx = Math.cos(player.angle)*player.magnitude;
                render_player.vy = Math.sin(player.angle)*player.magnitude;
                render_player.name = player.name;

                engine.addPlayer(render_player);
            } else {
                let new_player = new Player();
                new_player.entityId = player.entityId;
                new_player.x = player.x;
                new_player.y = player.y;
                new_player.vx = Math.cos(player.angle)*player.magnitude;
                new_player.vy = Math.sin(player.angle)*player.magnitude;
                new_player.name = player.name;
                engine.addPlayer(new_player);
            }
        });
    }

    getPlayerByID(id) {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].entityId === id) {
                return this.players[i];
            }
        }
        return null;
    }

    updateEntities(previous, current) {
        let engine = this;
        this.players.forEach((player) => {
            current.players.forEach((new_player) => {
                if(player.entityId == new_player.entityId) {
                    player.vx = Math.cos(new_player.angle)*new_player.magnitude;
                    player.vy = Math.sin(new_player.angle)*new_player.magnitude;
                }
            });
        });

        current.lasers.forEach((laser) => {
            let was_found = false;
            engine.entities.forEach((ent) => {
                if(ent.type == 'laser' && ent.entityId == laser.entityId) {
                    ent.vx = Math.cos(laser.angle)*laser.magnitude;
                    ent.vy = Math.sin(laser.angle)*laser.magnitude;
                }
            });
            if(!was_found) {
                let new_laser = new Laser();
                let owner = this.getPlayerByID(laser.ownerId);
                new_laser.x = owner.x;
                new_laser.y = owner.y;
                new_laser.vx = Math.cos(laser.angle)*laser.magnitude;
                new_laser.vy = Math.sin(laser.angle)*laser.magnitude;
                this.add(new_laser);
            }
        });
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
            this.players.forEach((player) => {
                player.update(engine.delta_time);
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

        this.players.forEach((player) => {
            player.draw(engine.ctxt);
        });

        this.ctxt.save();

        window.requestAnimationFrame(() => {
            engine.draw();
        });
    }
}