// Lich → 아이스크림: 장판형 보스
import { Boss } from './Boss.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';
import { assets } from '../../../core/AssetManager.js';

class HomingBullet extends EnemyBullet {
    constructor(x, y, targetX, targetY, damage) {
        super(x, y, targetX, targetY, damage);
        this.speed = 3;
        this.turnSpeed = 2;
        this.spriteKey = 'lichEffect';
    }

    update(dt, game) {
        if (!this.alive) return;

        if (game && game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                const targetDirX = dx / dist;
                const targetDirY = dy / dist;

                this.dirX += (targetDirX - this.dirX) * this.turnSpeed * dt;
                this.dirY += (targetDirY - this.dirY) * this.turnSpeed * dt;

                const dirDist = Math.sqrt(this.dirX * this.dirX + this.dirY * this.dirY);
                if (dirDist > 0) {
                    this.dirX /= dirDist;
                    this.dirY /= dirDist;
                }
            }
        }

        this.x += this.dirX * this.speed * 60 * dt;
        this.y += this.dirY * this.speed * 60 * dt;

        this.rotation = Math.atan2(this.dirY, this.dirX);

        if (Math.abs(this.x) > 5000 || Math.abs(this.y) > 5000) {
            this.alive = false;
        }
    }
}

class AoEZone {
    constructor(x, y, radius, duration, damage, slowFactor) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = duration;
        this.damage = damage;
        this.slowFactor = slowFactor || 0.5;
        this.timer = 0;
        this.alive = true;
        this.damageTickTimer = 0;
        this.damageTickInterval = 0.5;
    }

    update(dt, game) {
        if (!this.alive) return;

        this.timer += dt;
        if (this.timer >= this.duration) {
            this.alive = false;
            return;
        }

        if (game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.radius) {
                if (game.player.speed !== undefined) {
                    game.player.slowMultiplier = this.slowFactor;
                }

                this.damageTickTimer += dt;
                if (this.damageTickTimer >= this.damageTickInterval) {
                    this.damageTickTimer = 0;
                    if (game.player.takeDamage) {
                        game.player.takeDamage(this.damage);
                    }
                }
            }
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        const alpha = 0.4 * (1 - this.timer / this.duration);
        // 아이스크림 녹는 장판 이펙트
        if (assets.hasSprite('lichEffect')) {
            ctx.globalAlpha = alpha + 0.1;
            assets.drawSprite(ctx, 'lichEffect', screenX, screenY, this.radius * 2, this.radius * 2);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = `rgba(255, 182, 193, ${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 105, 180, ${alpha + 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

export class Lich extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 800,
            speed: 1.3,
            damage: 15,
            size: 88,
            spriteKey: 'lich',
            effectSpriteKey: 'lichEffect',
            enemyName: '아이스크림',
            exp: 60,
            bossName: '아이스크림',
            phases: []
        });

        this.aoeTimer = 0;
        this.aoeInterval = 3;
        this.aoeRadius = 120;
        this.aoeDuration = 3;

        this.shootTimer = 0;
        this.shootInterval = 2;

        this.aoeZones = [];
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }

        // 아이스크림 녹는 장판 생성
        this.aoeTimer += dt;
        if (this.aoeTimer >= this.aoeInterval) {
            this.aoeTimer = 0;
            const zone = new AoEZone(
                game.player.x, game.player.y,
                this.aoeRadius, this.aoeDuration,
                5, 0.5
            );
            this.aoeZones.push(zone);
        }

        for (let i = this.aoeZones.length - 1; i >= 0; i--) {
            this.aoeZones[i].update(dt, game);
            if (!this.aoeZones[i].alive) {
                this.aoeZones.splice(i, 1);
            }
        }

        // 유도 아이스크림 발사
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shootHomingBullet(game);
        }
    }

    shootHomingBullet(game) {
        if (!game.player || !game.player.alive || !game.projectiles) return;

        const bullet = new HomingBullet(
            this.x, this.y,
            game.player.x, game.player.y,
            this.damage
        );
        game.enemyBullets.push(bullet);
    }

    render(ctx, camera) {
        for (const zone of this.aoeZones) {
            zone.render(ctx, camera);
        }

        super.render(ctx, camera);
    }
}
