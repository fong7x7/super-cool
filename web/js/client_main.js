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

    let getPlayerCount = function (entities) {
        let playerCount = 0;
        Object.keys(entities).forEach(function(id) {
            if(entities[id].type == 'player') {
                playerCount++;
            }
        });
        return playerCount;
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
            let sdx = engine.shoot_line.x-engine.shoot_line.start_x;
            let sdy = engine.shoot_line.y-engine.shoot_line.start_y;

            api.sendPlayerAction(
                player.entityId,
                { angle: Math.atan2(mdy, mdx), magnitude: Math.sqrt(mdx*mdx + mdy*mdy) },
                { angle: Math.atan2(sdy, sdx), magnitude: Math.sqrt(sdx*sdx + sdy*sdy) }
            );
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

            api.getCurrentGameState((entities) => {
                engine.entities = entities;
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
                api.getPreviousGameState((entities) => {
                    engine.updateEntities(entities);
                    engine.animate_done = function() {
                        api.getCurrentGameState((entities) => {
                            engine.entities = entities;
                            updatePlayerData(entities);
                        });
                    };
                    engine.hideMouseLines();
                    engine.play();
                    document.getElementById('playerCount').innerHTML = getPlayerCount(engine.entities);
                });
            } else if(current_player_update_time < data.newPlayerTimeStamp) {
                current_player_update_time = data.newPlayerTimeStamp;
                api.getCurrentGameState((entities) => {
                    engine.updateEntities(entities);
                    updatePlayerData(entities);
                    document.getElementById('playerCount').innerHTML = getPlayerCount(engine.entities);
                });
            }
        });
    }, 500);
}