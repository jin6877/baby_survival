export default class GameOverScreen {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.blinkTimer = 0;
    }

    show() {
        this.active = true;
        this.blinkTimer = 0;
    }

    render(ctx, W, H) {
        if (!this.active) return;

        this.blinkTimer += 0.02;

        ctx.fillStyle = 'rgba(40, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const centerY = H / 2;

        ctx.save();
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ff5252';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', centerX, centerY - 100);
        ctx.restore();

        const stage = this.game.stage || 1;
        const kills = this.game.killCount || 0;
        const elapsedMs = this.game.elapsedTime || 0;
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const playerLevel = this.game.player ? this.game.player.level : 1;

        ctx.fillStyle = '#e0e0e0';
        ctx.font = '16px monospace';
        const lineH = 28;
        let y = centerY - 30;

        ctx.fillText(`도달 스테이지: ${stage}`, centerX, y); y += lineH;
        ctx.fillText(`처치 수: ${kills}`, centerX, y); y += lineH;
        ctx.fillText(`플레이 시간: ${timeStr}`, centerX, y); y += lineH;
        ctx.fillText(`최고 레벨: ${playerLevel}`, centerX, y);

        const alpha = (Math.sin(this.blinkTimer * 3) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + alpha * 0.7})`;
        ctx.font = 'bold 20px monospace';
        const isMobile = this.game.input.isMobile;
        const retryText = isMobile ? '화면을 터치하여 재시작' : 'Press ENTER to Retry';
        ctx.fillText(retryText, centerX, centerY + 100);
    }

    handleInput(input) {
        if (!this.active) return false;
        if (input === 'Enter') return true;
        return false;
    }
}
