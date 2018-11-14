class EntityRender {
    constructor() {
    }
    
    static drawEntity(ctxt, entity) {
        if(!entity.physical) { return; } // don't draw non-physical objects

        if(entity.type === 'laser') {
            EntityRender.drawLaser(ctxt, entity);
        } else if(entity.type === 'player') {
            EntityRender.drawPlayer(ctxt, entity);
        } else if(entity.type === 'wall') {
            EntityRender.drawWall(ctxt, entity);
        }
    }
    
    static drawLaser(ctxt, laser) {
        let next_x = laser.x + Math.cos(laser.angle)*laser.size;
        let next_y = laser.y + Math.sin(laser.angle)*laser.size;

        ctxt.beginPath();
        ctxt.lineWidth = 2;
        ctxt.strokeStyle = laser.color;
        ctxt.moveTo(laser.x, laser.y);
        ctxt.lineTo(next_x, next_y);
        ctxt.stroke();
    }
    
    static drawPlayer(ctxt, player) {
        ctxt.beginPath();
        ctxt.fillStyle = player.color;
        ctxt.arc(player.x, player.y, player.size, 0, 2*Math.PI);
        ctxt.fill();

        ctxt.fillStyle = player.color;
        ctxt.font = "12px Impact";
        ctxt.fillText(player.name, player.x - (player.size*1.5), player.y - player.size-2);
    }
    
    static drawWall(ctxt, wall) {
        let next_x = wall.x + Math.cos(wall.wall_angle)*wall.size;
        let next_y = wall.y + Math.sin(wall.wall_angle)*wall.size;

        ctxt.beginPath();
        ctxt.lineWidth = 2;
        ctxt.strokeStyle = wall.color;
        ctxt.moveTo(wall.x, wall.y);
        ctxt.lineTo(next_x, next_y);
        ctxt.stroke();
    }
}