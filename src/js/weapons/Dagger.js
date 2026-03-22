// Dagger: 엄마 손 - 빠른 연사 + 다수 투사체 무기
import { Weapon } from './Weapon.js';
import { Projectile } from '../entities/projectiles/Projectile.js';

export class Dagger extends Weapon {
    constructor() {
        super({
            name: '엄마 손',
            damage: 20,
            cooldown: 600,
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

            const sizeMult = game.player ? game.player.projectileSizeMultiplier : 1;
            const proj = new Projectile(px, py, {
                speed: 7,
                damage: this.getEffectiveDamage(game),
                spriteKey: 'daggerProjectile',
                size: Math.round(30 * sizeMult),
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
                this.damage = 28;
                this.projectileCount = 2;
                this.spread = 0.15;
                this.description = '양손으로 때립니다!';
                break;
            case 3:
                this.damage = 35;
                this.cooldown = 450;
                this.description = '더 빠르게! 더 아프게!';
                break;
            case 4:
                this.projectileCount = 3;
                this.spread = 0.2;
                this.piercing = true;
                this.description = '3연타 관통 엄마 손!';
                break;
            case 5:
                this.projectileCount = 5;
                this.damage = 45;
                this.cooldown = 350;
                this.description = '엄마의 분노! 5연타!';
                break;
        }
    }
}
