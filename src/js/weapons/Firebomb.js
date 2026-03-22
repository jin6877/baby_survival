// Firebomb: 장난감 폭탄 - 범위 지속 데미지 무기
import { Weapon } from './Weapon.js';
import { AreaEffect } from '../entities/projectiles/AreaEffect.js';

export class Firebomb extends Weapon {
    constructor() {
        super({
            name: '장난감 폭탄',
            damage: 18,
            cooldown: 2500,
            spriteKey: 'firebomb',
            description: '장난감 폭탄으로 주변에 폭발 영역을 만듭니다!',
        });

        this.areaRadius = 70;
        this.areaDuration = 3000;
        this.tickInterval = 350;
        this.bombCount = 1;
        this.color = 'rgba(255, 109, 0, 0.3)';
    }

    attack(game) {
        if (!game.player) return;

        const px = game.player.x;
        const py = game.player.y;

        for (let i = 0; i < this.bombCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const targetX = px + Math.cos(angle) * distance;
            const targetY = py + Math.sin(angle) * distance;

            const area = new AreaEffect(targetX, targetY, {
                radius: this.areaRadius,
                damage: this.getEffectiveDamage(game),
                duration: this.areaDuration,
                tickInterval: this.tickInterval,
                color: this.color,
                owner: game.player,
                spriteKey: 'toyBombEffect',
            });

            game.projectiles.push(area);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 25;
                this.areaRadius = 85;
                this.description = '폭탄이 더 강력해집니다!';
                break;
            case 3:
                this.damage = 32;
                this.cooldown = 2000;
                this.bombCount = 2;
                this.description = '장난감 폭탄 2개 투척!';
                break;
            case 4:
                this.damage = 40;
                this.areaRadius = 100;
                this.areaDuration = 4000;
                this.description = '넓은 폭발 범위, 오래 지속!';
                break;
            case 5:
                this.bombCount = 3;
                this.areaRadius = 120;
                this.areaDuration = 5000;
                this.damage = 50;
                this.cooldown = 1600;
                this.description = '3개의 거대 장난감 폭탄!';
                break;
        }
    }
}
