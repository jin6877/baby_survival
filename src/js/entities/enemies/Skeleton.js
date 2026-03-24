// Skeleton → A형 독감: 돌진 공격 적군 - 주기적으로 플레이어에게 빠르게 돌진
import { Enemy } from './Enemy.js';

export class Skeleton extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 35,
            speed: 1.5,
            damage: 12,
            size: 52,
            spriteKey: 'skeleton',
            effectSpriteKey: 'skeletonEffect',
            enemyName: 'A형 독감',
            exp: 2
        });

        // 돌진 시스템
        this.chargeTimer = 2 + Math.random() * 2; // 2~4초 후 첫 돌진
        this.chargeInterval = 3.5;
        this.isCharging = false;
        this.chargeDuration = 0.5;
        this.chargeElapsed = 0;
        this.chargeDirX = 0;
        this.chargeDirY = 0;
        this.chargeSpeed = 8;
        // 돌진 전 준비 모션
        this.isWindingUp = false;
        this.windUpDuration = 0.6;
        this.windUpElapsed = 0;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 돌진 준비 중 (제자리에서 흔들림)
        if (this.isWindingUp) {
            this.windUpElapsed += dt;
            // 떨리는 효과
            this.x += (Math.random() - 0.5) * 3;
            this.y += (Math.random() - 0.5) * 3;

            if (this.windUpElapsed >= this.windUpDuration) {
                this.isWindingUp = false;
                this.isCharging = true;
                this.chargeElapsed = 0;
                // 돌진 방향 고정
                if (dist > 0) {
                    this.chargeDirX = dx / dist;
                    this.chargeDirY = dy / dist;
                }
            }
            return;
        }

        // 돌진 중
        if (this.isCharging) {
            this.chargeElapsed += dt;
            this.x += this.chargeDirX * this.chargeSpeed * 60 * dt;
            this.y += this.chargeDirY * this.chargeSpeed * 60 * dt;

            if (this.chargeElapsed >= this.chargeDuration) {
                this.isCharging = false;
                this.chargeTimer = this.chargeInterval;
            }
            return;
        }

        // 일반 추적
        this.chargeTimer -= dt;
        if (this.chargeTimer <= 0 && dist < 400 && dist > 50) {
            this.isWindingUp = true;
            this.windUpElapsed = 0;
            return;
        }

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // 돌진 준비 중 빨간 경고 표시
        if (this.isWindingUp) {
            ctx.save();
            const progress = this.windUpElapsed / this.windUpDuration;
            ctx.strokeStyle = `rgba(255, 50, 50, ${0.3 + progress * 0.7})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        // 돌진 중 잔상 효과
        if (this.isCharging) {
            ctx.globalAlpha = 0.3;
            const trailX = screenX - this.chargeDirX * 20;
            const trailY = screenY - this.chargeDirY * 20;
            super.render(ctx, { ...camera, x: camera.x + this.chargeDirX * 20, y: camera.y + this.chargeDirY * 20 });
            ctx.globalAlpha = 1;
        }

        super.render(ctx, camera);
    }
}
