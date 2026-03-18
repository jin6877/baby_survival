import { Boss } from './Boss.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';

class HomingBullet extends EnemyBullet {
    constructor(x, y, targetX, targetY, damage) {
        super(x, y, targetX, targetY, damage);
        this.speed = 3;
        this.turnSpeed = 2;
        this.spriteKey = 'lichBullet';
    }

    update(dt, game) {
        if (!this.alive) return;

        // Home toward player
        if (game && game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                const targetDirX = dx / dist;
                const targetDirY = dy / dist;

                // Gradually turn toward player
                this.dirX += (targetDirX - this.dirX) * this.turnSpeed * dt;
                this.dirY += (targetDirY - this.dirY) * this.turnSpeed * dt;

                // Normalize direction
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

        // Destroy if out of bounds
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

        // Damage and slow player if in zone
        if (game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.radius) {
                // Slow player
                if (game.player.speed !== undefined) {
                    game.player.slowMultiplier = this.slowFactor;
                }

                // Damage tick
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

        const alpha = 0.3 * (1 - this.timer / this.duration);
        ctx.fillStyle = `rgba(100, 0, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(150, 50, 255, ${alpha + 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export class Lich extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 800,
            speed: 1.3,
            damage: 15,
            size: 40,
            spriteKey: 'lich',
            exp: 60,
            bossName: 'Lich',
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

        // Chase player
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }

        // Create AoE zones at player's position
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

        // Update AoE zones
        for (let i = this.aoeZones.length - 1; i >= 0; i--) {
            this.aoeZones[i].update(dt, game);
            if (!this.aoeZones[i].alive) {
                this.aoeZones.splice(i, 1);
            }
        }

        // Shoot homing bullets
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
        // Render AoE zones first (below boss)
        for (const zone of this.aoeZones) {
            zone.render(ctx, camera);
        }

        super.render(ctx, camera);
    }
}
