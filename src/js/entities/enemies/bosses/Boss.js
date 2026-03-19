import { Enemy } from '../Enemy.js';
import { assets } from '../../../core/AssetManager.js';

export class Boss extends Enemy {
    constructor(x, y, config = {}) {
        super(x, y, config);

        this.phases = config.phases || [];
        this.currentPhase = 0;
        this.phaseTimer = 0;
        this.showName = true;
        this.bossName = config.bossName || 'Boss';
        this.effectSpriteKey = config.effectSpriteKey || null;
        this.enemyName = config.enemyName || '';
    }

    update(dt, game) {
        if (!this.alive) return;

        this.phaseTimer += dt;
        this.checkPhaseChange();

        super.update(dt, game);
    }

    checkPhaseChange() {
        const hpPercent = this.hp / this.maxHp;

        for (let i = this.phases.length - 1; i >= 0; i--) {
            if (hpPercent <= this.phases[i].threshold && this.currentPhase < i + 1) {
                this.currentPhase = i + 1;
                this.onPhaseChange(this.currentPhase);
                break;
            }
        }
    }

    onPhaseChange(phase) {
        // Override in subclasses for phase transition effects
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Off-screen culling
        if (screenX < -this.width - 50 || screenX > camera.width + this.width + 50 ||
            screenY < -this.height - 50 || screenY > camera.height + this.height + 50) {
            return;
        }

        // Draw sprite
        ctx.globalAlpha = this.opacity;
        assets.drawSprite(ctx, this.spriteKey, screenX, screenY, this.width, this.height, this.rotation);
        ctx.globalAlpha = 1;

        // Damage flash overlay
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(
                screenX - this.width / 2,
                screenY - this.height / 2,
                this.width,
                this.height
            );
        }

        // Draw boss name above
        if (this.showName) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.bossName, screenX, screenY - this.height / 2 - 20);
        }

        // Draw larger HP bar
        const barWidth = Math.max(this.width * 2, 60);
        const barHeight = 6;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.height / 2 - 12;
        const hpRatio = this.hp / this.maxHp;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

        // HP fill
        ctx.fillStyle = hpRatio > 0.5 ? '#0f0' : hpRatio > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    }
}
