// Slime → 장염균: 자폭형 적군
import { Enemy } from './Enemy.js';

export class Slime extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 30,
            speed: 2.5,
            damage: 25,
            size: 60,
            spriteKey: 'slime',
            enemyName: '장염균',
            exp: 2
        });

        this.selfDestructTimer = 0;
        this.selfDestructDuration = 1.5;
        this.isSelfDestructing = false;
        this.explodeRadius = 80;
        this.hasExploded = false;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.isSelfDestructing) {
            // Flash red during countdown
            this.selfDestructTimer += dt;
            const flashRate = 10 + (this.selfDestructTimer / this.selfDestructDuration) * 20;
            this.opacity = 0.5 + 0.5 * Math.abs(Math.sin(this.selfDestructTimer * flashRate));

            if (this.selfDestructTimer >= this.selfDestructDuration) {
                this.explode(game);
            }
            return;
        }

        // Chase player
        if (dist > 0) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.x += dirX * this.speed * 60 * dt;
            this.y += dirY * this.speed * 60 * dt;
        }

        // Start self-destruct when close to player
        if (dist <= 60) {
            this.isSelfDestructing = true;
            this.selfDestructTimer = 0;
        }
    }

    explode(game) {
        if (this.hasExploded) return;
        this.hasExploded = true;

        // Deal damage to player if in radius
        if (game.player && game.player.alive) {
            const dist = this.distanceTo(game.player);
            if (dist <= this.explodeRadius) {
                if (game.player.takeDamage) {
                    game.player.takeDamage(this.damage);
                }
            }
        }

        this.alive = false;
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Off-screen culling
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // Flash red during self-destruct
        if (this.isSelfDestructing) {
            ctx.save();
            super.render(ctx, camera);
            // Red overlay
            const flashIntensity = Math.abs(Math.sin(this.selfDestructTimer * 15));
            ctx.fillStyle = `rgba(255, 0, 0, ${flashIntensity * 0.6})`;
            ctx.fillRect(
                screenX - this.width / 2,
                screenY - this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        } else {
            super.render(ctx, camera);
        }

        // Draw HP bar if damaged
        if (this.hp < this.maxHp) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = screenX - barWidth / 2;
            const barY = screenY - this.height / 2 - 8;
            const hpRatio = this.hp / this.maxHp;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = hpRatio > 0.5 ? '#0f0' : hpRatio > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
        }
    }
}
