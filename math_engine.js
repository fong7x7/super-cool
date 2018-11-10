class Polygon {
    constructor() {
        this.points = [];
    }

    add(point) {
        this.points.push(point);
    }

    size() {
        return this.points.length;
    }

    last() {
        if(this.points.length == 0) {
            return new Point(0,0);
        }
        return this.points[this.points.length-1];
    }

    at(i) {
        return this.points[i];
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Determines if a the point is equal to the given point
     * @param point2
     * @returns {boolean}
     */
    equals(point2) {
        return this.x == point2.x && this.y == point2.y;
    }

    /**
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static add(point1, point2) {
        return new Point(point1.x + point2.x, point1.y + point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static sub(point1, point2) {
        return new Point(point1.x - point2.x, point1.y - point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static multiply(point1, point2) {
        return new Point(point1.x * point2.x, point1.y * point2.y);
    }

    /**
     *
     * @param point1
     * @param point2
     * @returns {Point}
     */
    static divide(point1, point2) {
        return new Point(point1.x / point2.x, point1.y / point2.y);
    }

    /**
     *
     * @param v
     * @param w
     * @returns {number}
     */
    static cross(v, w) {
        return ((v).x*(w).y - (v).y*(w).x);
    }

    /**
     *
     * @param point1
     * @param value
     * @returns {Point}
     */
    static scale(point1, value) {
        return new Point(point1.x * value, point1.y * value);
    }

    /**
     *
     * @param point1
     * @param value
     * @returns {Point}
     */
    static divideByNum(point1, value) {
        return new Point(point1.x / value, point1.y / value);
    }

    /**
     * @param a
     * @param b
     * @returns {number}
     */
    static distance(a, b) {
        let delta_x = b.x - a.x;
        let delta_y = b.y - a.y;

        return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
    }
}

class MathEngine {
    /**
     *
     * @param polygon1
     * @param polygon2
     * @returns {boolean}
     */
    static collides(polygon1, polygon2) {
        let p1 = polygon1.last();
        for(let i = 0; i < polygon1.size(); i++) {
            let p2 = polygon1.at(i);

            if(MathEngine.intersectsPolygon(polygon2, p1, p2)) {
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
        let p1 = polygon.last();
        for(let i = 0; i < polygon.size(); i++) {
            let p2 = polygon.at(i);

            if(MathEngine.intersects(p1, p2, q1, q2)) {
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
     * @return boolean if the segments intersect
     */
    static intersects(p1, p2, q1, q2) {
        if(MathEngine.isOnLine(p1, q1, q2)) {
            return true;
        }
        if(MathEngine.isOnLine(q1, p1, p2)) {
            return true;
        }
        if(MathEngine.isOnLine(q2, p1, p2)) {
            return true;
        }
        if(MathEngine.isOnLine(p2, q1, q2)) {
            return true;
        }

        let r = Point.sub(p2, p1);
        let s = Point.sub(q2, q1);

        let u = Point.cross((p1-q1), r)/Point.cross(s,r);
        let cross_r_s = Point.cross(r,s);

        if(cross_r_s == 0) { return false; }

        let t = Point.cross((q1-p1), s)/cross_r_s;

        return (0 < t && t < 1) && (0 < u && u < 1);
    }

    /**
     * Determines if a given point is on the line between a and b
     * @param check_point
     * @param a
     * @param b
     * @returns {boolean}
     */
    static isOnLine(check_point, a, b) {
        if(check_point.equals(a)) { return true; }
        if(check_point.equals(a)) { return true; }

        return MathEngine.distance(a, check_point) + MathEngine.distance(b, check_point) <= MathEngine.distance(a,b) + 0.00000001;
    }

}