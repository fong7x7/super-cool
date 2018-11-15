module.exports = class AngleMath {
    /**
     * Formats an angle to be between -180 and 180 degrees
     * @param angle - number in radians
     * @returns {number} - angle in radians
     */
    static formatAngle(angle) {
        let revolution = 2 * Math.PI;
        let result = angle;

        while(result > Math.PI) {
            result -= revolution;
        }
        while(result < -Math.PI) {
            result += revolution;
        }

        return result;
    }

    /**
     * Calculates the angle between two points that have an x and y
     * @param point1
     * @param point2
     * @returns {number}
     */
    static calculateAngle(point1, point2) {
        return Math.atan2(point2.y-point1.y, point2.x-point1.x);
    }
};