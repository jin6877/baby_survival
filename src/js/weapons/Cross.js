// Cross: 십자가 무기 (부메랑)
import { Weapon } from './Weapon.js';
import { BoomerangProjectile } from '../entities/projectiles/BoomerangProjectile.js';

export class Cross extends Weapon {
    constructor() {
        super({
            name: '십자가',
            damage: 15,
            cooldown: 2500,
            spriteKey: 'cross',
            description: '부메랑처럼 돌아오는 십자가를 발사합니다.',
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
                size: Math.round(16 * this.sizeMultiplier),
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
                this.damage = Math.round(15 * 1.3);
                this.description = '데미지가 30% 증가합니다.';
                break;
            case 3:
                this.cooldown = 2500 * 0.75;
                this.description = '쿨다운이 25% 감소합니다.';
                break;
            case 4:
                this.projectileCount = 2;
                this.description = '반대 방향으로 2개의 십자가를 발사합니다.';
                break;
            case 5:
                this.sizeMultiplier = 1.5;
                this.rangeMultiplier = 1.5;
                this.description = '더 크고 멀리 나가는 십자가 2개를 발사합니다.';
                break;
        }
    }
}
