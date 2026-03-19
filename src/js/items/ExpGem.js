import { Item } from './Item.js';
import { EXP_PICKUP_RADIUS, MAGNET_PICKUP_RADIUS } from '../data/Constants.js';

export class ExpGem extends Item {
    constructor(x, y, large = false) {
        super(x, y, {
            spriteKey: large ? 'expGemLarge' : 'expGemSmall',
            size: large ? 44 : 32,
            duration: 0, // Stays forever
        });

        this.expValue = large ? 8 : 2;
        this.large = large;
        this.pullSpeed = 0;
    }

    update(dt, game) {
        if (!this.alive) return;

        // Floating bob animation
        this.bobTime += dt;
        this.y = this.baseY + Math.sin(this.bobTime * 3 + this.bobOffset) * 3;

        const player = game.player;
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check magnet active (larger radius pull)
        const magnetActive = game.magnetActive || false;
        const pullRadius = magnetActive ? MAGNET_PICKUP_RADIUS : EXP_PICKUP_RADIUS;

        if (dist < pullRadius && dist > 0) {
            // Accelerate toward player
            this.pullSpeed += 600 * dt;
            const speed = Math.min(this.pullSpeed, 800) * dt;

            const dirX = dx / dist;
            const dirY = dy / dist;

            this.x += dirX * speed;
            this.y += dirY * speed;
            this.baseY += dirY * speed;
        } else {
            this.pullSpeed = 0;
        }
    }

    onPickup(player, game) {
        player.addExp(this.expValue);
    }
}
