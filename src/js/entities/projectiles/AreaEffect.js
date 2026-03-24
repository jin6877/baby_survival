// AreaEffect: 범위 효과 (원형 데미지 존) - 이미지 기반
import { Entity } from '../../core/Entity.js';
import { assets } from '../../core/AssetManager.js';

export class AreaEffect extends Entity {
    constructor(x, y, config = {}) {
        const radius = config.radius || 60;
        super(x, y, radius * 2, radius * 2, null);

        this.radius = radius;
        this.damage = config.damage || 5;
        this.duration = config.duration || 2000;
        this.tickInterval = config.tickInterval || 300;
        this.color = config.color || '#42a5f5';
        this.owner = config.owner || null;
        this.followOwner = config.followOwner || false;
        this.spriteKey = config.spriteKey || null;

        this.isEnemyArea = config.isEnemyArea || false; // true면 플레이어에게 데미지

        this.elapsed = 0;
        this.tickTimer = 0;
        this.pulsePhase = 0;
        this.rotation = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // 소유자 따라가기
        if (this.followOwner && this.owner && this.owner.alive) {
            this.x = this.owner.x;
            this.y = this.owner.y;
        }

        this.elapsed += dt * 1000;
        this.tickTimer += dt * 1000;
        this.pulsePhase += dt * 5;
        this.rotation += dt * 1.5;

        // 틱 데미지
        if (this.tickTimer >= this.tickInterval) {
            this.tickTimer -= this.tickInterval;
            this.dealDamage(game);
        }

        // 지속 시간 만료
        if (this.elapsed >= this.duration) {
            this.destroy(game);
        }
    }

    dealDamage(game) {
        if (this.isEnemyArea) {
            // 적이 만든 영역: 플레이어에게 데미지
            if (!game.player || !game.player.alive || game.player.invincibleTimer > 0) return;
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.radius) {
                game.player.takeDamage(this.damage);
            }
            return;
        }

        if (!game.enemies) return;

        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.radius) {
                enemy.takeDamage(this.damage, game);
            }
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // 화면 밖이면 스킵
        if (screenX < -this.radius - 50 || screenX > camera.width + this.radius + 50 ||
            screenY < -this.radius - 50 || screenY > camera.height + this.radius + 50) {
            return;
        }

        const pulse = 0.35;
        const fadeRatio = 1 - (this.elapsed / this.duration);

        ctx.save();

        if (this.spriteKey && assets.hasSprite(this.spriteKey)) {
            // 이미지 기반 렌더링
            ctx.globalAlpha = pulse * fadeRatio;
            const imgSize = this.radius * 2.4;
            assets.drawSprite(ctx, this.spriteKey, screenX, screenY, imgSize, imgSize, this.rotation);

            // 반투명 원형 범위 표시
            ctx.globalAlpha = 0.15 * fadeRatio;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // 폴백: 코드 기반 렌더링 (크기 강화)
            ctx.globalAlpha = pulse * fadeRatio;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // 테두리
            ctx.globalAlpha = 0.4 * fadeRatio;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.stroke();

            // 내부 펄스 링
            ctx.globalAlpha = 0.25 * fadeRatio;
            const innerRadius = this.radius * 0.4;
            ctx.beginPath();
            ctx.arc(screenX, screenY, innerRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}
