// HomingProjectile: 유도 투사체
import { Projectile } from './Projectile.js';

export class HomingProjectile extends Projectile {
    constructor(x, y, config = {}) {
        super(x, y, {
            speed: config.speed || 4,
            damage: config.damage || 12,
            spriteKey: config.spriteKey || 'magicProjectile',
            size: config.size || 10,
            piercing: config.piercing || false,
            lifetime: config.lifetime || 4000,
            owner: config.owner || null,
        });

        this.target = config.target || null;
        this.turnRate = config.turnRate || 0.003;
        this.explodeOnHit = config.explodeOnHit || false;
        this.explosionRadius = config.explosionRadius || 40;
        this.explosionDamageRatio = config.explosionDamageRatio || 0.5;

        // 초기 방향 설정
        if (this.target && this.target.alive) {
            const dx = this.target.x - x;
            const dy = this.target.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                this.velocityX = dx / dist;
                this.velocityY = dy / dist;
            }
        }
    }

    update(dt, game) {
        if (!this.alive) return;

        // 타겟이 죽었으면 새 타겟 찾기
        if (!this.target || !this.target.alive) {
            this.target = this.findNewTarget(game);
        }

        // 유도: 타겟 방향으로 점진적 회전
        if (this.target && this.target.alive) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                const desiredX = dx / dist;
                const desiredY = dy / dist;

                const t = this.turnRate * dt * 1000;
                this.velocityX += (desiredX - this.velocityX) * t;
                this.velocityY += (desiredY - this.velocityY) * t;

                // 정규화
                const vDist = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
                if (vDist > 0) {
                    this.velocityX /= vDist;
                    this.velocityY /= vDist;
                }
            }
        }

        // 이동
        this.x += this.velocityX * this.speed * 60 * dt;
        this.y += this.velocityY * this.speed * 60 * dt;
        this.rotation = Math.atan2(this.velocityY, this.velocityX);

        // 수명 (ms)
        this.lifetime -= dt * 1000;
        if (this.lifetime <= 0) {
            this.destroy(game);
        }
    }

    findNewTarget(game) {
        if (!game.enemies) return null;

        let closest = null;
        let closestDist = Infinity;
        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        }
        return closest;
    }

    onDestroy(game) {
        if (this.explodeOnHit && game) {
            this.explode(game);
        }
    }

    explode(game) {
        if (!game.enemies) return;

        const explosionDamage = this.damage * this.explosionDamageRatio;
        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.explosionRadius) {
                enemy.takeDamage(explosionDamage, game);
            }
        }
    }
}
