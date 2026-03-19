// DarkKnight → 스마트폰: 돌진형 보스
import { Boss } from './Boss.js';
import { assets } from '../../../core/AssetManager.js';

export class DarkKnight extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 600,
            speed: 1.5,
            damage: 20,
            size: 120,
            spriteKey: 'darkKnight',
            effectSpriteKey: 'darkKnightEffect',
            enemyName: '스마트폰',
            exp: 40,
            bossName: '스마트폰',
            phases: []
        });

        this.chargeTimer = 0;
        this.chargeInterval = 4;
        this.isCharging = false;
        this.chargeDuration = 0.5;
        this.chargeSpeed = 8;
        this.chargeElapsed = 0;
        this.chargeDirX = 0;
        this.chargeDirY = 0;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        if (this.isCharging) {
            this.chargeElapsed += dt;
            this.x += this.chargeDirX * this.chargeSpeed * 60 * dt;
            this.y += this.chargeDirY * this.chargeSpeed * 60 * dt;

            if (this.chargeElapsed >= this.chargeDuration) {
                this.isCharging = false;
                this.chargeElapsed = 0;
            }
            return;
        }

        // 일반 추적
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }

        // 돌진 타이머
        this.chargeTimer += dt;
        if (this.chargeTimer >= this.chargeInterval) {
            this.chargeTimer = 0;
            this.startCharge(game);
        }
    }

    startCharge(game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.chargeDirX = dx / dist;
            this.chargeDirY = dy / dist;
        }

        this.isCharging = true;
        this.chargeElapsed = 0;
    }

    render(ctx, camera) {
        // 돌진 중 스피드 이펙트
        if (this.isCharging) {
            const screenX = this.x - camera.x;
            const screenY = this.y - camera.y;
            ctx.globalAlpha = 0.5;
            const trailX = screenX - this.chargeDirX * 30;
            const trailY = screenY - this.chargeDirY * 30;
            assets.drawSprite(ctx, 'darkKnightEffect', trailX, trailY, this.width * 1.5, this.height * 1.5);
            ctx.globalAlpha = 1;
        }

        super.render(ctx, camera);
    }
}
