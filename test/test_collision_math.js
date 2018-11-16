const Assert = require("./assert.js");
const CollisionMath = require("../server/math/collision_math.js");

TestCollisionMath = {
    testIntersect: function() {
        let p1 = { x: -2, y: 0 };
        let p2 = { x: 2, y: 0 };
        let q1 = { x: 0, y: -2 };
        let q2 = { x: 0, y: 2 };

        return Assert.True(CollisionMath.intersects(p1, p2, q1, q2));
    },

    testIntersectPolygon: function() {
        let poly = [
            { x: -2, y: 2 },
            { x: 2, y: 2 },
            { x: 2, y: -2 },
            { x: -2, y: -2 }
        ];

        let q1 = { x: 0, y: -5 };
        let q2 = { x: 0, y: 5 };

        return Assert.True(CollisionMath.intersectsPolygon(poly, q1, q2));
    }
};

console.log("Running tests for CollisionMath...");
let total = 0;
let passed = 0;

Object.keys(TestCollisionMath).forEach(function(test) {
    total++;
    if(TestCollisionMath[test]()) {
        passed++;
        console.log(test + ": Passed");
    } else {
        console.log(test + ": Failed");
    }
});

console.log(passed + "/" + total + " tests succeeded");