// LifeNecklace: 생명의 목걸이 - 최대 HP 증가 + HP 재생
import { Equipment } from './Equipment.js';

export class LifeNecklace extends Equipment {
    constructor() {
        super({
            name: '생명의 목걸이',
            description: '최대 HP +20, HP 재생 0.5/초',
            icon: 'H',
            color: '#e91e63',
        });
        this.hpBonus = 20;
        this.regenBonus = 0.5;
    }

    apply(player) {
        player.maxHp += this.hpBonus;
        player.hp += this.hpBonus; // 장착 시 즉시 HP도 증가
        player.hpRegen += this.regenBonus;
    }

    remove(player) {
        player.maxHp -= this.hpBonus;
        player.hp = Math.min(player.hp, player.maxHp);
        player.hpRegen -= this.regenBonus;
    }

    onLevelUp() {
        this.hpBonus = 20 + (this.level - 1) * 15;
        this.regenBonus = 0.5 + (this.level - 1) * 0.3;
        this.description = `최대 HP +${this.hpBonus}, HP 재생 ${this.regenBonus.toFixed(1)}/초`;
    }
}
