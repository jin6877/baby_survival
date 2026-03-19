import { WeaponRegistry } from '../data/WeaponRegistry.js';

export default class WeaponSwapUI {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.newWeaponKey = null;
    }

    show(weaponKey) {
        this.active = true;
        this.newWeaponKey = weaponKey;
        this.game.paused = true;
    }

    dismiss() {
        this.active = false;
        this.newWeaponKey = null;
    }

    render(ctx, W, H) {
        if (!this.active) return;

        const isMobile = this.game.input.isMobile;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('무기 교체', centerX, 70);

        ctx.fillStyle = '#ff9800';
        ctx.font = '14px monospace';
        ctx.fillText('교체할 무기 슬롯을 선택하세요', centerX, 100);

        const player = this.game.player;
        const weapons = player ? player.weapons || [] : [];
        const cardW = 150;
        const cardH = 100;
        const cardPadding = 12;
        const totalW = 4 * cardW + 3 * cardPadding;
        const startX = centerX - totalW / 2;
        const cardY = 140;

        ctx.fillStyle = '#b0bec5';
        ctx.font = '14px monospace';
        ctx.fillText('현재 무기', centerX, cardY - 18);

        for (let i = 0; i < 4; i++) {
            const x = startX + i * (cardW + cardPadding);
            const y = cardY;
            const isHovered = this.game.mouseX >= x && this.game.mouseX <= x + cardW &&
                              this.game.mouseY >= y && this.game.mouseY <= y + cardH;

            ctx.fillStyle = isHovered ? 'rgba(60, 30, 30, 0.95)' : 'rgba(30, 30, 60, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);
            ctx.strokeStyle = isHovered ? '#ff5252' : '#7c4dff';
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.strokeRect(x, y, cardW, cardH);

            ctx.fillStyle = '#9e9e9e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`[${i + 1}]`, x + 6, y + 6);

            if (i < weapons.length && weapons[i]) {
                const weapon = weapons[i];
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weapon.name || '?', x + cardW / 2, y + 38);
                ctx.fillStyle = '#ffff00';
                ctx.font = '12px monospace';
                ctx.fillText(`Lv.${weapon.level || 1}`, x + cardW / 2, y + 58);
                if (isHovered) {
                    ctx.fillStyle = '#ff5252';
                    ctx.font = '11px monospace';
                    ctx.fillText('→ 교체', x + cardW / 2, y + 80);
                }
            }
        }

        const newCardY = cardY + cardH + 35;
        ctx.fillStyle = '#b0bec5';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('새 무기', centerX, newCardY - 18);

        const newX = centerX - cardW / 2;
        const newY = newCardY;

        ctx.fillStyle = 'rgba(50, 80, 50, 0.9)';
        ctx.fillRect(newX, newY, cardW, cardH);
        ctx.strokeStyle = '#76ff03';
        ctx.lineWidth = 3;
        ctx.strokeRect(newX, newY, cardW, cardH);

        const weaponData = WeaponRegistry.get(this.newWeaponKey);
        const displayName = weaponData ? weaponData.name : this.newWeaponKey;

        ctx.fillStyle = '#76ff03';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName || '???', newX + cardW / 2, newY + 38);

        if (weaponData && weaponData.description) {
            ctx.fillStyle = '#aaa';
            ctx.font = '11px monospace';
            ctx.fillText(weaponData.description.substring(0, 20), newX + cardW / 2, newY + 60);
        }

        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const instructText = isMobile ? '슬롯 터치: 교체  |  빈 곳 터치: 버리기' : '1-4: 교체  |  ESC: 버리기';
        ctx.fillText(instructText, centerX, H - 40);
    }

    handleInput(input) {
        if (!this.active) return -1;
        let result = -1;
        if (input === 'Digit1') result = 0;
        else if (input === 'Digit2') result = 1;
        else if (input === 'Digit3') result = 2;
        else if (input === 'Digit4') result = 3;
        else return -1;
        this.dismiss();
        return result;
    }
}
