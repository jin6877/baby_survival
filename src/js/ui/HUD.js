import { COLORS } from '../data/Constants.js';

export default class HUD {
    constructor(game) {
        this.game = game;
    }

    render(ctx, W, H) {
        this.renderHPBar(ctx);
        this.renderGrowthBar(ctx);
        this.renderEXPBar(ctx);
        this.renderStageAndTimer(ctx, W);
        this.renderKillCount(ctx, W);
        this.renderWeaponSlots(ctx, H);
        this.renderEquipmentSlots(ctx, W, H);
        this.renderBossHP(ctx, W);
    }

    renderHPBar(ctx) {
        const x = 10;
        const y = 10;
        const w = 240;
        const h = 22;
        const player = this.game.player;
        if (!player) return;

        const ratio = Math.max(0, player.hp / player.maxHp);

        ctx.fillStyle = COLORS.hpBarBg;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = COLORS.hpBar;
        ctx.fillRect(x, y, w * ratio, h);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`HP: ${Math.ceil(player.hp)}/${player.maxHp}`, x + w / 2, y + h / 2);
    }

    renderGrowthBar(ctx) {
        const x = 10;
        const y = 34;
        const w = 240;
        const h = 16;
        const player = this.game.player;
        if (!player) return;

        const ratio = player.getGrowthProgress();
        const stageName = player.getGrowthStageName();

        ctx.fillStyle = '#2a1a1a';
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = '#ff9800';
        ctx.fillRect(x, y, w * ratio, h);

        ctx.strokeStyle = '#ff6d00';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${stageName} (Lv.${player.growthLevel})`, x + w / 2, y + h / 2);
    }

    renderEXPBar(ctx) {
        const x = 10;
        const y = 52;
        const w = 240;
        const h = 14;
        const player = this.game.player;
        if (!player) return;

        const ratio = player.expToNext > 0 ? Math.min(1, player.exp / player.expToNext) : 0;

        ctx.fillStyle = COLORS.expBarBg;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = COLORS.expBar;
        ctx.fillRect(x, y, w * ratio, h);
        ctx.strokeStyle = '#9e9e9e';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`EXP Lv.${player.level}`, x, y + h + 3);
    }

    renderStageAndTimer(ctx, W) {
        const stage = this.game.stage || 1;
        const remainingMs = this.game.remainingTime || 0;
        const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`STAGE ${stage}`, W / 2, 10);
        ctx.font = 'bold 16px monospace';
        ctx.fillText(timeStr, W / 2, 34);
    }

    renderKillCount(ctx, W) {
        const kills = this.game.killCount || 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(`Kills: ${kills}`, W - 10, 10);
    }

    renderWeaponSlots(ctx, H) {
        const slotSize = 56;
        const padding = 6;
        const startX = 10;
        const startY = H - slotSize - 10;
        const player = this.game.player;
        const weapons = player ? player.weapons || [] : [];

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 11px monospace';
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
                ctx.font = 'bold 12px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weapon.name || '?', x + slotSize / 2, y + slotSize / 2 - 8);
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 12px monospace';
                ctx.fillText(`Lv.${weapon.level || 1}`, x + slotSize / 2, y + slotSize / 2 + 12);
            } else {
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, slotSize, slotSize);
            }
        }
    }

    renderEquipmentSlots(ctx, W, H) {
        const player = this.game.player;
        if (!player) return;

        const equipment = player.equipment || [];
        const slotSize = 42;
        const padding = 5;
        const startX = W - (6 * (slotSize + padding)) - 6;
        const startY = H - slotSize - 10;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('EQUIPMENT', startX, startY - 2);

        for (let i = 0; i < 6; i++) {
            const x = startX + i * (slotSize + padding);
            const y = startY;

            if (i < equipment.length && equipment[i]) {
                const equip = equipment[i];
                ctx.fillStyle = equip.color || '#ffd740';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x, y, slotSize, slotSize);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = equip.color || '#ffd740';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, slotSize, slotSize);
                // 이미지가 로드되었으면 이미지 렌더링, 아니면 아이콘 텍스트
                if (equip.image && equip.image.complete && equip.image.naturalWidth > 0) {
                    const imgPad = 4;
                    ctx.drawImage(equip.image, x + imgPad, y + imgPad, slotSize - imgPad * 2, slotSize - imgPad * 2 - 8);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 18px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(equip.icon || '?', x + slotSize / 2, y + slotSize / 2 - 4);
                }
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`${equip.level}`, x + slotSize / 2, y + slotSize / 2 + 14);
            } else {
                ctx.strokeStyle = '#444444';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, slotSize, slotSize);
            }
        }
    }

    renderBossHP(ctx, W) {
        const boss = this.game.boss;
        if (!boss || !boss.alive) return;

        const barW = W - 100;
        const barH = 18;
        const x = 50;
        const y = 80;
        const ratio = Math.max(0, boss.hp / boss.maxHp);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 2, y - 22, barW + 4, barH + 26);
        ctx.fillStyle = '#ff5252';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(boss.bossName || 'BOSS', W / 2, y - 4);
        ctx.fillStyle = COLORS.hpBarBg;
        ctx.fillRect(x, y, barW, barH);
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(x, y, barW * ratio, barH);
        ctx.strokeStyle = '#ff5252';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barW, barH);
    }
}
