// AttackRing: 공격의 반지 - 공격력 퍼센트 증가
import { Equipment } from './Equipment.js';

export class AttackRing extends Equipment {
    constructor() {
        super({
            name: '아빠 응원',
            description: '공격력 +10%',
            icon: '💪',
            color: '#ff7043',
            imageSrc: 'images/equipment_icons/equip_dad_cheer.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.attackPowerPct = (player.attackPowerPct || 0) + this.pctBonus;
    }

    remove(player) {
        player.attackPowerPct = (player.attackPowerPct || 0) - this.pctBonus;
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `공격력 +${Math.round(this.pctBonus * 100)}%`;
    }
}
