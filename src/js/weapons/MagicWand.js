// MagicWand: 엄마 잔소리 - 유도 추적 무기
import { Weapon } from './Weapon.js';
import { HomingProjectile } from '../entities/projectiles/HomingProjectile.js';

export class MagicWand extends Weapon {
    constructor() {
        super({
            name: '엄마 잔소리',
            damage: 25,
            cooldown: 900,
            spriteKey: 'magicWand',
            description: '엄마의 잔소리가 적을 추적합니다!',
        });

        this.projectileCount = 1;
        this.explodeOnHit = false;
    }

    attack(game) {
        if (!game.player || !game.enemies || game.enemies.length === 0) return;

        const aliveEnemies = game.enemies.filter(e => e.alive);
        if (aliveEnemies.length === 0) return;

        const px = game.player.x;
        const py = game.player.y;

        for (let i = 0; i < this.projectileCount; i++) {
            const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

            const sizeMult = game.player ? game.player.projectileSizeMultiplier : 1;
            const proj = new HomingProjectile(px, py, {
                speed: 6,
                damage: this.getEffectiveDamage(game),
                spriteKey: 'magicProjectile',
                size: Math.round(30 * sizeMult),
                target,
                owner: game.player,
                explodeOnHit: this.explodeOnHit,
                explosionRadius: 60,
                explosionDamageRatio: 0.7,
            });

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 35;
                this.projectileCount = 2;
                this.description = '잔소리가 2배로!';
                break;
            case 3:
                this.damage = 45;
                this.cooldown = 700;
                this.projectileCount = 3;
                this.description = '3중 잔소리! 더 자주!';
                break;
            case 4:
                this.damage = 55;
                this.projectileCount = 4;
                this.explodeOnHit = true;
                this.description = '4중 잔소리 + 적중 시 폭발!';
                break;
            case 5:
                this.projectileCount = 6;
                this.damage = 70;
                this.cooldown = 500;
                this.description = '엄마의 끝없는 잔소리 폭격!';
                break;
        }
    }
}
