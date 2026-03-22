// Axe: 아빠 슬리퍼 - 고데미지 범위 무기
import { Weapon } from './Weapon.js';
import { AxeProjectile } from '../entities/projectiles/AxeProjectile.js';

export class Axe extends Weapon {
    constructor() {
        super({
            name: '아빠 슬리퍼',
            damage: 35,
            cooldown: 1400,
            spriteKey: 'axe',
            description: '아빠의 슬리퍼가 포물선을 그리며 날아갑니다!',
        });

        this.projectileCount = 1;
        this.sizeMultiplier = 1.2;
    }

    attack(game) {
        if (!game.player) return;

        const px = game.player.x;
        const py = game.player.y;

        for (let i = 0; i < this.projectileCount; i++) {
            const offsetX = (Math.random() - 0.5) * 3;

            const sizeMult = game.player ? game.player.projectileSizeMultiplier : 1;
            const proj = new AxeProjectile(px, py, {
                damage: this.getEffectiveDamage(game),
                size: Math.round(38 * this.sizeMultiplier * sizeMult),
                offsetX,
                owner: game.player,
            });

            game.projectiles.push(proj);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 50;
                this.projectileCount = 2;
                this.description = '양쪽 슬리퍼를 모두 던집니다!';
                break;
            case 3:
                this.damage = 65;
                this.cooldown = 1100;
                this.sizeMultiplier = 1.4;
                this.description = '더 크고 빠른 슬리퍼!';
                break;
            case 4:
                this.projectileCount = 3;
                this.damage = 80;
                this.description = '3개의 큰 슬리퍼 투척!';
                break;
            case 5:
                this.projectileCount = 4;
                this.sizeMultiplier = 1.8;
                this.damage = 100;
                this.cooldown = 900;
                this.description = '슬리퍼 폭격! 아빠의 분노!';
                break;
        }
    }
}
