import { Enemy } from './Enemy.js';

export class Knight extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 80,
            speed: 1,
            damage: 15,
            size: 28,
            spriteKey: 'knight',
            exp: 3
        });
    }

    // Uses default movementPattern (slow tank, normal chase)
}
