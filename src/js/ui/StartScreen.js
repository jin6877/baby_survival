import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/Constants.js';

export default class StartScreen {
    constructor(game) {
        this.game = game;
        this.active = true;
        this.blinkTimer = 0;
    }

    render(ctx) {
        if (!this.active) return;

        this.blinkTimer += 0.02;

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;

        // Title glow
        ctx.save();
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BULLET HEAVEN', centerX, centerY - 80);
        ctx.restore();

        // Subtitle
        ctx.fillStyle = '#b0bec5';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uBCA0\uD504\uC774\uC5B4 \uC11C\uBC14\uC774\uBC8C', centerX, centerY - 40);

        // Blinking start text
        const alpha = (Math.sin(this.blinkTimer * 3) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + alpha * 0.7})`;
        ctx.font = 'bold 18px monospace';
        ctx.fillText('Press ENTER or SPACE to Start', centerX, centerY + 30);

        // Controls info
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.fillText('WASD / \uBC29\uD5A5\uD0A4: \uC774\uB3D9', centerX, centerY + 80);
        ctx.fillText('\uACF5\uACA9: \uC790\uB3D9', centerX, centerY + 100);
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
