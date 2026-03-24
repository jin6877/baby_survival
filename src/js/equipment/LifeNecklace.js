// LifeNecklace: 생명의 목걸이 - 최대 HP + HP 재생 퍼센트 증가
import { Equipment } from './Equipment.js';

export class LifeNecklace extends Equipment {
    constructor() {
        super({
            name: '젖병 목걸이',
            description: '최대 HP +10%, HP 재생 +0.5/초',
            icon: '🍼',
            color: '#e91e63',
            imageSrc: 'images/equipment_icons/equip_bottle_necklace.png',
        });
        this.pctBonus = 0.10;
        this.regenBonus = 0.5;
    }

    apply(player) {
        const hpIncrease = Math.round(player.maxHp * this.pctBonus);
        this._appliedHp = hpIncrease;
        player.maxHp += hpIncrease;
        player.hp += hpIncrease;
        player.hpRegen += this.regenBonus;
    }

    remove(player) {
        player.maxHp -= (this._appliedHp || 0);
        player.hp = Math.min(player.hp, player.maxHp);
        player.hpRegen -= this.regenBonus;
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.regenBonus = 0.5 + (this.level - 1) * 0.3;
        this.description = `최대 HP +${Math.round(this.pctBonus * 100)}%, HP 재생 ${this.regenBonus.toFixed(1)}/초`;
    }
}
