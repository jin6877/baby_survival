import { Boss } from './Boss.js';

export class DarkKnight extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 600,
            speed: 1.5,
            damage: 20,
            size: 44,
            spriteKey: 'darkKnight',
            exp: 40,
            bossName: 'Dark Knight',
            phases: []
        });

        this.chargeTimer = 0;
        this.chargeInterval = 4;
        this.isCharging = false;
        this.chargeDuration = 0.5;
        this.chargeSpeed = 8;
        this.chargeElapsed = 0;
        this.chargeDirX = 0;
        this.chargeDirY = 0;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        if (this.isCharging) {
            // Dash in charge direction
            this.chargeElapsed += dt;
            this.x += this.chargeDirX * this.chargeSpeed * 60 * dt;
            this.y += this.chargeDirY * this.chargeSpeed * 60 * dt;

            if (this.chargeElapsed >= this.chargeDuration) {
                this.isCharging = false;
                this.chargeElapsed = 0;
            }
            return;
        }

        // Normal chase
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }

        // Charge timer
        this.chargeTimer += dt;
        if (this.chargeTimer >= this.chargeInterval) {
            this.chargeTimer = 0;
            this.startCharge(game);
        }
    }

    startCharge(game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.chargeDirX = dx / dist;
            this.chargeDirY = dy / dist;
        }

        this.isCharging = true;
        this.chargeElapsed = 0;
    }
}
