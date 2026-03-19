import { Entity } from '../../core/Entity.js';

export class EnemyBullet extends Entity {
    constructor(x, y, targetX, targetY, damage) {
        super(x, y, 24, 24, 'ghostBullet');

        this.damage = damage || 5;
        this.speed = 4;

        // Calculate direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.dirX = dx / dist;
            this.dirY = dy / dist;
        } else {
            this.dirX = 0;
            this.dirY = -1;
        }

        this.rotation = Math.atan2(this.dirY, this.dirX);
    }

    update(dt, game) {
        if (!this.alive) return;

        this.x += this.dirX * this.speed * 60 * dt;
        this.y += this.dirY * this.speed * 60 * dt;

        // 화면 밖으로 너무 멀리 나가면 제거
        if (Math.abs(this.x) > 10000 || Math.abs(this.y) > 10000) {
            this.alive = false;
        }
    }
}
