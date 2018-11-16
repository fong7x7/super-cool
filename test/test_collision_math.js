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
    },

    testCreateHitBox: function () {
        let p1 = { x: 0, y: 0, size: 10 };

        let hitBox = CollisionMath.createHitBox(p1);

        if(!Assert.Equal(hitBox[0].x, -5, "First point x is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[0].y,  5, "First point y is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[1].x,  5, "2nd point x is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[1].y,  5, "2nd point y is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[2].x,  5, "3rd point x is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[2].y, -5, "3rd point y is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[3].x, -5, "4th point x is incorrect")) { return false; }
        if(!Assert.Equal(hitBox[3].y, -5, "4th point y is incorrect")) { return false; }

        return true;
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