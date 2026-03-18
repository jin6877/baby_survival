import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/Constants.js';

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

    render(ctx) {
        if (!this.active) return;

        this.blinkTimer += 0.02;

        // Dark red tinted overlay
        ctx.fillStyle = 'rgba(40, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;

        // GAME OVER title
        ctx.save();
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ff5252';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', centerX, centerY - 100);
        ctx.restore();

        // Stats
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

        ctx.fillText(`\uB3C4\uB2EC \uC2A4\uD14C\uC774\uC9C0: ${stage}`, centerX, y);
        y += lineH;
        ctx.fillText(`\uCC98\uCE58 \uC218: ${kills}`, centerX, y);
        y += lineH;
        ctx.fillText(`\uD50C\uB808\uC774 \uC2DC\uAC04: ${timeStr}`, centerX, y);
        y += lineH;
        ctx.fillText(`\uCD5C\uACE0 \uB808\uBCA8: ${playerLevel}`, centerX, y);

        // Blinking retry text
        const alpha = (Math.sin(this.blinkTimer * 3) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + alpha * 0.7})`;
        ctx.font = 'bold 18px monospace';
        ctx.fillText('Press ENTER to Retry', centerX, centerY + 100);
    }

    handleInput(input) {
        if (!this.active) return false;

        if (input === 'Enter') {
            return true;
        }
        return false;
    }
}
