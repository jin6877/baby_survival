// Skeleton → A형 독감: 강한 추적 적군
import { Enemy } from './Enemy.js';

export class Skeleton extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 35,
            speed: 1.8,
            damage: 8,
            size: 68,
            spriteKey: 'skeleton',
            effectSpriteKey: 'skeletonEffect',
            enemyName: 'A형 독감',
            exp: 2
        });
    }

    // 기본 movementPattern 사용 (플레이어 추적)
}
