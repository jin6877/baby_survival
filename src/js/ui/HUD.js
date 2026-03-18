import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../data/Constants.js';

export default class HUD {
    constructor(game) {
        this.game = game;
    }

    render(ctx) {
        this.renderHPBar(ctx);
        this.renderEXPBar(ctx);
        this.renderStageAndTimer(ctx);
        this.renderKillCount(ctx);
        this.renderWeaponSlots(ctx);
        this.renderEquipmentSlots(ctx);
        this.renderBossHP(ctx);
    }

    renderHPBar(ctx) {
        const x = 10;
        const y = 10;
        const w = 200;
        const h = 16;
        const player = this.game.player;
        if (!player) return;

        const ratio = Math.max(0, player.hp / player.maxHp);

        // Background
        ctx.fillStyle = COLORS.hpBarBg;
        ctx.fillRect(x, y, w, h);

        // Fill
        ctx.fillStyle = COLORS.hpBar;
        ctx.fillRect(x, y, w * ratio, h);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`HP: ${Math.ceil(player.hp)}/${player.maxHp}`, x + w / 2, y + h / 2);
    }

    renderEXPBar(ctx) {
        const x = 10;
        const y = 30;
        const w = 200;
        const h = 10;
        const player = this.game.player;
        if (!player) return;

        const ratio = player.expToNext > 0 ? Math.min(1, player.exp / player.expToNext) : 0;

        // Background
        ctx.fillStyle = COLORS.expBarBg;
        ctx.fillRect(x, y, w, h);

        // Fill
        ctx.fillStyle = COLORS.expBar;
        ctx.fillRect(x, y, w * ratio, h);

        // Border
        ctx.strokeStyle = '#9e9e9e';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Level text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Lv.${player.level}`, x, y + h + 2);
    }

    renderStageAndTimer(ctx) {
        const stage = this.game.stage || 1;
        const remainingMs = this.game.remainingTime || 0;
        const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`STAGE ${stage}`, CANVAS_WIDTH / 2, 10);

        ctx.font = '14px monospace';
        ctx.fillText(timeStr, CANVAS_WIDTH / 2, 30);
    }

    renderKillCount(ctx) {
        const kills = this.game.killCount || 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(`Kills: ${kills}`, CANVAS_WIDTH - 10, 10);
    }

    renderWeaponSlots(ctx) {
        const slotSize = 48;
        const padding = 6;
        const startX = 10;
        const startY = CANVAS_HEIGHT - slotSize - 10;
        const player = this.game.player;
        const weapons = player ? player.weapons || [] : [];

        // 라벨
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('WEAPONS', startX, startY - 2);

        for (let i = 0; i < 4; i++) {
            const x = startX + i * (slotSize + padding);
            const y = startY;

            if (i < weapons.length && weapons[i]) {
                const weapon = weapons[i];

                ctx.fillStyle = 'rgba(40, 40, 80, 0.8)';
                ctx.fillRect(x, y, slotSize, slotSize);

                ctx.strokeStyle = '#4fc3f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, slotSize, slotSize);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const name = weapon.name || '?';
                ctx.fillText(name, x + slotSize / 2, y + slotSize / 2 - 8);

                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 10px monospace';
                ctx.fillText(`Lv.${weapon.level || 1}`, x + slotSize / 2, y + slotSize / 2 + 10);
            } else {
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, slotSize, slotSize);
            }
        }
    }

    renderEquipmentSlots(ctx) {
        const player = this.game.player;
        if (!player) return;

        const equipment = player.equipment || [];
        const slotSize = 32;
        const padding = 4;
        const startX = CANVAS_WIDTH - (6 * (slotSize + padding)) - 6;
        const startY = CANVAS_HEIGHT - slotSize - 10;

        // 라벨
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('EQUIPMENT', startX, startY - 2);

        for (let i = 0; i < 6; i++) {
            const x = startX + i * (slotSize + padding);
            const y = startY;

            if (i < equipment.length && equipment[i]) {
                const equip = equipment[i];

                // Filled slot
                ctx.fillStyle = equip.color || '#ffd740';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x, y, slotSize, slotSize);
                ctx.globalAlpha = 1;

                ctx.strokeStyle = equip.color || '#ffd740';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, slotSize, slotSize);

                // Icon letter
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(equip.icon || '?', x + slotSize / 2, y + slotSize / 2 - 4);

                // Level
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 9px monospace';
                ctx.fillText(`${equip.level}`, x + slotSize / 2, y + slotSize / 2 + 10);
            } else {
                // Empty slot
                ctx.strokeStyle = '#444444';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, slotSize, slotSize);
            }
        }
    }

    renderBossHP(ctx) {
        const boss = this.game.boss;
        if (!boss || !boss.alive) return;

        const barW = CANVAS_WIDTH - 100;
        const barH = 14;
        const x = 50;
        const y = 50;
        const ratio = Math.max(0, boss.hp / boss.maxHp);

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 2, y - 18, barW + 4, barH + 22);

        // Boss name
        ctx.fillStyle = '#ff5252';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(boss.name || 'BOSS', CANVAS_WIDTH / 2, y - 2);

        // Bar bg
        ctx.fillStyle = COLORS.hpBarBg;
        ctx.fillRect(x, y, barW, barH);

        // Bar fill
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(x, y, barW * ratio, barH);

        // Border
        ctx.strokeStyle = '#ff5252';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barW, barH);
    }
}
