import { Boss } from './Boss.js';

export class GiantSkeleton extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 300,
            speed: 0.8,
            damage: 12,
            size: 48,
            spriteKey: 'giantSkeleton',
            exp: 20,
            bossName: 'Giant Skeleton',
            phases: []
        });

        this.sweepTimer = 0;
        this.sweepInterval = 3;
        this.sweepRadius = 100;
    }

    movementPattern(dt, game) {
        // Chase player
        if (game.player && game.player.alive) {
            const dx = game.player.x - this.x;
            const dy = game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                this.x += (dx / dist) * this.speed * 60 * dt;
                this.y += (dy / dist) * this.speed * 60 * dt;
            }
        }

        // Wide sweep attack every 3 seconds
        this.sweepTimer += dt;
        if (this.sweepTimer >= this.sweepInterval) {
            this.sweepTimer = 0;
            this.sweepAttack(game);
        }
    }

    sweepAttack(game) {
        if (!game.player || !game.player.alive) return;

        const dist = this.distanceTo(game.player);
        if (dist <= this.sweepRadius) {
            if (game.player.takeDamage) {
                game.player.takeDamage(this.damage);
            }
        }

        // Also damage other entities within radius if needed
        if (game.enemies) {
            // Sweep is player-targeted, no friendly fire needed
        }
    }
}
