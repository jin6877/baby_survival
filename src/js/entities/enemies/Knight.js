// Knight → 충치균: 탱커형 적군 + 보호막 + 지면 충격파
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

        // 보호막: 주기적으로 받는 데미지 80% 감소
        this.shieldTimer = 4 + Math.random() * 2;
        this.shieldDuration = 3;
        this.shieldElapsed = 0;
        this.isShielded = false;
        this.shieldCooldown = 8;

        // 지면 충격파: 가까이 오면 주변 넓은 범위 공격
        this.groundPoundCooldown = 0;
        this.groundPoundInterval = 5;
        this.groundPoundRadius = 120;
        this.isGroundPounding = false;
        this.groundPoundAnimTimer = 0;
        this.groundPoundAnimDuration = 0.5;

        // 분노 모드: HP 30% 이하 시 속도/데미지 증가
        this.isEnraged = false;
    }

    takeDamage(amount, knockbackAngle) {
        let actualAmount = amount;
        if (this.isShielded) {
            actualAmount = amount * 0.2; // 80% 감소
        }
        super.takeDamage(actualAmount, knockbackAngle);

        // 분노 체크
        if (!this.isEnraged && this.hp > 0 && this.hp / this.maxHp <= 0.3) {
            this.isEnraged = true;
            this.speed = this.baseSpeed * 1.8;
            this.damage = Math.round(this.damage * 1.5);
        }
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 보호막 타이머
        if (this.isShielded) {
            this.shieldElapsed += dt;
            if (this.shieldElapsed >= this.shieldDuration) {
                this.isShielded = false;
                this.shieldTimer = this.shieldCooldown;
            }
        } else {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                this.isShielded = true;
                this.shieldElapsed = 0;
            }
        }

        // 지면 충격파 애니메이션
        if (this.isGroundPounding) {
            this.groundPoundAnimTimer += dt;
            if (this.groundPoundAnimTimer >= this.groundPoundAnimDuration) {
                this.isGroundPounding = false;
            }
            return; // 충격파 중 이동 불가
        }

        // 이동
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

        // 지면 충격파
        this.groundPoundCooldown += dt;
        if (dist <= 100 && this.groundPoundCooldown >= this.groundPoundInterval) {
            this.groundPoundCooldown = 0;
            this.isGroundPounding = true;
            this.groundPoundAnimTimer = 0;
            this._doGroundPound(game);
        }
    }

    _doGroundPound(game) {
        if (!game.player || !game.player.alive) return;
        const dist = this.distanceTo(game.player);
        if (dist <= this.groundPoundRadius) {
            game.player.takeDamage(Math.round(this.damage * 0.8));
            // 넉백
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 8;
            game.player.x += (dx / d) * force;
            game.player.y += (dy / d) * force;
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

        // 보호막 렌더링
        if (this.isShielded) {
            ctx.save();
            const pulse = 0.6 + 0.4 * Math.sin(this.shieldElapsed * 6);
            ctx.strokeStyle = `rgba(100, 200, 255, ${pulse})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            // 내부 채움
            ctx.fillStyle = `rgba(100, 200, 255, ${pulse * 0.15})`;
            ctx.fill();
            ctx.restore();
        }

        // 분노 표시
        if (this.isEnraged) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 50, 30, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 지면 충격파 이펙트
        if (this.isGroundPounding) {
            ctx.save();
            const progress = this.groundPoundAnimTimer / this.groundPoundAnimDuration;
            const radius = this.groundPoundRadius * progress;
            ctx.globalAlpha = 0.5 * (1 - progress);
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        // 기본 렌더링
        super.render(ctx, camera);
    }
}
