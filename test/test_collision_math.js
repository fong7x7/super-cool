const Assert = require("./assert.js");
const CollisionMath = require("../server/math/collision_math.js");
const PointMath = require("../server/math/point_math.js");
const Player = require("../server/state/player.js");
const Laser = require("../server/state/projectile/laser.js");
const Game = require("../server/state/game.js");

TestCollisionMath = {
    testEntityHit: function() {
        let player = new Player();
        player.x = 0;
        player.y = 0;
        let laser = new Laser(-10, 0, 0, 0);

        return Assert.True(Game.determineEntityHit(player, laser));
    }
};

Object.keys(TestCollisionMath).forEach(function(test) {
    if(TestCollisionMath[test]()) {
        console.log(test + ": Passed");
    } else {
        console.log(test + ": Failed");
    }
});