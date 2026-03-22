// WeaponSelectUI: 게임 시작 시 & 라운드 시작 시 무기 3개 중 1개 선택
import { WeaponRegistry } from '../data/WeaponRegistry.js';

export default class WeaponSelectUI {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.choices = []; // [{ key, name, description }]
        this.onSelect = null; // callback
    }

    show(callback) {
        this.active = true;
        this.onSelect = callback;
        this.choices = this._pickRandom3();
    }

    _pickRandom3() {
        const all = WeaponRegistry.getAll();
        // Shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        return all.slice(0, 3);
    }

    selectChoice(index) {
        if (index < 0 || index >= this.choices.length) return;
        const choice = this.choices[index];
        this.active = false;
        if (this.onSelect) {
            this.onSelect(choice.key);
        }
    }

    render(ctx, W, H) {
        if (!this.active) return;

        // 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const isMobile = this.game.input.isMobile;

        // 타이틀
        ctx.save();
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('무기를 선택하세요!', centerX, 90);
        ctx.restore();

        // 서브타이틀
        ctx.fillStyle = '#b0bec5';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('이 무기로 라운드를 진행합니다', centerX, 125);

        // 카드
        const cardW = 240;
        const cardH = 180;
        const cardPadding = 20;
        const totalW = this.choices.length * cardW + (this.choices.length - 1) * cardPadding;
        const startX = centerX - totalW / 2;
        const cardY = H / 2 - cardH / 2;

        const mouseX = this.game.mouseX || -1;
        const mouseY = this.game.mouseY || -1;

        for (let i = 0; i < this.choices.length; i++) {
            const choice = this.choices[i];
            const x = startX + i * (cardW + cardPadding);
            const y = cardY;

            const hovered = mouseX >= x && mouseX <= x + cardW &&
                            mouseY >= y && mouseY <= y + cardH;

            // 카드 배경
            ctx.fillStyle = hovered ? 'rgba(40, 60, 100, 0.95)' : 'rgba(20, 30, 50, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);
            ctx.strokeStyle = hovered ? '#4fc3f7' : '#3949ab';
            ctx.lineWidth = hovered ? 3 : 2;
            ctx.strokeRect(x, y, cardW, cardH);

            // 상단 하이라이트
            if (hovered) {
                ctx.fillStyle = '#4fc3f7';
                ctx.fillRect(x, y, cardW, 3);
            }

            // 번호
            ctx.fillStyle = '#9e9e9e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`[${i + 1}]`, x + 10, y + 10);

            // 무기 이름
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(choice.name || '???', x + cardW / 2, y + 55);

            // 설명
            ctx.fillStyle = '#b0bec5';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            this._drawWrappedText(ctx, choice.description || '', x + cardW / 2, y + 95, cardW - 24, 18);
        }

        // 안내
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        const instructText = isMobile ? '카드를 터치하여 선택' : '1, 2, 3 키 또는 클릭으로 선택';
        ctx.fillText(instructText, centerX, cardY + cardH + 40);
    }

    _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const chars = text.split('');
        let line = '';
        let currentY = y;
        for (let i = 0; i < chars.length; i++) {
            const testLine = line + chars[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line.length > 0) {
                ctx.fillText(line, x, currentY);
                line = chars[i];
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        if (line) ctx.fillText(line, x, currentY);
    }

    handleInput(code) {
        if (code === 'Digit1') return 0;
        if (code === 'Digit2') return 1;
        if (code === 'Digit3') return 2;
        return -1;
    }
}
