// VampireLord → 낡은 TV: 최종 보스 (3페이즈)
import { Boss } from './Boss.js';
import { Bat } from '../Bat.js';
import { EnemyBullet } from '../../projectiles/EnemyBullet.js';
import { assets } from '../../../core/AssetManager.js';

export class VampireLord extends Boss {
    constructor(x, y) {
        super(x, y, {
            hp: 1500,
            speed: 1.5,
            damage: 20,
            size: 140,
            spriteKey: 'vampireLord',
            effectSpriteKey: 'vampireLordEffect',
            enemyName: '낡은 TV',
            exp: 100,
            bossName: '낡은 TV',
            phases: [
                { threshold: 0.66 },
                { threshold: 0.33 }
            ]
        });

        this.summonTimer = 0;
        this.shootTimer = 0;
        this.teleportTimer = 0;
        this.lightningTimer = 0;
        this.showLightning = false;
    }

    onPhaseChange(phase) {
        if (phase === 1) {
            this.speed = this.baseSpeed * 1.3;
        } else if (phase === 2) {
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

        // 번개 이펙트 타이머
        if (this.showLightning) {
            this.lightningTimer += dt;
            if (this.lightningTimer >= 0.3) {
                this.showLightning = false;
            }
        }
    }

    phase1Behavior(dt, game) {
        this.chasePlayer(dt, game);

        // B형 독감 소환 (2마리, 4초마다)
        this.summonTimer += dt;
        if (this.summonTimer >= 4) {
            this.summonTimer = 0;
            this.summonBats(game, 2);
        }

        // 전파 발사 (3발)
        this.shootTimer += dt;
        if (this.shootTimer >= 3) {
            this.shootTimer = 0;
            this.shootSpread(game, 3);
        }
    }

    phase2Behavior(dt, game) {
        this.chasePlayer(dt, game);

        // B형 독감 소환 (4마리, 3초마다)
        this.summonTimer += dt;
        if (this.summonTimer >= 3) {
            this.summonTimer = 0;
            this.summonBats(game, 4);
        }

        // 전파 링 발사 (8발)
        this.shootTimer += dt;
        if (this.shootTimer >= 3) {
            this.shootTimer = 0;
            this.shootRing(game, 8);
        }
    }

    phase3Behavior(dt, game) {
        this.chasePlayer(dt, game);

        // 순간이동 (5초마다)
        this.teleportTimer += dt;
        if (this.teleportTimer >= 5) {
            this.teleportTimer = 0;
            this.teleportRandom(game);
        }

        // B형 독감 소환 (3마리, 2초마다)
        this.summonTimer += dt;
        if (this.summonTimer >= 2) {
            this.summonTimer = 0;
            this.summonBats(game, 3);
        }

        // 전파 링 발사 (12발)
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

        this.showLightning = true;
        this.lightningTimer = 0;

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

        this.showLightning = true;
        this.lightningTimer = 0;

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

        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 200;
        this.x = game.player.x + Math.cos(angle) * dist;
        this.y = game.player.y + Math.sin(angle) * dist;

        this.showLightning = true;
        this.lightningTimer = 0;
    }

    takeDamage(amount, knockbackAngle) {
        super.takeDamage(amount, knockbackAngle);

        const hpPercent = this.hp / this.maxHp;
        if (hpPercent < 0.33 && this.alive) {
            this.hasLifesteal = true;
        }
    }

    onDamageDealt(damageDealt) {
        if (this.hasLifesteal && this.alive) {
            const healAmount = damageDealt * 0.1;
            this.hp = Math.min(this.hp + healAmount, this.maxHp);
        }
    }

    render(ctx, camera) {
        // 번개 이펙트
        if (this.showLightning) {
            const screenX = this.x - camera.x;
            const screenY = this.y - camera.y;
            const effectAlpha = 1 - (this.lightningTimer / 0.3);
            ctx.globalAlpha = effectAlpha * 0.7;
            const effectSize = this.width * 2.5;
            assets.drawSprite(ctx, 'vampireLordEffect', screenX, screenY, effectSize, effectSize);
            ctx.globalAlpha = 1;
        }

        super.render(ctx, camera);
    }
}
