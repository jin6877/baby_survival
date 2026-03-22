import { Item } from './Item.js';

export class ExpGem extends Item {
    constructor(x, y, large = false) {
        super(x, y, {
            spriteKey: large ? 'expGemLarge' : 'expGemSmall',
            size: large ? 44 : 32,
            duration: 0, // 영구 존재
        });

        this.expValue = large ? 3 : 1;
        this.large = large;
        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        const player = game.player;
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distSq = dx * dx + dy * dy; // sqrt 생략으로 성능 향상

        // 전체획득 자석 효과
        if (this._magnetPull && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const speed = 600 * dt;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
            this.baseY += (dy / dist) * speed;
            return;
        }

        // 화면에서 멀면 update 스킵 (bob 애니메이션도 불필요)
        if (distSq > 800 * 800) return;

        // bob 애니메이션
        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 3 + this.bobOffset) * 3;

        // 끌어당김 범위
        const pullRadius = player.expPickupRadius || 80;

        if (distSq < pullRadius * pullRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const magnetPower = player.magnetLevel || 0;
            const baseAccel = 150;
            const accel = baseAccel + magnetPower * 100;
            this.pullSpeed += accel * dt;
            const maxSpeed = 200 + magnetPower * 150;
            const speed = Math.min(this.pullSpeed, maxSpeed) * dt;

            const dirX = dx / dist;
            const dirY = dy / dist;

            this.x += dirX * speed;
            this.y += dirY * speed;
            this.baseY += dirY * speed;
        } else {
            this.pullSpeed = 0;
        }
    }

    onPickup(player, game) {
        player.addExp(this.expValue);
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width - 10 || screenX > camera.width + this.width + 10 ||
            screenY < -this.height - 10 || screenY > camera.height + this.height + 10) {
            return;
        }

        // 끌려가는 중이면 간단한 글로우만
        if (this.pullSpeed > 10) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = this.large ? '#e040fb' : '#7c4dff';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width / 2 + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 기본 렌더링
        super.render(ctx, camera);
    }
}
