import { Entity } from '../../core/Entity.js';
import { assets } from '../../core/AssetManager.js';

export class Enemy extends Entity {
    constructor(x, y, config = {}) {
        const size = config.size || 20;
        super(x, y, size, size, config.spriteKey || 'enemy');

        this.hp = config.hp || 10;
        this.maxHp = this.hp;
        this.speed = config.speed || 1;
        this.baseSpeed = this.speed;
        this.damage = config.damage || 5;
        this.expValue = config.exp || 1;
        this.enemyName = config.enemyName || '';

        this.knockbackX = 0;
        this.knockbackY = 0;
        this.knockbackTimer = 0;

        this.damageFlashTimer = 0;
        this.damageFlashDuration = 0.15;

        // 이펙트 스프라이트 키
        this.effectSpriteKey = config.effectSpriteKey || null;
        this.effectTimer = 0;
        this.showEffect = false;
        this.effectDuration = 0.4;

        // 데미지 숫자 표시
        this.damageNumbers = [];
    }

    update(dt, game) {
        if (!this.alive) return;

        // Apply knockback decay
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= dt;
            this.x += this.knockbackX * dt;
            this.y += this.knockbackY * dt;

            // Decay knockback
            const decay = Math.pow(0.05, dt);
            this.knockbackX *= decay;
            this.knockbackY *= decay;

            if (this.knockbackTimer <= 0) {
                this.knockbackX = 0;
                this.knockbackY = 0;
                this.knockbackTimer = 0;
            }
        }

        // Damage flash decay
        if (this.damageFlashTimer > 0) {
            this.damageFlashTimer -= dt;
        }

        // 이펙트 타이머
        if (this.showEffect) {
            this.effectTimer += dt;
            if (this.effectTimer >= this.effectDuration) {
                this.showEffect = false;
                this.effectTimer = 0;
            }
        }

        // 데미지 숫자 업데이트
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const dn = this.damageNumbers[i];
            dn.timer -= dt;
            dn.offsetY -= 40 * dt; // 위로 떠오름
            if (dn.timer <= 0) {
                this.damageNumbers.splice(i, 1);
            }
        }

        // 넉백 중에는 이동하지 않음
        if (this.knockbackTimer > 0) return;

        this.movementPattern(dt, game);
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
    }

    takeDamage(amount, knockbackAngle, game) {
        if (!this.alive) return;
        if (!amount || amount <= 0) return; // NaN/undefined/0 방어

        // 일부 무기가 game을 두번째 인자로 넘기는 경우 처리
        if (knockbackAngle && typeof knockbackAngle === 'object') {
            game = knockbackAngle;
            knockbackAngle = undefined;
        }

        this.hp -= amount;
        this.damageFlashTimer = this.damageFlashDuration;
        this.showEffect = true;
        this.effectTimer = 0;

        // 데미지 숫자 팝업 추가
        this.damageNumbers.push({
            value: Math.round(amount),
            timer: 0.6,
            offsetX: (Math.random() - 0.5) * 20,
            offsetY: 0,
        });

        // Apply knockback
        if (knockbackAngle !== undefined) {
            const knockbackForce = 200;
            this.knockbackX = Math.cos(knockbackAngle) * knockbackForce;
            this.knockbackY = Math.sin(knockbackAngle) * knockbackForce;
            this.knockbackTimer = 0.2;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            if (game) {
                this.onDeath(game);
                if (game.player) {
                    game.player.addKill();
                }
            } else {
                this.alive = false;
            }
        }
    }

    onDeath(game) {
        if (game.dropSystem) {
            game.dropSystem.handleDrop(this);
        }
        this.alive = false;
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Off-screen culling
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // Damage flash effect
        if (this.damageFlashTimer > 0) {
            ctx.globalAlpha = this.opacity;
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
        }

        // Draw sprite
        super.render(ctx, camera);

        // Damage flash overlay
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(
                screenX - this.width / 2,
                screenY - this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        }

        // 피격 이펙트 렌더링
        if (this.showEffect && this.effectSpriteKey) {
            const effectAlpha = 1 - (this.effectTimer / this.effectDuration);
            if (effectAlpha > 0) {
                ctx.globalAlpha = effectAlpha;
                const effectSize = this.width * 1.5;
                assets.drawSprite(ctx, this.effectSpriteKey, screenX, screenY, effectSize, effectSize);
                ctx.globalAlpha = 1;
            }
        }

        // 데미지 숫자 표시
        for (const dn of this.damageNumbers) {
            const alpha = Math.min(1, dn.timer / 0.3);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffeb3b';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const tx = screenX + dn.offsetX;
            const ty = screenY - this.height / 2 + dn.offsetY;
            ctx.strokeText(dn.value, tx, ty);
            ctx.fillText(dn.value, tx, ty);
            ctx.globalAlpha = 1;
        }
    }
}
