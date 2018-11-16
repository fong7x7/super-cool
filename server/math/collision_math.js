const PointMath = require("./point_math.js");
const AngleMath = require("./angle_math.js");

module.exports = class CollisionMath {

    /**
     *
     * @param polygon1
     * @param polygon2
     * @returns {boolean}
     */
    static collides(polygon1, polygon2) {
        let p1 = polygon1[polygon1.length-1];
        for(let i = 0; i < polygon1.length; i++) {
            let p2 = polygon1[i];

            if(CollisionMath.intersectsPolygon(polygon2, p1, p2)) {
                return true;
            }

            p1 = p2;
        }
        return false
    }

    /**
     *
     * @param polygon
     * @param q1
     * @param q2
     * @returns {boolean}
     */
    static intersectsPolygon(polygon, q1, q2) {
        let p1 = polygon[polygon.length-1];
        for(let i = 0; i < polygon.length; i++) {
            let p2 = polygon[i];

            if(CollisionMath.intersects(p1, p2, q1, q2)) {
                return true;
            }

            p1 = p2;
        }
        return false
    }

    /**
     * Determines if two line segments starting from p1 to p2 and q1 to q2 cross.
     * Uses vector math to determine if they cross.
     * @param p1
     * @param p2
     * @param q1
     * @param q2
     * @return {Point} if the segments intersect
     */
    static intersects(p1, p2, q1, q2) {
        if(CollisionMath.isOnLine(p1, q1, q2)) {
            return p1;
        }
        if(CollisionMath.isOnLine(q1, p1, p2)) {
            return q1;
        }
        if(CollisionMath.isOnLine(q2, p1, p2)) {
            return q2;
        }
        if(CollisionMath.isOnLine(p2, q1, q2)) {
            return p2;
        }

        let r = PointMath.sub(p2, p1);
        let s = PointMath.sub(q2, q1);

        let u = PointMath.cross(PointMath.sub(p1, q1), r)/PointMath.cross(s,r);
        let cross_r_s = PointMath.cross(r,s);

        if(cross_r_s == 0) { return null; }

        let t = PointMath.cross(PointMath.sub(q1, p1), s)/cross_r_s;

        if((0 < t && t < 1) && (0 < u && u < 1)) {
            return PointMath.add(p1, PointMath.scale(r, t));
        }
        return null;
    }

    static isInsidePolygon(point, polygon) {
        let count = polygon.length;
        let is_inside = false;

        // Ray cast to the right to determine if point is inside polygon
        for(let i = 0; i < count; i++) {
            let current = polygon[i];
            let next = i == count-1 ? polygon[0] : polygon[i+1];

            if(CollisionMath.isOnLine(point, current, next)) { return true; }

            if( ((current.y >= point.y ) != (next.y >= point.y))
                && (point.x <= (next.x - current.x) * (point.y - current.y) / (next.y - current.y) + current.x)) {
                is_inside = !is_inside;
            }
        }

        return is_inside;
    }

    /**
     * Determines if a given point is on the line between a and b
     * @param check_point
     * @param a
     * @param b
     * @returns {boolean}
     */
    static isOnLine(check_point, a, b) {
        if(PointMath.equals(check_point, a)) { return true; }
        if(PointMath.equals(check_point, b)) { return true; }

        return PointMath.distance(a, check_point) + PointMath.distance(b, check_point) <= PointMath.distance(a,b) + 0.00000001;
    }

    static createPathHitBox(entity) {
        let angle = Math.atan2(entity.vy, entity.vx);
        let perpendicular = AngleMath.formatAngle(angle+Math.PI/2);

        let offset = entity.size/2;

        let start_point = {x: entity.x - Math.cos(angle)*offset, y: entity.y - Math.sin(angle)*offset };
        let end_point = {x: entity.x + entity.vx + Math.cos(angle)*offset, y: entity.y + entity.vy + Math.sin(angle)*offset };

        let left_offset = Math.cos(perpendicular)*offset;
        let right_offset = Math.sin(perpendicular)*offset;

        return [
            { x: start_point.x + left_offset, y: start_point.y + right_offset },
            { x: start_point.x - left_offset, y: start_point.y - right_offset },
            { x: end_point.x + left_offset, y: end_point.y + right_offset },
            { x: end_point.x - left_offset, y: end_point.y - right_offset }
        ]
    }

    static createHitBox(entity) {
        let offset = entity.size/2;

        return [
            { x: (entity.x-offset), y: (entity.y+offset) },
            { x: (entity.x+offset), y: (entity.y+offset) },
            { x: (entity.x+offset), y: (entity.y-offset) },
            { x: (entity.x-offset), y: (entity.y-offset) }
        ]
    }
};