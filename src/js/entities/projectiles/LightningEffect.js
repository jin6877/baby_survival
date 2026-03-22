// LightningEffect → 엄마 눈물 이펙트: 큰 눈물방울 낙하 + 착지 스플래시
import { Entity } from '../../core/Entity.js';

export class LightningEffect extends Entity {
    constructor(targetX, targetY, config = {}) {
        super(targetX, targetY, 0, 0, null); // 크기 0으로 충돌 방지

        this.targetX = targetX;
        this.targetY = targetY;
        this.duration = config.duration || 900;
        this.elapsed = 0;
        this.color = config.color || '#64b5f6';
        this.isVisualEffect = true; // 충돌 체크에서 제외하기 위한 플래그
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

        // 화면 밖이면 스킵
        if (screenX < -200 || screenX > camera.width + 200 ||
            screenY < -200 || screenY > camera.height + 200) return;

        // 낙하 애니메이션: 위에서 떨어짐
        const dropProgress = Math.min(progress * 2.5, 1); // 빠르게 낙하
        const dropOffset = -120 * (1 - dropProgress);
        const dropY = screenY + dropOffset;

        ctx.save();

        // === 1단계: 눈물방울 낙하 (0~40%) ===
        if (progress < 0.5) {
            const tearAlpha = progress < 0.4 ? 1 : 1 - (progress - 0.4) / 0.1;
            const r = 28;

            // 파란 글로우
            ctx.globalAlpha = tearAlpha * 0.5;
            ctx.shadowColor = '#42a5f5';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#42a5f5';
            ctx.beginPath();
            ctx.arc(screenX, dropY, r * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 메인 물방울
            ctx.globalAlpha = tearAlpha;
            const grad = ctx.createRadialGradient(screenX - 5, dropY - 5, 0, screenX, dropY, r);
            grad.addColorStop(0, '#e3f2fd');
            grad.addColorStop(0.4, '#90caf9');
            grad.addColorStop(0.8, '#42a5f5');
            grad.addColorStop(1, '#1565c0');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(screenX, dropY - r * 1.8);
            ctx.bezierCurveTo(screenX + r * 1.3, dropY - r * 0.2, screenX + r * 1.3, dropY + r, screenX, dropY + r * 1.1);
            ctx.bezierCurveTo(screenX - r * 1.3, dropY + r, screenX - r * 1.3, dropY - r * 0.2, screenX, dropY - r * 1.8);
            ctx.fill();

            // 반짝이는 하이라이트
            ctx.globalAlpha = tearAlpha * 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(screenX - r * 0.35, dropY - r * 0.4, r * 0.2, r * 0.35, -0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // === 2단계: 착지 임팩트 (30%~100%) ===
        if (progress > 0.3) {
            const impactProgress = (progress - 0.3) / 0.7;

            // 큰 충격파 링
            ctx.globalAlpha = 0.7 * (1 - impactProgress);
            ctx.strokeStyle = '#42a5f5';
            ctx.lineWidth = 5 * (1 - impactProgress);
            ctx.beginPath();
            ctx.arc(screenX, screenY, 70 * impactProgress, 0, Math.PI * 2);
            ctx.stroke();

            // 두번째 충격파 (더 큰)
            if (impactProgress > 0.1) {
                const ip2 = (impactProgress - 0.1) / 0.9;
                ctx.globalAlpha = 0.4 * (1 - ip2);
                ctx.strokeStyle = '#90caf9';
                ctx.lineWidth = 3 * (1 - ip2);
                ctx.beginPath();
                ctx.arc(screenX, screenY, 100 * ip2, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 바닥 물웅덩이
            ctx.globalAlpha = 0.5 * (1 - impactProgress);
            const poolGrad = ctx.createRadialGradient(screenX, screenY + 3, 0, screenX, screenY + 3, 55 * impactProgress);
            poolGrad.addColorStop(0, 'rgba(66, 165, 245, 0.6)');
            poolGrad.addColorStop(1, 'rgba(66, 165, 245, 0)');
            ctx.fillStyle = poolGrad;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY + 3, 55 * impactProgress, 22 * impactProgress, 0, 0, Math.PI * 2);
            ctx.fill();

            // 튀는 물방울 파편 (8개)
            if (impactProgress < 0.7) {
                ctx.globalAlpha = 0.7 * (1 - impactProgress / 0.7);
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 / 8) * i + this.targetX * 0.1;
                    const dist = 45 * impactProgress;
                    const jumpY = -25 * impactProgress * (1 - impactProgress); // 포물선
                    const sx = screenX + Math.cos(angle) * dist;
                    const sy = screenY + Math.sin(angle) * dist * 0.5 + jumpY;
                    const dropSize = 5 * (1 - impactProgress / 0.7);

                    ctx.fillStyle = '#90caf9';
                    ctx.beginPath();
                    ctx.arc(sx, sy, dropSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        ctx.restore();
    }
}
