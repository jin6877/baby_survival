// Zombie → 병균: 기본 추적 적군
import { Enemy } from './Enemy.js';

export class Zombie extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 20,
            speed: 1.2,
            damage: 5,
            size: 64,
            spriteKey: 'zombie',
            effectSpriteKey: 'zombieEffect',
            enemyName: '병균',
            exp: 1
        });
    }

    // 기본 movementPattern 사용 (플레이어 추적)
}
