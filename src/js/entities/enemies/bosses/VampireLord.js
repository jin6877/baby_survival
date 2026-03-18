import { Boss } from './Boss.js';
import { Bat } from '../Bat.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';

export class VampireLord extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 1500,
            speed: 1.5,
            damage: 20,
            size: 52,
            spriteKey: 'vampireLord',
            exp: 100,
            bossName: 'Vampire Lord',
            phases: [
                { threshold: 0.66 },
                { threshold: 0.33 }
            ]
        });

        this.summonTimer = 0;
        this.shootTimer = 0;
        this.teleportTimer = 0;
    }

    onPhaseChange(phase) {
        if (phase === 1) {
            // Phase 2: faster
            this.speed = this.baseSpeed * 1.3;
        } else if (phase === 2) {
            // Phase 3: even faster
            this.speed = this.baseSpeed * 1.5;
        }
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const hpPercent = this.hp / this.maxHp;

        if (hpPercent > 0.66) {
            this.phase1Behavior(dt, game);
        } else if (hpPercent > 0.33) {
            this.phase2Behavior(dt, game);
        } else {
            this.phase3Behavior(dt, game);
        }
    }

    phase1Behavior(dt, game) {
        // Chase player
        this.chasePlayer(dt, game);

        // Summon 2 bats every 4s
        this.summonTimer += dt;
        if (this.summonTimer >= 4) {
            this.summonTimer = 0;
            this.summonBats(game, 2);
        }

        // Fire 3 bullets
        this.shootTimer += dt;
        if (this.shootTimer >= 3) {
            this.shootTimer = 0;
            this.shootSpread(game, 3);
        }
    }

    phase2Behavior(dt, game) {
        // Chase player
        this.chasePlayer(dt, game);

        // Summon 4 bats every 3s
        this.summonTimer += dt;
        if (this.summonTimer >= 3) {
            this.summonTimer = 0;
            this.summonBats(game, 4);
        }

        // Fire ring of 8 bullets every 3s
        this.shootTimer += dt;
        if (this.shootTimer >= 3) {
            this.shootTimer = 0;
            this.shootRing(game, 8);
        }
    }

    phase3Behavior(dt, game) {
        // Chase player
        this.chasePlayer(dt, game);

        // Teleport every 5s
        this.teleportTimer += dt;
        if (this.teleportTimer >= 5) {
            this.teleportTimer = 0;
            this.teleportRandom(game);
        }

        // Summon 3 bats every 2s
        this.summonTimer += dt;
        if (this.summonTimer >= 2) {
            this.summonTimer = 0;
            this.summonBats(game, 3);
        }

        // Fire 12 bullet ring
        this.shootTimer += dt;
        if (this.shootTimer >= 3) {
            this.shootTimer = 0;
            this.shootRing(game, 12);
        }
    }

    chasePlayer(dt, game) {
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed * 60 * dt;
            this.y += (dy / dist) * this.speed * 60 * dt;
        }
    }

    summonBats(game, count) {
        if (!game.enemies) return;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const spawnDist = 60;
            const bat = new Bat(
                this.x + Math.cos(angle) * spawnDist,
                this.y + Math.sin(angle) * spawnDist
            );
            game.enemies.push(bat);
        }
    }

    shootSpread(game, bulletCount) {
        if (!game.player || !game.player.alive || !game.projectiles) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const spreadAngle = Math.PI / 6;

        for (let i = 0; i < bulletCount; i++) {
            const offset = (i - (bulletCount - 1) / 2) * (spreadAngle / Math.max(bulletCount - 1, 1));
            const angle = baseAngle + offset;
            const targetX = this.x + Math.cos(angle) * 500;
            const targetY = this.y + Math.sin(angle) * 500;

            const bullet = new EnemyBullet(this.x, this.y, targetX, targetY, this.damage);
            game.enemyBullets.push(bullet);
        }
    }

    shootRing(game, bulletCount) {
        if (!game.projectiles) return;

        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i;
            const targetX = this.x + Math.cos(angle) * 500;
            const targetY = this.y + Math.sin(angle) * 500;

            const bullet = new EnemyBullet(this.x, this.y, targetX, targetY, this.damage);
            game.enemyBullets.push(bullet);
        }
    }

    teleportRandom(game) {
        if (!game.player) return;

        // Teleport to a random position within 300-500px of player
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 200;
        this.x = game.player.x + Math.cos(angle) * dist;
        this.y = game.player.y + Math.sin(angle) * dist;
    }

    takeDamage(amount, knockbackAngle) {
        super.takeDamage(amount, knockbackAngle);

        // Phase 3 lifesteal: heal 10% of damage dealt to player
        const hpPercent = this.hp / this.maxHp;
        if (hpPercent < 0.33 && this.alive) {
            // Lifesteal is applied when dealing damage to player, not when taking damage
            // This flag is checked in collision handling
            this.hasLifesteal = true;
        }
    }

    // Called by collision system when this boss damages the player
    onDamageDealt(damageDealt) {
        if (this.hasLifesteal && this.alive) {
            const healAmount = damageDealt * 0.1;
            this.hp = Math.min(this.hp + healAmount, this.maxHp);
        }
    }
}
