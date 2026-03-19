// Cross: 십자가 무기 (부메랑)
import { Weapon } from './Weapon.js';
import { BoomerangProjectile } from '../entities/projectiles/BoomerangProjectile.js';

export class Cross extends Weapon {
    constructor() {
        super({
            name: '기저귀',
            damage: 12,
            cooldown: 1500,
            spriteKey: 'cross',
            description: '부메랑처럼 회전하며 돌아오는 기저귀!',
        });

        this.projectileCount = 1;
        this.sizeMultiplier = 1;
        this.rangeMultiplier = 1;
    }

    attack(game) {
        if (!game.player || !game.enemies) return;

        const px = game.player.x;
        const py = game.player.y;

        // 가장 가까운 적 방향으로 발사
        let closestEnemy = null;
        let closestDist = Infinity;
        const aliveEnemies = game.enemies.filter(e => e.alive);

        for (const enemy of aliveEnemies) {
            const dist = game.player.distanceTo(enemy);
            if (dist < closestDist) {
                closestDist = dist;
                closestEnemy = enemy;
            }
        }

        // 기본 방향 (적이 없으면 오른쪽)
        let baseAngle = 0;
        if (closestEnemy) {
            baseAngle = Math.atan2(closestEnemy.y - py, closestEnemy.x - px);
        }

        for (let i = 0; i < this.projectileCount; i++) {
            let angle = baseAngle;

            // 2개일 때 반대 방향
            if (this.projectileCount === 2) {
                angle = baseAngle + i * Math.PI;
            }

            const proj = new BoomerangProjectile(px, py, {
                damage: this.getEffectiveDamage(game),
                size: Math.round(46 * this.sizeMultiplier),
                maxRange: 200 * this.rangeMultiplier,
                dirX: Math.cos(angle),
                dirY: Math.sin(angle),
                owner: game.player,
                spriteKey: 'crossProjectile',
            });

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = Math.round(12 * 1.3);
                this.description = '기저귀가 더 세게 때립니다!';
                break;
            case 3:
                this.cooldown = 1500 * 0.75;
                this.description = '더 빠르게 기저귀를 던집니다!';
                break;
            case 4:
                this.projectileCount = 2;
                this.description = '양쪽으로 기저귀 2개 발사!';
                break;
            case 5:
                this.sizeMultiplier = 1.5;
                this.rangeMultiplier = 1.5;
                this.description = '거대 기저귀 2개! 관통!';
                break;
        }
    }
}
