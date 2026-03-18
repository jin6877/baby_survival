// Axe: 도끼 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { AxeProjectile } from '../entities/projectiles/AxeProjectile.js';

export class Axe extends Weapon {
    constructor() {
        super({
            name: '도끼',
            damage: 25,       // 20 → 25
            cooldown: 1800,   // 2000 → 1800
            spriteKey: 'axe',
            description: '위로 올라갔다 내려오는 도끼를 던집니다.',
        });

        this.projectileCount = 1;
        this.sizeMultiplier = 1;
    }

    attack(game) {
        if (!game.player) return;

        const px = game.player.x;
        const py = game.player.y;

        for (let i = 0; i < this.projectileCount; i++) {
            const offsetX = (Math.random() - 0.5) * 3;

            const proj = new AxeProjectile(px, py, {
                damage: this.getEffectiveDamage(game),
                size: Math.round(18 * this.sizeMultiplier),
                offsetX,
                owner: game.player,
            });

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 35;
                this.description = '데미지가 크게 증가합니다.';
                break;
            case 3:
                this.cooldown = 1400;
                this.projectileCount = 2;
                this.description = '2개의 도끼, 쿨다운 감소.';
                break;
            case 4:
                this.projectileCount = 3;
                this.sizeMultiplier = 1.3;
                this.description = '3개의 큰 도끼를 던집니다.';
                break;
            case 5:
                this.projectileCount = 4;
                this.sizeMultiplier = 1.6;
                this.damage = 45;
                this.description = '4개의 거대한 도끼! 엄청난 데미지.';
                break;
        }
    }
}
