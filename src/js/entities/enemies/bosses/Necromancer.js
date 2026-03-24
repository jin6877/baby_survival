// Necromancer → 사탕 괴물: 소환형 보스
import { Boss } from './Boss.js';
import { Zombie } from '../Zombie.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';
import { assets } from '../../../core/AssetManager.js';

export class Necromancer extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 500,
            speed: 1.2,
            damage: 10,
            size: 88,
            spriteKey: 'necromancer',
            effectSpriteKey: 'necromancerEffect',
            enemyName: '사탕 괴물',
            exp: 50,
            bossName: '사탕 괴물',
            phases: [
                { threshold: 0.5 }
            ]
        });

        this.summonTimer = 0;
        this.shootTimer = 0;
        this.summonEffectTimer = 0;
        this.showSummonEffect = false;
    }

    onPhaseChange(phase) {
        if (phase === 1) {
            this.speed = this.baseSpeed * 1.5;
        }
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

        const isPhase2 = this.currentPhase >= 1;

        // 병균 소환
        this.summonTimer += dt;
        const summonInterval = isPhase2 ? 4 : 5;
        const summonCount = isPhase2 ? 5 : 3;

        if (this.summonTimer >= summonInterval) {
            this.summonTimer = 0;
            this.summonZombies(game, summonCount);
        }

        // 사탕 총알 발사
        this.shootTimer += dt;
        const shootInterval = isPhase2 ? 2 : 3;
        const bulletCount = isPhase2 ? 5 : 3;

        if (this.shootTimer >= shootInterval) {
            this.shootTimer = 0;
            this.shootSpread(game, bulletCount);
        }

        if (this.showSummonEffect) {
            this.summonEffectTimer += dt;
            if (this.summonEffectTimer >= 0.6) {
                this.showSummonEffect = false;
            }
        }
    }

    summonZombies(game, count) {
        if (!game.enemies) return;

        this.showSummonEffect = true;
        this.summonEffectTimer = 0;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const spawnDist = 60;
            const zombie = new Zombie(
                this.x + Math.cos(angle) * spawnDist,
                this.y + Math.sin(angle) * spawnDist
            );
            game.enemies.push(zombie);
        }
    }

    shootSpread(game, bulletCount) {
        if (!game.player || !game.player.alive || !game.projectiles) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const spreadAngle = Math.PI / 6;

        for (let i = 0; i < bulletCount; i++) {
            const offset = (i - (bulletCount - 1) / 2) * (spreadAngle / Math.max(bulletCount - 1, 1));
            const angle = baseAngle + offset;
            const targetX = this.x + Math.cos(angle) * 500;
            const targetY = this.y + Math.sin(angle) * 500;

            const bullet = new EnemyBullet(this.x, this.y, targetX, targetY, this.damage);
            game.enemyBullets.push(bullet);
        }
    }

    render(ctx, camera) {
        // 소환 이펙트 (사탕 별)
        if (this.showSummonEffect) {
            const screenX = this.x - camera.x;
            const screenY = this.y - camera.y;
            const effectAlpha = 1 - (this.summonEffectTimer / 0.6);
            ctx.globalAlpha = effectAlpha * 0.8;
            const effectSize = 80 + this.summonEffectTimer * 60;
            assets.drawSprite(ctx, 'necromancerEffect', screenX, screenY, effectSize, effectSize);
            ctx.globalAlpha = 1;
        }

        super.render(ctx, camera);
    }
}
