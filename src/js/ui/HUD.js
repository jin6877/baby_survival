import { COLORS } from '../data/Constants.js';

export default class HUD {
    constructor(game) {
        this.game = game;
        this.tooltip = null;
        this._weaponSlotRects = [];
        this._equipSlotRects = [];
    }

    handleClick(mx, my) {
        // 메인 버튼 클릭
        const mb = this._menuBtnRect;
        if (mb && mx >= mb.x && mx <= mb.x + mb.w && my >= mb.y && my <= mb.y + mb.h) {
            if (confirm('메인으로 돌아가시겠습니까?\n진행 중인 스테이지는 저장되지 않습니다.')) {
                window.location.href = '/';
            }
            return true;
        }

        if (this.tooltip) {
            this.tooltip = null;
            this.game.paused = false;
            return true;
        }

        // 무기 슬롯 클릭
        for (let i = 0; i < this._weaponSlotRects.length; i++) {
            const r = this._weaponSlotRects[i];
            if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                const player = this.game.player;
                const weapon = player && player.weapons[i];
                if (weapon) {
                    this.tooltip = {
                        type: 'weapon', index: i,
                        name: weapon.name, description: weapon.description,
                        level: weapon.level, maxLevel: weapon.maxLevel,
                        damage: weapon.damage, cooldown: weapon.cooldown,
                    };
                    this.game.paused = true;
                    return true;
                }
            }
        }
        // 장비 슬롯 클릭
        for (let i = 0; i < this._equipSlotRects.length; i++) {
            const r = this._equipSlotRects[i];
            if (r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                const player = this.game.player;
                const equip = player && player.equipment[i];
                if (equip) {
                    this.tooltip = {
                        type: 'equip', index: i,
                        name: equip.name, description: equip.description,
                        level: equip.level, maxLevel: equip.maxLevel,
                        icon: equip.icon, color: equip.color,
                    };
                    this.game.paused = true;
                    return true;
                }
            }
        }
        return false;
    }

    render(ctx, W, H) {
        this.renderHPBar(ctx);
        this.renderGrowthBar(ctx);
        this.renderEXPBar(ctx);
        this.renderDropStats(ctx);
        this.renderStageAndTimer(ctx, W);
        this.renderKillCount(ctx, W);
        this.renderWeaponSlots(ctx, H);
        this.renderEquipmentSlots(ctx, W, H);
        this.renderBossHP(ctx, W);
        this.renderMenuButton(ctx, W);
        this.renderItemDetail(ctx, W, H);
    }

    renderMenuButton(ctx, W) {
        const bw = 60, bh = 26;
        const bx = W - bw - 8, by = 8;
        this._menuBtnRect = { x: bx, y: by, w: bw, h: bh };

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = '#ccc';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('메인', bx + bw / 2, by + bh / 2);
    }

    renderHPBar(ctx) {
        const x = 10, y = 10, w = 380, h = 34;
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
        ctx.font = 'bold 17px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`HP: ${Math.ceil(player.hp)}/${Math.ceil(player.maxHp)}`, x + w / 2, y + h / 2);
    }

    renderGrowthBar(ctx) {
        const x = 10, y = 48, w = 380, h = 26;
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
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const babyName = this.game.babyName || '아기';
        ctx.fillText(`${babyName} - ${stageName} (Lv.${player.growthLevel})`, x + w / 2, y + h / 2);
    }

    renderEXPBar(ctx) {
        const x = 10, y = 78, w = 380, h = 22;
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
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`EXP Lv.${player.level}`, x, y + h + 3);
    }

    // HP바 아래: 스탯 표시 (바닥 드롭 숫자 + 장비 보너스 (+X))
    _fmtVal(v) {
        if (v === 0) return '0';
        return Number.isInteger(v) ? '' + v : v.toFixed(1);
    }

    _drawStatSection(ctx, panelX, startY, panelW, title, titleColor, stats) {
        if (stats.length === 0) return startY;

        const rowH = 18;
        const headerH = 20;
        const panelH = stats.length * rowH + headerH + 4;
        const endX = panelX + panelW - 8;

        // 반투명 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(panelX, startY, panelW, panelH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, startY, panelW, panelH);

        // 섹션 제목
        ctx.fillStyle = titleColor;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, panelX + 8, startY + headerH / 2);

        for (let i = 0; i < stats.length; i++) {
            const s = stats[i];
            const y = startY + headerH + i * rowH + rowH / 2;

            // 색상 점
            ctx.fillStyle = s.color;
            ctx.fillRect(panelX + 6, y - 3, 4, 6);

            // 이름
            ctx.fillStyle = '#ccc';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(s.label, panelX + 16, y);

            // 오른쪽: 기본 (+증가) (x아이템%)
            ctx.textAlign = 'right';
            let cx = endX;

            // 아이템% (연두)
            if (s.equipPct > 0) {
                const t = `(x${Math.round(s.equipPct * 100)}%)`;
                ctx.fillStyle = '#69f0ae';
                ctx.font = 'bold 10px monospace';
                ctx.fillText(t, cx, y);
                cx -= ctx.measureText(t).width + 2;
            }

            // 증가 (노랑)
            if (s.grow > 0) {
                const t = `(+${this._fmtVal(s.grow)})`;
                ctx.fillStyle = '#ffd740';
                ctx.font = 'bold 10px monospace';
                ctx.fillText(t, cx, y);
                cx -= ctx.measureText(t).width + 2;
            }

            // 기본 (흰색)
            const t = `${this._fmtVal(s.base)}`;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(t, cx, y);
        }

        return startY + panelH + 4;
    }

    renderDropStats(ctx) {
        const player = this.game.player;
        if (!player || !player.dropStats) return;

        const bs = player.baseStats || { hp: 80, attack: 5, speed: 1.5, defense: 0 };
        const ds = player.dropStats;
        const ss = player.stageStats || { speed: 0, attackSpeed: 0, defense: 0 };
        const bf = player.buffStacks || {};

        const panelX = 10;
        const panelW = 260;
        let curY = 118;

        // === 영구 스탯 (공격력, 체력) ===
        const permStats = [
            { label: '공격력', base: bs.attack, grow: ds.attack + (bf.attack || 0), equipPct: player.attackPowerPct || 0, color: '#ff5252' },
            { label: '체력', base: bs.hp, grow: ds.maxHp + (bf.maxHp || 0) * 5, equipPct: 0, color: '#ef5350' },
        ];
        curY = this._drawStatSection(ctx, panelX, curY, panelW, '[ 영구 스탯 ]', '#ffd740', permStats);

        // === 스테이지 스탯 (초기화됨) ===
        const stageAll = [
            { label: '이동속도', base: bs.speed, grow: ss.speed + (bf.speed || 0) * 0.02, equipPct: player.speedMultiplier - 1 - ss.speed - (bf.speed || 0) * 0.02 > 0.001 ? player.speedMultiplier - 1 - ss.speed - (bf.speed || 0) * 0.02 : 0, color: '#69f0ae' },
            { label: '공격속도', base: 1, grow: ss.attackSpeed + (bf.attackSpeed || 0) * 0.02, equipPct: player.attackSpeedMultiplier - 1 - ss.attackSpeed - (bf.attackSpeed || 0) * 0.02 > 0.001 ? player.attackSpeedMultiplier - 1 - ss.attackSpeed - (bf.attackSpeed || 0) * 0.02 : 0, color: '#ffab40' },
            { label: '방어력', base: bs.defense, grow: ss.defense + (bf.damageReduction || 0), equipPct: player.damageReductionPct || 0, color: '#78909c' },
            { label: '투사체', base: 1, grow: (bf.projSize || 0) * 0.03, equipPct: player.projectileSizeMultiplier - 1 - (bf.projSize || 0) * 0.03 > 0.001 ? player.projectileSizeMultiplier - 1 - (bf.projSize || 0) * 0.03 : 0, color: '#7c4dff' },
            { label: '재생', base: 0, grow: (bf.hpRegen || 0) * 0.3, equipPct: 0, color: '#e91e63' },
        ];
        const stageStats = stageAll.filter(s => s.base > 0 || s.grow > 0.001 || s.equipPct > 0.001);
        curY = this._drawStatSection(ctx, panelX, curY, panelW, '[ 스테이지 스탯 ]', '#80cbc4', stageStats);
    }

    // 장비에서 제공하는 보너스 합산 (모두 퍼센트)
    getEquipmentBonuses(player) {
        // 이제 장비 보너스는 player 속성에 직접 반영되므로 별도 합산 불필요
        return {};
    }

    renderStageAndTimer(ctx, W) {
        const stage = this.game.stage || 1;
        const remainingMs = this.game.remainingTime || 0;
        const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`STAGE ${stage}`, W / 2, 10);
        ctx.font = 'bold 20px monospace';
        ctx.fillText(timeStr, W / 2, 38);
    }

    renderKillCount(ctx, W) {
        const kills = this.game.killCount || 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(`Kills: ${kills}`, W - 10, 10);
    }

    renderWeaponSlots(ctx, H) {
        const slotSize = 80;
        const padding = 10;
        const startX = 10;
        const startY = H - slotSize - 10;
        const player = this.game.player;
        const weapons = player ? player.weapons || [] : [];

        this._weaponSlotRects = [];

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('WEAPONS', startX, startY - 4);

        for (let i = 0; i < 4; i++) {
            const x = startX + i * (slotSize + padding);
            const y = startY;
            this._weaponSlotRects[i] = { x, y, w: slotSize, h: slotSize };

            const isSelected = this.tooltip && this.tooltip.type === 'weapon' && this.tooltip.index === i;

            if (i < weapons.length && weapons[i]) {
                const weapon = weapons[i];
                ctx.fillStyle = 'rgba(40, 40, 80, 0.85)';
                ctx.fillRect(x, y, slotSize, slotSize);
                ctx.strokeStyle = isSelected ? '#ffff00' : '#4fc3f7';
                ctx.lineWidth = isSelected ? 3 : 2;
                ctx.strokeRect(x, y, slotSize, slotSize);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weapon.name || '?', x + slotSize / 2, y + slotSize / 2 - 10);
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(`Lv.${weapon.level || 1}`, x + slotSize / 2, y + slotSize / 2 + 14);
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
        const slotSize = 66;
        const padding = 8;
        const startX = W - (6 * (slotSize + padding)) - 6;
        const startY = H - slotSize - 10;

        this._equipSlotRects = [];

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('ITEMS', startX, startY - 4);

        for (let i = 0; i < 6; i++) {
            const x = startX + i * (slotSize + padding);
            const y = startY;
            this._equipSlotRects[i] = { x, y, w: slotSize, h: slotSize };

            const isSelected = this.tooltip && this.tooltip.type === 'equip' && this.tooltip.index === i;

            if (i < equipment.length && equipment[i]) {
                const equip = equipment[i];
                ctx.fillStyle = equip.color || '#ffd740';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x, y, slotSize, slotSize);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = isSelected ? '#ffff00' : (equip.color || '#ffd740');
                ctx.lineWidth = isSelected ? 3 : 2;
                ctx.strokeRect(x, y, slotSize, slotSize);
                if (equip.image && equip.image.complete && equip.image.naturalWidth > 0) {
                    const imgPad = 4;
                    ctx.drawImage(equip.image, x + imgPad, y + imgPad, slotSize - imgPad * 2, slotSize - imgPad * 2 - 8);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 22px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(equip.icon || '?', x + slotSize / 2, y + slotSize / 2 - 4);
                }
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 13px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`Lv.${equip.level}`, x + slotSize / 2, y + slotSize / 2 + 18);
            } else {
                ctx.strokeStyle = '#444444';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, slotSize, slotSize);
            }
        }
    }

    renderItemDetail(ctx, W, H) {
        if (!this.tooltip) return;
        const tp = this.tooltip;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, W, H);

        const panelW = 320, panelH = 200;
        const px = W / 2 - panelW / 2;
        const py = H / 2 - panelH / 2;

        ctx.fillStyle = 'rgba(15, 15, 35, 0.95)';
        ctx.fillRect(px, py, panelW, panelH);
        const borderColor = tp.type === 'weapon' ? '#4fc3f7' : (tp.color || '#ffd740');
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(px, py, panelW, panelH);
        ctx.fillStyle = borderColor;
        ctx.fillRect(px, py, panelW, 4);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(tp.type === 'weapon' ? 'WEAPON' : 'ITEM', px + 14, py + 14);

        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(tp.name, px + 14, py + 30);

        const lvBarX = px + 14, lvBarY = py + 58;
        const lvBarW = panelW - 28, lvBarH = 12;
        const maxLv = tp.maxLevel || 5;
        ctx.fillStyle = '#333';
        ctx.fillRect(lvBarX, lvBarY, lvBarW, lvBarH);
        ctx.fillStyle = borderColor;
        ctx.fillRect(lvBarX, lvBarY, lvBarW * (tp.level / maxLv), lvBarH);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(lvBarX, lvBarY, lvBarW, lvBarH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Lv.${tp.level} / ${maxLv}`, lvBarX + lvBarW / 2, lvBarY + lvBarH / 2);

        ctx.fillStyle = '#dddddd';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const desc = tp.description || '';
        const words = desc.split('');
        let line = '';
        let lineY = py + 82;
        const maxLineW = panelW - 28;
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineW && line.length > 0) {
                ctx.fillText(line, px + 14, lineY);
                line = words[i];
                lineY += 20;
                if (lineY > py + panelH - 50) break;
            } else {
                line = testLine;
            }
        }
        if (line) ctx.fillText(line, px + 14, lineY);

        if (tp.type === 'weapon') {
            const infoY = py + panelH - 44;
            ctx.fillStyle = '#ff8a80';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`공격력: ${tp.damage}`, px + 14, infoY);
            ctx.fillStyle = '#80d8ff';
            ctx.fillText(`쿨다운: ${(tp.cooldown / 1000).toFixed(1)}초`, px + 160, infoY);
        }

        if (tp.type === 'equip' && tp.icon) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '28px monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText(tp.icon, px + panelW - 14, py + 24);
        }

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('아무 곳이나 클릭하면 닫힙니다', W / 2, py + panelH - 8);
    }

    renderBossHP(ctx, W) {
        const boss = this.game.boss;
        if (!boss || !boss.alive) return;
        const barW = W - 100, barH = 18, x = 50, y = 80;
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
