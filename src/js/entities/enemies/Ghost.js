// Ghost → 감기 바이러스: 원거리 공격 적군
import { Enemy } from './Enemy.js';
import { EnemyBullet } from '../projectiles/EnemyBullet.js';

export class Ghost extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 15,
            speed: 2,
            damage: 10,
            size: 60,
            spriteKey: 'ghost',
            effectSpriteKey: 'ghostEffect',
            enemyName: '감기 바이러스',
            exp: 2
        });

        this.shootTimer = 0;
        this.shootInterval = 2;
        this.keepDistance = 200;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Move toward player but stop at keepDistance
        if (dist > this.keepDistance) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.x += dirX * this.speed * 60 * dt;
            this.y += dirY * this.speed * 60 * dt;
        }

        // Shoot projectiles at player
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shootAtPlayer(game);
        }
    }

    shootAtPlayer(game) {
        if (!game.player || !game.player.alive) return;

        const bullet = new EnemyBullet(
            this.x, this.y,
            game.player.x, game.player.y,
            this.damage
        );

        if (game.enemyBullets) {
            game.enemyBullets.push(bullet);
        }
    }
}
