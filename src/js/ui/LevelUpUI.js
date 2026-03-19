export default class LevelUpUI {
    constructor(game) {
        this.game = game;
    }

    render(ctx, choices, W, H) {
        if (!choices || choices.length === 0) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const isMobile = this.game.input.isMobile;

        // Title
        ctx.save();
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LEVEL UP!', centerX, 100);
        ctx.restore();

        // Choice cards
        const cardW = 220;
        const cardH = 140;
        const cardPadding = 16;
        const totalW = choices.length * cardW + (choices.length - 1) * cardPadding;
        const startX = centerX - totalW / 2;
        const cardY = H / 2 - cardH / 2;

        const mouseX = this.game.mouseX || -1;
        const mouseY = this.game.mouseY || -1;

        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const x = startX + i * (cardW + cardPadding);
            const y = cardY;

            const hovered = mouseX >= x && mouseX <= x + cardW &&
                            mouseY >= y && mouseY <= y + cardH;

            ctx.fillStyle = hovered ? 'rgba(60, 60, 120, 0.95)' : 'rgba(30, 30, 60, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);
            ctx.strokeStyle = hovered ? '#4fc3f7' : '#7c4dff';
            ctx.lineWidth = hovered ? 3 : 2;
            ctx.strokeRect(x, y, cardW, cardH);

            ctx.fillStyle = '#9e9e9e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`[${i + 1}]`, x + 8, y + 8);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(choice.name || '???', x + cardW / 2, y + 40);

            ctx.fillStyle = '#b0bec5';
            ctx.font = '12px monospace';
            this.drawWrappedText(ctx, choice.description || '', x + cardW / 2, y + 65, cardW - 20, 16);
        }

        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const instructText = isMobile ? '카드를 터치하여 선택' : 'Press 1, 2, 3 to select';
        ctx.fillText(instructText, centerX, cardY + cardH + 40);
    }

    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
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

    handleInput(input) {
        if (input === 'Digit1') return 0;
        if (input === 'Digit2') return 1;
        if (input === 'Digit3') return 2;
        return -1;
    }
}
