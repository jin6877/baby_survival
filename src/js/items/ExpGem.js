import { Item } from './Item.js';

export class ExpGem extends Item {
    constructor(x, y, large = false) {
        super(x, y, {
            spriteKey: large ? 'expGemLarge' : 'expGemSmall',
            size: large ? 44 : 32,
            duration: 0, // Stays forever
        });

        this.expValue = large ? 3 : 1;
        this.large = large;
        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // Floating bob animation
        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 3 + this.bobOffset) * 3;

        const player = game.player;
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 전체획득 자석 효과
        if (this._magnetPull && dist > 0) {
            const speed = 600 * dt;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
            this.baseY += (dy / dist) * speed;
            return;
        }

        // 끌어당김 범위
        const pullRadius = player.expPickupRadius || 80;
        const magnetPower = player.magnetLevel || 0;

        if (dist < pullRadius && dist > 0) {
            // 자력 레벨에 따라 점진적으로 강해짐
            // Lv0(기본): 느린 흡수, Lv1: 약간 빠름, Lv5: 매우 빠름
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

        if (screenX < -this.width - 20 || screenX > camera.width + this.width + 20 ||
            screenY < -this.height - 20 || screenY > camera.height + this.height + 20) {
            return;
        }

        // 끌려가는 중이면 트레일 이펙트
        if (this.pullSpeed > 10) {
            ctx.save();
            const trailAlpha = Math.min(0.8, this.pullSpeed / 300);
            ctx.globalAlpha = trailAlpha;
            ctx.strokeStyle = this.large ? '#e040fb' : '#7c4dff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width / 2 + 5 + Math.sin(Date.now() * 0.008) * 4, 0, Math.PI * 2);
            ctx.stroke();

            // 내부 글로우 링
            ctx.globalAlpha = trailAlpha * 0.5;
            ctx.strokeStyle = this.large ? '#f48fb1' : '#b388ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width / 2 + 2 + Math.sin(Date.now() * 0.012 + 1) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // 속도선 파티클
            const speed = Math.min(this.pullSpeed, 600);
            const lineLen = 3 + speed / 60;
            ctx.globalAlpha = trailAlpha * 0.8;
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = (Date.now() * 0.006 + i * 1.57) % (Math.PI * 2);
                const r = this.width / 2 + 3;
                const lx = screenX + Math.cos(angle) * r;
                const ly = screenY + Math.sin(angle) * r;
                ctx.beginPath();
                ctx.moveTo(lx, ly);
                ctx.lineTo(lx + Math.cos(angle) * lineLen, ly + Math.sin(angle) * lineLen);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 기본 렌더링
        super.render(ctx, camera);
    }
}
