// Knight → 충치균: 탱커형 적군 + 공격 애니메이션
import { Enemy } from './Enemy.js';
import { assets } from '../../core/AssetManager.js';

export class Knight extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 80,
            speed: 1,
            damage: 15,
            size: 80,
            spriteKey: 'knight',
            effectSpriteKey: 'knightEffect',
            enemyName: '충치균',
            exp: 3
        });

        // 공격 애니메이션
        this.attackAnimTimer = 0;
        this.attackAnimDuration = 0.6;
        this.isAttacking = false;
        this.attackFrameKeys = ['knightAttack1', 'knightAttack2', 'knightAttack3', 'knightAttack4'];
        this.attackCooldown = 0;
        this.attackInterval = 2.5;
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

        // 공격 애니메이션 업데이트
        if (this.isAttacking) {
            this.attackAnimTimer += dt;
            if (this.attackAnimTimer >= this.attackAnimDuration) {
                this.isAttacking = false;
                this.attackAnimTimer = 0;
            }
        }

        // 근접 공격 트리거
        this.attackCooldown += dt;
        if (dist <= 50 && this.attackCooldown >= this.attackInterval) {
            this.attackCooldown = 0;
            this.isAttacking = true;
            this.attackAnimTimer = 0;
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

        // 공격 중이면 공격 프레임 렌더링
        if (this.isAttacking) {
            const frameProgress = this.attackAnimTimer / this.attackAnimDuration;
            const frameIndex = Math.min(Math.floor(frameProgress * 4), 3);
            const frameKey = this.attackFrameKeys[frameIndex];
            const attackSize = this.width * 2;
            assets.drawSprite(ctx, frameKey, screenX, screenY, attackSize, attackSize);
        }

        // 기본 렌더링
        super.render(ctx, camera);
    }
}
