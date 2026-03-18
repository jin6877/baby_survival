// HolyWater: 성수 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { AreaEffect } from '../entities/projectiles/AreaEffect.js';

export class HolyWater extends Weapon {
    constructor() {
        super({
            name: '성수',
            damage: 8,
            cooldown: 2500,
            spriteKey: 'holyWater',
            description: '플레이어 주변에 성수 범위 효과를 생성합니다.',
        });

        this.radius = 80;
        this.effectDuration = 2500;
        this.leavesZone = false;
        this.zoneDuration = 3000;
    }

    attack(game) {
        if (!game.player) return;

        const effect = new AreaEffect(game.player.x, game.player.y, {
            radius: this.radius,
            damage: this.getEffectiveDamage(game),
            duration: this.effectDuration,
            tickInterval: 250,
            color: '#42a5f5',
            owner: game.player,
            followOwner: true,
        });

        game.projectiles.push(effect);

        if (this.leavesZone) {
            const zoneEffect = new AreaEffect(game.player.x, game.player.y, {
                radius: this.radius * 0.8,
                damage: this.getEffectiveDamage(game) * 0.5,
                duration: this.zoneDuration,
                tickInterval: 400,
                color: '#90caf9',
                owner: null,
                followOwner: false,
            });
            zoneEffect.elapsed = -this.effectDuration;
            game.projectiles.push(zoneEffect);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 12;
                this.description = '데미지가 증가합니다.';
                break;
            case 3:
                this.cooldown = 2000;
                this.radius = 100;
                this.description = '쿨다운 감소, 범위 증가.';
                break;
            case 4:
                this.radius = 120;
                this.effectDuration = 3000;
                this.description = '범위 120, 지속시간 증가.';
                break;
            case 5:
                this.radius = 150;
                this.leavesZone = true;
                this.damage = 16;
                this.description = '범위 150 + 데미지 존을 남깁니다.';
                break;
        }
    }
}
