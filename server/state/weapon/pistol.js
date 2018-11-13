import Weapon from "./weapon.js";
import Laser from "../projectile/laser.js";

export default class Pistol extends Weapon {
    constructor() {
        super("pistol");
        this.angleDeviation = 0.05;
        this.ammo = 1000;
    }

    fire() {
        if(this.ammo <= 0) {
            return [];
        }

        let spread_angle = this.aim_angle + (Weapon.randomNumber(this.angleDeviation*2) - this.angleDeviation);
        this.ammo -= 1;
        return [
            new Laser(this.x, this.y, spread_angle, this.aim_magnitude, this.ownerId)
        ];
    }
}