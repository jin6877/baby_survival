// Bat → B형 독감: 빠른 지그재그 이동
import { Enemy } from './Enemy.js';

export class Bat extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 8,
            speed: 3.5,
            damage: 3,
            size: 56,
            spriteKey: 'bat',
            effectSpriteKey: 'batEffect',
            enemyName: 'B형 독감',
            exp: 1
        });

        this.zigzagTimer = 0;
        this.zigzagAmplitude = 40;
        this.zigzagFrequency = 3;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        this.zigzagTimer += dt;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const dirX = dx / dist;
            const dirY = dy / dist;

            // Perpendicular direction for zigzag
            const perpX = -dirY;
            const perpY = dirX;

            const zigzagOffset = Math.sin(this.zigzagTimer * this.zigzagFrequency) * this.zigzagAmplitude * dt;

            this.x += (dirX * this.speed * 60 * dt) + (perpX * zigzagOffset);
            this.y += (dirY * this.speed * 60 * dt) + (perpY * zigzagOffset);
        }
    }
}
