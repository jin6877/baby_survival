import { Item } from './Item.js';

// 성장경험치젬: 아기 성장 단계를 올리는 전용 젬
export class GrowthGem extends Item {
    constructor(x, y) {
        super(x, y, {
            spriteKey: null,
            size: 20,
            duration: 30000, // 30초 후 소멸
        });

        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // 수명 체크
        if (this.duration > 0) {
            this.timer -= dt * 1000;
            if (this.timer <= 0) {
                this.alive = false;
                return;
            }
        }

        const player = game.player;
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distSq = dx * dx + dy * dy;

        // 전체획득 자석 효과
        if (this._magnetPull && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const speed = 600 * dt;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
            this.baseY += (dy / dist) * speed;
            return;
        }

        // 화면에서 멀면 스킵
        if (distSq > 800 * 800) return;

        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 3 + this.bobOffset) * 3;

        const pullRadius = player.expPickupRadius || 50;

        if (distSq < pullRadius * pullRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            this.pullSpeed += 200 * dt;
            const speed = Math.min(this.pullSpeed, 400) * dt;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
            this.baseY += (dy / dist) * speed;
        } else {
            this.pullSpeed = 0;
        }
    }

    onPickup(player, game) {
        player.addGrowthPoints(1);
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -30 || screenX > camera.width + 30 ||
            screenY < -30 || screenY > camera.height + 30) {
            return;
        }

        // 주황색 다이아몬드 (성장 전용)
        ctx.save();
        const size = 10;
        const pulse = 0.85 + Math.sin((this.bobTime || 0) * 4) * 0.15;

        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ff9800'; // 주황색
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size);
        ctx.lineTo(screenX + size * 0.7, screenY);
        ctx.lineTo(screenX, screenY + size);
        ctx.lineTo(screenX - size * 0.7, screenY);
        ctx.closePath();
        ctx.fill();

        // 글로우 테두리
        ctx.globalAlpha = 0.3 * pulse;
        ctx.strokeStyle = '#ffb74d';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}
