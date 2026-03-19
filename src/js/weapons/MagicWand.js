// MagicWand: 마법봉 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { HomingProjectile } from '../entities/projectiles/HomingProjectile.js';

export class MagicWand extends Weapon {
    constructor() {
        super({
            name: '엄마 잔소리',
            damage: 15,
            cooldown: 1200,
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

            const proj = new HomingProjectile(px, py, {
                speed: 5,  // 4 → 5
                damage: this.getEffectiveDamage(game),
                spriteKey: 'magicProjectile',
                size: 38,
                target,
                owner: game.player,
                explodeOnHit: this.explodeOnHit,
                explosionRadius: 50,
                explosionDamageRatio: 0.6,
            });

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 22;
                this.projectileCount = 2;
                this.description = '잔소리가 2배로!';
                break;
            case 3:
                this.cooldown = 900;
                this.description = '엄마가 더 자주 잔소리합니다!';
                break;
            case 4:
                this.projectileCount = 3;
                this.explodeOnHit = true;
                this.description = '3중 잔소리 + 적중 시 폭발!';
                break;
            case 5:
                this.projectileCount = 4;
                this.damage = 30;
                this.description = '엄마의 끝없는 잔소리 폭격!';
                break;
        }
    }
}
