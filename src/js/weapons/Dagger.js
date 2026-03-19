// Dagger: 기본 단검 무기
import { Weapon } from './Weapon.js';
import { Projectile } from '../entities/projectiles/Projectile.js';

export class Dagger extends Weapon {
    constructor() {
        super({
            name: '엄마 손',
            damage: 15,
            cooldown: 800,
            spriteKey: 'dagger',
            description: '가장 가까운 적에게 엄마 손을 날립니다.',
        });

        this.projectileCount = 1;
        this.spread = 0;
        this.piercing = false;
    }

    attack(game) {
        if (!game.player || !game.enemies || game.enemies.length === 0) return;

        // 가장 가까운 적 찾기
        let closestEnemy = null;
        let closestDist = Infinity;
        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;
            const dist = game.player.distanceTo(enemy);
            if (dist < closestDist) {
                closestDist = dist;
                closestEnemy = enemy;
            }
        }

        if (!closestEnemy) return;

        const px = game.player.x;
        const py = game.player.y;
        const dx = closestEnemy.x - px;
        const dy = closestEnemy.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        const baseAngle = Math.atan2(dy, dx);

        for (let i = 0; i < this.projectileCount; i++) {
            let angle = baseAngle;

            // 다수 투사체일 때 퍼뜨리기
            if (this.projectileCount > 1) {
                const spreadRange = this.spread;
                const offset = (i - (this.projectileCount - 1) / 2) * spreadRange;
                angle += offset;
            }

            const proj = new Projectile(px, py, {
                speed: 6,
                damage: this.getEffectiveDamage(game),
                spriteKey: 'daggerProjectile',
                size: 40,
                piercing: this.piercing,
                owner: game.player,
            });
            proj.velocityX = Math.cos(angle);
            proj.velocityY = Math.sin(angle);
            proj.rotation = angle;

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = Math.round(15 * 1.3);
                this.description = '엄마 손이 더 아파집니다!';
                break;
            case 3:
                this.cooldown = 800 * 0.75;
                this.description = '엄마 손이 더 빨라집니다!';
                break;
            case 4:
                this.projectileCount = 2;
                this.spread = 0.15;
                this.description = '양손으로 때립니다!';
                break;
            case 5:
                this.projectileCount = 3;
                this.piercing = true;
                this.description = '관통하는 엄마의 분노!';
                break;
        }
    }
}
