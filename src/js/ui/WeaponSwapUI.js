import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/Constants.js';
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
        // 확실하게 일시정지
        this.game.paused = true;
    }

    dismiss() {
        this.active = false;
        this.newWeaponKey = null;
    }

    render(ctx) {
        if (!this.active) return;

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uBB34\uAE30 \uAD50\uCCB4', centerX, 80);

        // Subtitle
        ctx.fillStyle = '#ff9800';
        ctx.font = '14px monospace';
        ctx.fillText('\uAD50\uCCB4\uD560 \uBB34\uAE30 \uC2AC\uB86F\uC744 \uC120\uD0DD\uD558\uC138\uC694', centerX, 110);

        // Current weapons
        const player = this.game.player;
        const weapons = player ? player.weapons || [] : [];
        const cardW = 140;
        const cardH = 90;
        const cardPadding = 15;
        const totalW = 4 * cardW + 3 * cardPadding;
        const startX = centerX - totalW / 2;
        const cardY = 160;

        ctx.fillStyle = '#b0bec5';
        ctx.font = '14px monospace';
        ctx.fillText('\uD604\uC7AC \uBB34\uAE30', centerX, cardY - 20);

        for (let i = 0; i < 4; i++) {
            const x = startX + i * (cardW + cardPadding);
            const y = cardY;

            // Hover detection
            const isHovered = this.game.mouseX >= x && this.game.mouseX <= x + cardW &&
                              this.game.mouseY >= y && this.game.mouseY <= y + cardH;

            // Card background
            ctx.fillStyle = isHovered ? 'rgba(60, 30, 30, 0.95)' : 'rgba(30, 30, 60, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);

            // Border
            ctx.strokeStyle = isHovered ? '#ff5252' : '#7c4dff';
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.strokeRect(x, y, cardW, cardH);

            // Slot number
            ctx.fillStyle = '#9e9e9e';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`[${i + 1}]`, x + 6, y + 6);

            if (i < weapons.length && weapons[i]) {
                const weapon = weapons[i];
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 13px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weapon.name || '?', x + cardW / 2, y + 35);

                ctx.fillStyle = '#ffff00';
                ctx.font = '11px monospace';
                ctx.fillText(`Lv.${weapon.level || 1}`, x + cardW / 2, y + 55);

                if (isHovered) {
                    ctx.fillStyle = '#ff5252';
                    ctx.font = '10px monospace';
                    ctx.fillText('\u2192 \uAD50\uCCB4', x + cardW / 2, y + 75);
                }
            }
        }

        // New weapon card
        const newCardY = cardY + cardH + 40;
        ctx.fillStyle = '#b0bec5';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uC0C8 \uBB34\uAE30', centerX, newCardY - 20);

        const newX = centerX - cardW / 2;
        const newY = newCardY;

        // Highlighted new weapon card
        ctx.fillStyle = 'rgba(50, 80, 50, 0.9)';
        ctx.fillRect(newX, newY, cardW, cardH);

        ctx.strokeStyle = '#76ff03';
        ctx.lineWidth = 3;
        ctx.strokeRect(newX, newY, cardW, cardH);

        // 새 무기 이름 표시 (레지스트리에서 한글 이름 가져오기)
        const weaponData = WeaponRegistry.get(this.newWeaponKey);
        const displayName = weaponData ? weaponData.name : this.newWeaponKey;

        ctx.fillStyle = '#76ff03';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName || '???', newX + cardW / 2, newY + 35);

        if (weaponData && weaponData.description) {
            ctx.fillStyle = '#aaa';
            ctx.font = '10px monospace';
            ctx.fillText(weaponData.description.substring(0, 20), newX + cardW / 2, newY + 58);
        }

        // Instructions
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1-4: \uAD50\uCCB4  |  ESC: \uBC84\uB9AC\uAE30', centerX, CANVAS_HEIGHT - 50);
    }

    handleInput(input) {
        if (!this.active) return -1;

        let result = -1;

        if (input === 'Digit1') result = 0;
        else if (input === 'Digit2') result = 1;
        else if (input === 'Digit3') result = 2;
        else if (input === 'Digit4') result = 3;
        else return -1;

        // Close UI (Game.js에서 paused = false 처리)
        this.dismiss();
        return result;
    }
}
