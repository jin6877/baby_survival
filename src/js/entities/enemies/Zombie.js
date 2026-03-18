import { Enemy } from './Enemy.js';

export class Zombie extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 20,
            speed: 1.2,
            damage: 5,
            size: 22,
            spriteKey: 'zombie',
            exp: 1
        });
    }

    // Uses default movementPattern (slow chase toward player)
}
