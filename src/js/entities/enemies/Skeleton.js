import { Enemy } from './Enemy.js';

export class Skeleton extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 35,
            speed: 1.8,
            damage: 8,
            size: 24,
            spriteKey: 'skeleton',
            exp: 2
        });
    }

    // Uses default movementPattern (normal chase toward player)
}
