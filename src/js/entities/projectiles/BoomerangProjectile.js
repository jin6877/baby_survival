// BoomerangProjectile: 부메랑처럼 돌아오는 투사체
import { Projectile } from './Projectile.js';

export class BoomerangProjectile extends Projectile {
    constructor(x, y, config = {}) {
        super(x, y, {
            speed: config.speed || 5,
            damage: config.damage || 15,
            spriteKey: config.spriteKey || 'crossProjectile',
            size: config.size || 16,
            piercing: true,
            lifetime: config.lifetime || 5000,
            owner: config.owner || null,
        });

        this.startX = x;
        this.startY = y;
        this.maxRange = config.maxRange || 200;
        this.returning = false;
        this.travelDistance = 0;
        this.rotationSpeed = 0.015;

        // 방향 설정
        this.dirX = config.dirX || 0;
        this.dirY = config.dirY || 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // 회전 애니메이션
        this.rotation += this.rotationSpeed * 60 * dt;

        if (!this.returning) {
            // 외부로 이동
            this.x += this.dirX * this.speed * 60 * dt;
            this.y += this.dirY * this.speed * 60 * dt;

            const dx = this.x - this.startX;
            const dy = this.y - this.startY;
            this.travelDistance = Math.sqrt(dx * dx + dy * dy);

            if (this.travelDistance >= this.maxRange) {
                this.returning = true;
                this.hitEntities.clear(); // 돌아올 때 다시 맞을 수 있도록
            }
        } else {
            // 플레이어에게 돌아가기
            const target = this.owner;
            if (target && target.alive) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 20) {
                    this.destroy(game);
                    return;
                }

                if (dist > 0) {
                    this.x += (dx / dist) * this.speed * 60 * dt;
                    this.y += (dy / dist) * this.speed * 60 * dt;
                }
            } else {
                this.destroy(game);
                return;
            }
        }

        // 수명 (ms)
        this.lifetime -= dt * 1000;
        if (this.lifetime <= 0) {
            this.destroy(game);
        }
    }
}
