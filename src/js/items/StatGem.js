import { Item } from './Item.js';

// 바닥에 드롭되는 스탯 증가 아이템 (무한 중첩)
const STAT_TYPES = [
    { type: 'attack', name: '공격력', color: '#ff5252', icon: '⚔', apply(player) { player.attackMultiplier += 0.02; player.dropStats.attack += 2; } },
    { type: 'speed', name: '이속', color: '#69f0ae', icon: '👟', apply(player) { player.speedMultiplier += 0.01; player.dropStats.speed += 1; } },
    { type: 'attackSpeed', name: '공속', color: '#ffab40', icon: '⚡', apply(player) { player.attackSpeedMultiplier += 0.01; player.dropStats.attackSpeed += 1; } },
    { type: 'maxHp', name: 'HP', color: '#ef5350', icon: '❤', apply(player) { player.maxHp += 2; player.hp += 2; player.dropStats.maxHp += 2; } },
    { type: 'projSize', name: '투사체', color: '#7c4dff', icon: '🔮', apply(player) { player.projectileSizeMultiplier += 0.01; player.dropStats.projSize += 1; } },
];

export class StatGem extends Item {
    constructor(x, y) {
        super(x, y, {
            spriteKey: null,
            size: 24,
            duration: 0, // 영구 존재
        });

        // 랜덤 스탯 선택
        const stat = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
        this.statType = stat.type;
        this.statName = stat.name;
        this.statColor = stat.color;
        this.statIcon = stat.icon;
        this._applyFn = stat.apply;
        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 4 + this.bobOffset) * 2;

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

        const pullRadius = player.expPickupRadius || 50;

        if (dist < pullRadius && dist > 0) {
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
        this._applyFn(player);
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -30 || screenX > camera.width + 30 ||
            screenY < -30 || screenY > camera.height + 30) {
            return;
        }

        // 작은 다이아몬드 모양
        ctx.save();
        const size = 10;
        const pulse = 0.8 + Math.sin(this.bobTime * 5) * 0.2;

        ctx.globalAlpha = pulse;
        ctx.fillStyle = this.statColor;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size);
        ctx.lineTo(screenX + size * 0.7, screenY);
        ctx.lineTo(screenX, screenY + size);
        ctx.lineTo(screenX - size * 0.7, screenY);
        ctx.closePath();
        ctx.fill();

        // 작은 글로우
        ctx.globalAlpha = 0.3 * pulse;
        ctx.strokeStyle = this.statColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}
