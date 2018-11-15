class APIComm {
    constructor() {}

    sendPlayerLogin(name, callback) {
        $.ajax({
            url: '/player/login',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: callback,
            data: JSON.stringify({name: name})
        });
    }

    sendPlayerAction(id, move, shoot, equip, callback) {
        $.ajax({
            url: '/player/action',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: callback,
            data: JSON.stringify({
                playerId: id,
                move: move, // { angle: , magnitude: }
                shoot: shoot, // { angle: , magnitude: }
                swap: equip // slot index
            })
        });
    }

    getCurrentGameState(callback) {
        $.ajax({
            url: '/currentGameState',
            type: 'GET',
            success: callback
        });
    }

    getPreviousGameState(callback) {
        $.ajax({
            url: '/previousGameState',
            type: 'GET',
            success: callback
        });
    }

    getHeartBeat(callback) {
        $.ajax({
            url: '/heartbeat',
            type: 'GET',
            success: callback
        });
    }
}