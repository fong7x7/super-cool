export default class APIComm {
    constructor() {}

    sendPlayerLogin(name, callback) {
        $.ajax({
            url: '/player/login',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                callback(data);
            },
            data: JSON.stringify({name: name})
        });
    }

    sendPlayerAction(id, move, shoot, equip, callback) {
        $.ajax({
            url: '/player/action',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if(callback) {
                    callback();
                }
            },
            data: JSON.stringify({
                playerId: id,
                move: move, // { angle: , magnitude: }
                shoot: shoot, // { angle: , magnitude: }
                swap: equip // slot index
            })
        });
    }

    getGameState(callback) {
        $.ajax({
            url: '/gamestate',
            type: 'GET',
            success: function(data) {
                callback(data);
            }
        });
    }

    getHeartBeat(callback) {
        $.ajax({
            url: '/heartbeat',
            type: 'GET',
            success: function(data) {
                callback(data)
            }
        });
    }
}