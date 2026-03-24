// HolyWater: 아빠 목소리 - 플레이어 주변 지속 범위 공격
import { Weapon } from './Weapon.js';
import { AreaEffect } from '../entities/projectiles/AreaEffect.js';

export class HolyWater extends Weapon {
    constructor() {
        super({
            name: '아빠 목소리',
            damage: 15,
            cooldown: 2000,
            spriteKey: 'holyWater',
            description: '아빠의 우렁찬 목소리로 주변을 충격파로 공격합니다.',
        });

        this.radius = 100;
        this.effectDuration = 3000;
        this.leavesZone = false;
        this.zoneDuration = 3000;
        this.tickRate = 50; // 빠른 틱 간격
    }

    attack(game) {
        if (!game.player) return;

        const effect = new AreaEffect(game.player.x, game.player.y, {
            radius: this.radius,
            damage: this.getEffectiveDamage(game) * 0.1,
            duration: this.effectDuration,
            tickInterval: this.tickRate,
            color: 'rgba(255, 160, 0, 0.4)',
            owner: game.player,
            followOwner: true,
            spriteKey: 'dadVoiceEffect',
        });

        game.projectiles.push(effect);

        if (this.leavesZone) {
            const zoneEffect = new AreaEffect(game.player.x, game.player.y, {
                radius: this.radius * 0.8,
                damage: this.getEffectiveDamage(game) * 0.05,
                duration: this.zoneDuration,
                tickInterval: this.tickRate,
                color: 'rgba(255, 180, 50, 0.3)',
                owner: null,
                followOwner: false,
                spriteKey: 'dadVoiceEffect',
            });
            zoneEffect.elapsed = -this.effectDuration;
            game.projectiles.push(zoneEffect);
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 22;
                this.radius = 120;
                this.description = '아빠 목소리가 더 커집니다!';
                break;
            case 3:
                this.damage = 30;
                this.cooldown = 1600;
                this.radius = 140;
                this.description = '더 자주, 더 넓게 울려퍼집니다!';
                break;
            case 4:
                this.damage = 40;
                this.radius = 160;
                this.effectDuration = 4000;
                this.description = '아빠 잔소리가 오래 지속됩니다!';
                break;
            case 5:
                this.radius = 200;
                this.leavesZone = true;
                this.damage = 50;
                this.cooldown = 1200;
                this.description = '아빠의 대포 목소리! 충격파 잔여!';
                break;
        }
    }
}
