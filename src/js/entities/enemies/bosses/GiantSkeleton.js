// GiantSkeleton → 과자 봉지: 광역 공격 보스
import { Boss } from './Boss.js';
import { assets } from '../../../core/AssetManager.js';

export class GiantSkeleton extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 300,
            speed: 0.8,
            damage: 12,
            size: 90,
            spriteKey: 'giantSkeleton',
            effectSpriteKey: 'giantSkeletonEffect',
            enemyName: '과자 봉지',
            exp: 20,
            bossName: '과자 봉지',
            phases: []
        });

        this.sweepTimer = 0;
        this.sweepInterval = 3;
        this.sweepRadius = 100;
        this.sweepEffectTimer = 0;
        this.showSweepEffect = false;
    }

    movementPattern(dt, game) {
        if (game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                this.x += (dx / dist) * this.speed * 60 * dt;
                this.y += (dy / dist) * this.speed * 60 * dt;
            }
        }

        // 과자 부스러기 광역 공격
        this.sweepTimer += dt;
        if (this.sweepTimer >= this.sweepInterval) {
            this.sweepTimer = 0;
            this.sweepAttack(game);
        }

        if (this.showSweepEffect) {
            this.sweepEffectTimer += dt;
            if (this.sweepEffectTimer >= 0.5) {
                this.showSweepEffect = false;
            }
        }
    }

    sweepAttack(game) {
        if (!game.player || !game.player.alive) return;

        this.showSweepEffect = true;
        this.sweepEffectTimer = 0;

        const dist = this.distanceTo(game.player);
        if (dist <= this.sweepRadius) {
            if (game.player.takeDamage) {
                game.player.takeDamage(this.damage);
            }
        }
    }

    render(ctx, camera) {
        // 광역 공격 이펙트 (과자 부스러기)
        if (this.showSweepEffect) {
            const screenX = this.x - camera.x;
            const screenY = this.y - camera.y;
            const effectAlpha = 1 - (this.sweepEffectTimer / 0.5);
            ctx.globalAlpha = effectAlpha * 0.6;
            const effectSize = this.sweepRadius * 2;
            assets.drawSprite(ctx, 'giantSkeletonEffect', screenX, screenY, effectSize, effectSize);
            ctx.globalAlpha = 1;
        }

        super.render(ctx, camera);
    }
}
