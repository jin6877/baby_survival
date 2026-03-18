// Projectile: 투사체 베이스 클래스
import { Entity } from '../../core/Entity.js';

export class Projectile extends Entity {
    constructor(x, y, config = {}) {
        const size = config.size || 10;
        super(x, y, size, size, config.spriteKey || 'projectile');

        this.speed = config.speed || 5;
        this.damage = config.damage || 10;
        this.size = size;
        this.piercing = config.piercing || false;
        this.lifetime = config.lifetime || 3000;
        this.owner = config.owner || null;

        this.velocityX = 0;
        this.velocityY = 0;
        this.hitEntities = new Set();
    }

    update(dt, game) {
        if (!this.alive) return;

        // 이동
        this.x += this.velocityX * this.speed * 60 * dt;
        this.y += this.velocityY * this.speed * 60 * dt;

        // 수명 감소 (lifetime is in ms, dt is in seconds)
        this.lifetime -= dt * 1000;
        if (this.lifetime <= 0) {
            this.destroy(game);
        }
    }
}
