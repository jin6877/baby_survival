import { Boss } from './Boss.js';
import { Zombie } from '../Zombie.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';

export class Necromancer extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 500,
            speed: 1.2,
            damage: 10,
            size: 40,
            spriteKey: 'necromancer',
            exp: 50,
            bossName: 'Necromancer',
            phases: [
                { threshold: 0.5 }
            ]
        });

        this.summonTimer = 0;
        this.shootTimer = 0;
    }

    onPhaseChange(phase) {
        if (phase === 1) {
            this.speed = this.baseSpeed * 1.5;
        }
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        // Chase player
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }

        const isPhase2 = this.currentPhase >= 1;

        // Summon zombies
        this.summonTimer += dt;
        const summonInterval = isPhase2 ? 4 : 5;
        const summonCount = isPhase2 ? 5 : 3;

        if (this.summonTimer >= summonInterval) {
            this.summonTimer = 0;
            this.summonZombies(game, summonCount);
        }

        // Shoot bullets
        this.shootTimer += dt;
        const shootInterval = isPhase2 ? 2 : 3;
        const bulletCount = isPhase2 ? 5 : 3;

        if (this.shootTimer >= shootInterval) {
            this.shootTimer = 0;
            this.shootSpread(game, bulletCount);
        }
    }

    summonZombies(game, count) {
        if (!game.enemies) return;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const spawnDist = 60;
            const zombie = new Zombie(
                this.x + Math.cos(angle) * spawnDist,
                this.y + Math.sin(angle) * spawnDist
            );
            game.enemies.push(zombie);
        }
    }

    shootSpread(game, bulletCount) {
        if (!game.player || !game.player.alive || !game.projectiles) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const spreadAngle = Math.PI / 6; // 30 degrees total spread

        for (let i = 0; i < bulletCount; i++) {
            const offset = (i - (bulletCount - 1) / 2) * (spreadAngle / Math.max(bulletCount - 1, 1));
            const angle = baseAngle + offset;
            const targetX = this.x + Math.cos(angle) * 500;
            const targetY = this.y + Math.sin(angle) * 500;

            const bullet = new EnemyBullet(this.x, this.y, targetX, targetY, this.damage);
            game.enemyBullets.push(bullet);
        }
    }
}
