import { Entity } from '../../core/Entity.js';
import { assets } from '../../core/AssetManager.js';

export class Enemy extends Entity {
    constructor(x, y, config = {}) {
        const size = config.size || 20;
        super(x, y, size, size, config.spriteKey || 'enemy');

        this.hp = config.hp || 10;
        this.maxHp = this.hp;
        this.speed = config.speed || 1;
        this.baseSpeed = this.speed;
        this.damage = config.damage || 5;
        this.expValue = config.exp || 1;
        this.enemyName = config.enemyName || '';

        this.knockbackX = 0;
        this.knockbackY = 0;
        this.knockbackTimer = 0;

        this.damageFlashTimer = 0;
        this.damageFlashDuration = 0.15;

        // 이펙트 스프라이트 키
        this.effectSpriteKey = config.effectSpriteKey || null;
        this.effectTimer = 0;
        this.showEffect = false;
        this.effectDuration = 0.4;
    }

    update(dt, game) {
        if (!this.alive) return;

        // Apply knockback decay
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= dt;
            this.x += this.knockbackX * dt;
            this.y += this.knockbackY * dt;

            // Decay knockback
            const decay = Math.pow(0.05, dt);
            this.knockbackX *= decay;
            this.knockbackY *= decay;

            if (this.knockbackTimer <= 0) {
                this.knockbackX = 0;
                this.knockbackY = 0;
                this.knockbackTimer = 0;
            }
        }

        // Damage flash decay
        if (this.damageFlashTimer > 0) {
            this.damageFlashTimer -= dt;
        }

        // 이펙트 타이머
        if (this.showEffect) {
            this.effectTimer += dt;
            if (this.effectTimer >= this.effectDuration) {
                this.showEffect = false;
                this.effectTimer = 0;
            }
        }

        this.movementPattern(dt, game);
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
    }

    takeDamage(amount, knockbackAngle) {
        if (!this.alive) return;

        this.hp -= amount;
        this.damageFlashTimer = this.damageFlashDuration;
        this.showEffect = true;
        this.effectTimer = 0;

        // Apply knockback
        if (knockbackAngle !== undefined) {
            const knockbackForce = 200;
            this.knockbackX = Math.cos(knockbackAngle) * knockbackForce;
            this.knockbackY = Math.sin(knockbackAngle) * knockbackForce;
            this.knockbackTimer = 0.2;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    onDeath(game) {
        if (game.dropSystem) {
            game.dropSystem.handleDrop(this);
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

        // Damage flash effect
        if (this.damageFlashTimer > 0) {
            ctx.globalAlpha = this.opacity;
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
        }

        // Draw sprite
        super.render(ctx, camera);

        // Damage flash overlay
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(
                screenX - this.width / 2,
                screenY - this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        }

        // 피격 이펙트 렌더링
        if (this.showEffect && this.effectSpriteKey) {
            const effectAlpha = 1 - (this.effectTimer / this.effectDuration);
            if (effectAlpha > 0) {
                ctx.globalAlpha = effectAlpha;
                const effectSize = this.width * 1.5;
                assets.drawSprite(ctx, this.effectSpriteKey, screenX, screenY, effectSize, effectSize);
                ctx.globalAlpha = 1;
            }
        }

        // Draw HP bar if damaged
        if (this.hp < this.maxHp) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = screenX - barWidth / 2;
            const barY = screenY - this.height / 2 - 8;
            const hpRatio = this.hp / this.maxHp;

            // Background
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // HP fill
            ctx.fillStyle = hpRatio > 0.5 ? '#0f0' : hpRatio > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
        }
    }
}
