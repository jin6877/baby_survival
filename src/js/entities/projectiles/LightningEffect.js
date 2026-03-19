// LightningEffect → 엄마 눈물 이펙트: 눈물방울이 떨어지는 효과 (이미지 기반)
import { Entity } from '../../core/Entity.js';
import { assets } from '../../core/AssetManager.js';

export class LightningEffect extends Entity {
    constructor(targetX, targetY, config = {}) {
        super(targetX, targetY, 80, 80, null);

        this.targetX = targetX;
        this.targetY = targetY;
        this.duration = config.duration || 500;
        this.elapsed = 0;
        this.color = config.color || '#64b5f6';
        this.spriteKey = 'momTearsEffect';
        this.effectSize = config.size || 80;
    }

    update(dt, game) {
        if (!this.alive) return;

        this.elapsed += dt * 1000;
        if (this.elapsed >= this.duration) {
            this.destroy(game);
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const progress = this.elapsed / this.duration;
        const fadeRatio = 1 - progress;
        if (fadeRatio <= 0) return;

        const screenX = this.targetX - camera.x;
        const screenY = this.targetY - camera.y;

        // 낙하 애니메이션: 위에서 아래로
        const dropOffset = -60 * (1 - progress);

        ctx.save();
        ctx.globalAlpha = fadeRatio;

        // 이미지가 있으면 이미지로 렌더링
        if (assets.hasSprite(this.spriteKey)) {
            const size = this.effectSize * (0.8 + 0.4 * progress);
            assets.drawSprite(ctx, this.spriteKey, screenX, screenY + dropOffset, size, size);
        } else {
            // 폴백: 코드 눈물방울
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 25;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            const r = 18 * fadeRatio;
            const dropY = screenY + dropOffset;
            ctx.moveTo(screenX, dropY - r * 1.5);
            ctx.bezierCurveTo(screenX + r, dropY - r * 0.5, screenX + r, dropY + r * 0.5, screenX, dropY + r);
            ctx.bezierCurveTo(screenX - r, dropY + r * 0.5, screenX - r, dropY - r * 0.5, screenX, dropY - r * 1.5);
            ctx.fill();

            ctx.shadowBlur = 0;
        }

        // 착지 물방울 퍼짐 효과 (항상 표시)
        if (progress > 0.4) {
            const splashProgress = (progress - 0.4) / 0.6;
            ctx.globalAlpha = 0.5 * (1 - splashProgress);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY + 8, 35 * splashProgress, 14 * splashProgress, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
