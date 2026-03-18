// LightningEffect: 번개 시각 효과
import { Entity } from '../../core/Entity.js';

export class LightningEffect extends Entity {
    constructor(targetX, targetY, config = {}) {
        super(targetX, targetY, 20, 20, null);

        this.targetX = targetX;
        this.targetY = targetY;
        this.duration = config.duration || 300;
        this.elapsed = 0;
        this.color = config.color || '#ffeb3b';
        this.segments = this.generateSegments();
    }

    generateSegments() {
        // 화면 상단에서 타겟까지 지그재그 선 생성
        const segments = [];
        const startY = this.targetY - 600;
        const endY = this.targetY;
        const segmentCount = 8 + Math.floor(Math.random() * 5);
        const stepY = (endY - startY) / segmentCount;

        let currentX = this.targetX;
        let currentY = startY;

        for (let i = 0; i < segmentCount; i++) {
            const nextX = this.targetX + (Math.random() - 0.5) * 60;
            const nextY = currentY + stepY;

            segments.push({
                x1: currentX,
                y1: currentY,
                x2: i === segmentCount - 1 ? this.targetX : nextX,
                y2: i === segmentCount - 1 ? this.targetY : nextY,
            });

            currentX = nextX;
            currentY = nextY;
        }

        return segments;
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

        const fadeRatio = 1 - (this.elapsed / this.duration);
        if (fadeRatio <= 0) return;

        ctx.globalAlpha = fadeRatio;

        // 번개 글로우
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        for (const seg of this.segments) {
            ctx.moveTo(seg.x1 - camera.x, seg.y1 - camera.y);
            ctx.lineTo(seg.x2 - camera.x, seg.y2 - camera.y);
        }
        ctx.stroke();

        // 코어 라인
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (const seg of this.segments) {
            ctx.moveTo(seg.x1 - camera.x, seg.y1 - camera.y);
            ctx.lineTo(seg.x2 - camera.x, seg.y2 - camera.y);
        }
        ctx.stroke();

        // 충격 지점 플래시
        const screenX = this.targetX - camera.x;
        const screenY = this.targetY - camera.y;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 10 * fadeRatio, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}
