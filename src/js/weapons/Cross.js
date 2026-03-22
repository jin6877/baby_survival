// Cross: 기저귀 - 부메랑 관통 무기
import { Weapon } from './Weapon.js';
import { BoomerangProjectile } from '../entities/projectiles/BoomerangProjectile.js';

export class Cross extends Weapon {
    constructor() {
        super({
            name: '기저귀',
            damage: 18,
            cooldown: 1400,
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
            if (this.projectileCount >= 2) {
                angle = baseAngle + (i * Math.PI * 2 / this.projectileCount);
            }

            const sizeMult = game.player ? game.player.projectileSizeMultiplier : 1;
            const proj = new BoomerangProjectile(px, py, {
                damage: this.getEffectiveDamage(game),
                size: Math.round(34 * this.sizeMultiplier * sizeMult),
                maxRange: 220 * this.rangeMultiplier,
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
                this.damage = 25;
                this.rangeMultiplier = 1.2;
                this.description = '더 멀리 더 강하게!';
                break;
            case 3:
                this.damage = 32;
                this.cooldown = 1100;
                this.projectileCount = 2;
                this.description = '양쪽으로 기저귀 2개 발사!';
                break;
            case 4:
                this.damage = 40;
                this.sizeMultiplier = 1.3;
                this.rangeMultiplier = 1.4;
                this.description = '큰 기저귀 2개! 넓은 범위!';
                break;
            case 5:
                this.damage = 50;
                this.projectileCount = 3;
                this.sizeMultiplier = 1.5;
                this.rangeMultiplier = 1.6;
                this.cooldown = 900;
                this.description = '거대 기저귀 3개! 사방에서!';
                break;
        }
    }
}
