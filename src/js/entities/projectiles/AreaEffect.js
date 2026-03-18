// AreaEffect: 범위 효과 (원형 데미지 존)
import { Entity } from '../../core/Entity.js';

export class AreaEffect extends Entity {
    constructor(x, y, config = {}) {
        const radius = config.radius || 60;
        super(x, y, radius * 2, radius * 2, null);

        this.radius = radius;
        this.damage = config.damage || 5;
        this.duration = config.duration || 2000;
        this.tickInterval = config.tickInterval || 300;
        this.color = config.color || '#42a5f5';
        this.owner = config.owner || null;
        this.followOwner = config.followOwner || false;

        this.elapsed = 0;
        this.tickTimer = 0;
        this.pulsePhase = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // 소유자 따라가기
        if (this.followOwner && this.owner && this.owner.alive) {
            this.x = this.owner.x;
            this.y = this.owner.y;
        }

        this.elapsed += dt * 1000;
        this.tickTimer += dt * 1000;
        this.pulsePhase += dt * 5;

        // 틱 데미지
        if (this.tickTimer >= this.tickInterval) {
            this.tickTimer -= this.tickInterval;
            this.dealDamage(game);
        }

        // 지속 시간 만료
        if (this.elapsed >= this.duration) {
            this.destroy(game);
        }
    }

    dealDamage(game) {
        if (!game.enemies) return;

        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.radius) {
                enemy.takeDamage(this.damage, game);
            }
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // 화면 밖이면 스킵
        if (screenX < -this.radius || screenX > camera.width + this.radius ||
            screenY < -this.radius || screenY > camera.height + this.radius) {
            return;
        }

        const pulse = 0.3 + Math.sin(this.pulsePhase) * 0.1;
        const fadeRatio = 1 - (this.elapsed / this.duration);

        ctx.globalAlpha = pulse * fadeRatio;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 테두리
        ctx.globalAlpha = (0.5 + Math.sin(this.pulsePhase) * 0.2) * fadeRatio;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }
}
