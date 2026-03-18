import { Entity } from '../core/Entity.js';

export class Item extends Entity {
    constructor(x, y, config = {}) {
        const size = config.size || 12;
        super(x, y, size, size, config.spriteKey || 'item');

        this.duration = config.duration !== undefined ? config.duration : 10000;
        this.timer = this.duration;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.baseY = y;
        this.bobTime = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // Floating bob animation
        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 3 + this.bobOffset) * 3;

        // Duration countdown (if duration > 0)
        if (this.duration > 0) {
            this.timer -= dt * 1000;
            if (this.timer <= 0) {
                this.destroy(game);
            }
        }
    }

    onPickup(player, game) {
        // Override in subclasses
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Off-screen culling
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // Glow effect
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 8;

        super.render(ctx, camera);

        ctx.restore();
    }
}
