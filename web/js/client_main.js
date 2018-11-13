import GraphicsEngine from "./graphics/graphics_engine.js";
import APIComm from "./comms/api_comm.js";

function main() {
    let current_update_time = -1;
    let current_player_update_time = -1;

    let player = {};

    const api = new APIComm();
    const engine = new GraphicsEngine();

    let updatePlayerData = function(entities) {
        Object.keys(entities).forEach(function(id) {
            if(id == player.entityId) {
                player = entities[id];
            }
        });
    };

    engine.canvas.addEventListener('mousemove', function(evt) {
        let rect = engine.canvas.getBoundingClientRect(); // need to use this every update since scroll changes it

        if(engine.move_line.is_enabled) {
            engine.move_line.setStart(player.x, player.y);
            engine.move_line.x = evt.clientX - rect.left;
            engine.move_line.y = evt.clientY - rect.top;
        }
        if(engine.shoot_line.is_enabled) {
            engine.shoot_line.setStart(player.x, player.y);
            engine.shoot_line.x = evt.clientX - rect.left;
            engine.shoot_line.y = evt.clientY - rect.top;
        }
    });

    engine.canvas.addEventListener('mouseup', function(evt) {
        if(engine.move_line.is_visible && engine.move_line.is_enabled) {
            engine.move_line.is_enabled = false;
        }
        if(engine.shoot_line.is_visible && engine.shoot_line.is_enabled) {
            engine.shoot_line.is_enabled = false;
        }
        if(engine.shoot_line.is_visible && engine.move_line.is_visible) {
            let limited = engine.move_line.getLimitedMousePos();
            let mdx = limited.x-engine.move_line.start_x;
            let mdy = limited.y-engine.move_line.start_y;
            let move_angle = Math.atan2(mdy, mdx);
            let shoot_angle = Math.atan2(engine.shoot_line.y-engine.shoot_line.start_y, engine.shoot_line.x-engine.shoot_line.start_x);

            api.sendPlayerAction(player.entityId, { angle: move_angle, magnitude: Math.sqrt(mdx*mdx + mdy*mdy)}, { angle: shoot_angle });
        }
    });

    document.getElementById('moveButton').addEventListener('mouseup', function() {
        engine.move_line.setStart(player.x, player.y);
        if(engine.shoot_line.is_enabled && engine.shoot_line.is_visible) {
            engine.shoot_line.is_visible = false;
            engine.shoot_line.is_enabled = false;
        }
        engine.move_line.is_visible = true;
        engine.move_line.is_enabled = true;
    });

    document.getElementById('shootButton').addEventListener('mouseup', function() {
        engine.shoot_line.setStart(player.x, player.y);
        if(engine.move_line.is_enabled && engine.move_line.is_visible) {
            engine.move_line.is_visible = false;
            engine.move_line.is_enabled = false;
        }
        engine.shoot_line.is_visible = true;
        engine.shoot_line.is_enabled = true;
    });

    document.getElementById('joinButton').addEventListener('mouseup', function() {
        let name = document.getElementById('nameInput').value;
        api.sendPlayerLogin(name, (data) => {
            player = data;
            console.log("Joined Session! id: " + player.entityId);

            api.getGameState((entities) => {
                engine.updateEntities(entities);
                engine.start();

                document.getElementById('login_screen').setAttribute("style", "display: none");
                document.getElementById('game_screen').setAttribute("style", "display: block");
                document.getElementById('countBox').setAttribute("style", "display: inline-block");
            });
        });
    });

    window.setInterval(()=>{
        api.getHeartBeat((data) => {
            if(current_update_time == -1) {
                current_update_time = data.readyTimeStamp;
                current_player_update_time = data.newPlayerTimeStamp;
            } else if(current_update_time < data.readyTimeStamp) {
                current_update_time = data.readyTimeStamp;
                api.getGameState((entities) => {
                    engine.updateEntities(entities);
                    updatePlayerData(entities);
                    engine.animate_done = function() => {
                        engine.entities = entities;
                    };
                    engine.hideMouseLines();
                    engine.play();
                    document.getElementById('playerCount').innerHTML = engine.entities;
                });
            } else if(current_player_update_time < data.newPlayerTimeStamp) {
                current_player_update_time = data.newPlayerTimeStamp;
                api.getGameState((entities) => {
                    engine.updateEntities(entities);
                    updatePlayerData(entities);
                    document.getElementById('playerCount').innerHTML = engine.entities;
                });
            }
        });
    }, 500);
}