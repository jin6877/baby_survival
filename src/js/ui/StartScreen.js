export default class StartScreen {
    constructor(game) {
        this.game = game;
        this.active = true;
        this.blinkTimer = 0;
    }

    render(ctx, W, H) {
        if (!this.active) return;

        this.blinkTimer += 0.02;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const centerY = H / 2;

        // Title glow
        ctx.save();
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BABY SURVIVAL', centerX, centerY - 80);
        ctx.restore();

        // Subtitle
        ctx.fillStyle = '#b0bec5';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('아기 서바이벌', centerX, centerY - 40);

        // Blinking start text
        const alpha = (Math.sin(this.blinkTimer * 3) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + alpha * 0.7})`;
        ctx.font = 'bold 20px monospace';
        const isMobile = this.game.input.isMobile;
        const startText = isMobile ? '화면을 터치하여 시작' : 'Press ENTER or SPACE to Start';
        ctx.fillText(startText, centerX, centerY + 30);

        // Controls info
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        if (isMobile) {
            ctx.fillText('조이스틱: 이동', centerX, centerY + 80);
            ctx.fillText('공격: 자동', centerX, centerY + 100);
        } else {
            ctx.fillText('WASD / 방향키: 이동', centerX, centerY + 80);
            ctx.fillText('공격: 자동', centerX, centerY + 100);
        }
    }

    handleInput(input) {
        if (!this.active) return false;
        if (input === 'Space' || input === 'Enter') {
            this.active = false;
            return true;
        }
        return false;
    }
}
