// Firebomb: 화염병 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { AreaEffect } from '../entities/projectiles/AreaEffect.js';

export class Firebomb extends Weapon {
    constructor() {
        super({
            name: '화염병',
            damage: 15,
            cooldown: 2800,
            spriteKey: 'firebomb',
            description: '플레이어 근처에 화염 지대를 생성합니다.',
        });

        this.areaRadius = 65;
        this.areaDuration = 3000;
        this.tickInterval = 400;
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
            });

            game.projectiles.push(area);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 22;
                this.areaRadius = 80;
                this.description = '데미지 증가, 범위 확장.';
                break;
            case 3:
                this.cooldown = 2200;
                this.bombCount = 2;
                this.description = '2개의 화염병을 던집니다!';
                break;
            case 4:
                this.areaRadius = 95;
                this.areaDuration = 4000;
                this.description = '넓은 범위, 오래 지속.';
                break;
            case 5:
                this.bombCount = 3;
                this.areaRadius = 110;
                this.areaDuration = 5000;
                this.damage = 30;
                this.description = '3개의 거대 화염! 불바다!';
                break;
        }
    }
}
