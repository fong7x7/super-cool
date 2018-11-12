export default class PointMath {
    static equals(point1, point2) {
        return point1.x == point2.x && point1.y == point2.y;
    }

    static add(point1, point2) {
        return { x: point1.x + point2.x, y: point1.y + point2.y };
    }

    static sub(point1, point2) {
        return { x: point1.x - point2.x, y: point1.y - point2.y };
    }

    static multiply(point1, point2) {
        return { x: point1.x * point2.x, y: point1.y * point2.y };
    }

    static divide(point1, point2) {
        return { x: point1.x / point2.x, y: point1.y / point2.y };
    }

    static cross(v, w) {
        return ((v).x*(w).y - (v).y*(w).x);
    }

    static scale(point1, value) {
        return { x: point1.x * value, y: point1.y * value };
    }

    static divideByNum(point1, value) {
        return { x: point1.x / value, y: point1.y / value };
    }

    static distance(a, b) {
        let delta_x = b.x - a.x;
        let delta_y = b.y - a.y;

        return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
    }
}

