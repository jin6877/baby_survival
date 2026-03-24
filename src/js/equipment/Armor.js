// Armor: 갑옷 - 받는 데미지 퍼센트 감소
import { Equipment } from './Equipment.js';

export class Armor extends Equipment {
    constructor() {
        super({
            name: '아기 헬멧',
            description: '받는 데미지 -10%',
            icon: '⛑',
            color: '#78909c',
            imageSrc: 'images/equipment_icons/equip_helmet.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.damageReductionPct = (player.damageReductionPct || 0) + this.pctBonus;
    }

    remove(player) {
        player.damageReductionPct = (player.damageReductionPct || 0) - this.pctBonus;
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `받는 데미지 -${Math.round(this.pctBonus * 100)}%`;
    }
}
