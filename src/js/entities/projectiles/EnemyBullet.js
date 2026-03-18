import { Entity } from '../../core/Entity.js';

export class EnemyBullet extends Entity {
    constructor(x, y, targetX, targetY, damage) {
        super(x, y, 8, 8, 'ghostBullet');

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

        // Destroy if out of world bounds
        if (this.x < -100 || this.x > 3200 || this.y < -100 || this.y > 3200) {
            this.alive = false;
        }
    }
}
