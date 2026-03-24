import { Item } from './Item.js';

// 5단계 경험치 젬 (보라색 다이아몬드, 투명도로 등급 구분)
const GEM_TIERS = [
    { tier: 1, exp: 1, alpha: 0.35, size: 5 },    // 가장 연함 - 흔함
    { tier: 2, exp: 1, alpha: 0.50, size: 6 },
    { tier: 3, exp: 1, alpha: 0.65, size: 7 },
    { tier: 4, exp: 2, alpha: 0.80, size: 9 },
    { tier: 5, exp: 3, alpha: 1.0, size: 11 },    // 가장 진함 - 희귀
];

// 드롭 가중치 (높을수록 자주 나옴)
const GEM_WEIGHTS = [50, 28, 14, 6, 2]; // 총 100
const WEIGHT_SUM = GEM_WEIGHTS.reduce((a, b) => a + b, 0);

export function rollGemTier() {
    let roll = Math.random() * WEIGHT_SUM;
    for (let i = 0; i < GEM_WEIGHTS.length; i++) {
        roll -= GEM_WEIGHTS[i];
        if (roll <= 0) return i;
    }
    return 0;
}

export class ExpGem extends Item {
    constructor(x, y, tierIndex = 0) {
        const tier = GEM_TIERS[tierIndex] || GEM_TIERS[0];
        super(x, y, {
            spriteKey: null,
            size: tier.size * 2 + 4,
            duration: 0, // 영구 존재
        });

        this.tierIndex = tierIndex;
        this.expValue = tier.exp;
        this.gemAlpha = tier.alpha;
        this.gemSize = tier.size;
        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

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

        // 화면에서 멀면 update 스킵
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

        // 보라색 다이아몬드 - 투명도로 등급 구분
        ctx.save();
        const size = this.gemSize;
        const baseAlpha = this.gemAlpha;
        const pulse = 0.85 + Math.sin((this.bobTime || 0) * 4) * 0.15;

        ctx.globalAlpha = baseAlpha * pulse;
        ctx.fillStyle = '#7c4dff';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size);
        ctx.lineTo(screenX + size * 0.7, screenY);
        ctx.lineTo(screenX, screenY + size);
        ctx.lineTo(screenX - size * 0.7, screenY);
        ctx.closePath();
        ctx.fill();

        // 글로우 (높은 등급일수록 선명)
        ctx.globalAlpha = 0.25 * baseAlpha * pulse;
        ctx.strokeStyle = '#b388ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}
