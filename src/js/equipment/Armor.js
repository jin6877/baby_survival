// Armor: 갑옷 - 받는 데미지 감소
import { Equipment } from './Equipment.js';

export class Armor extends Equipment {
    constructor() {
        super({
            name: '아기 헬멧',
            description: '받는 데미지 -15%',
            icon: '⛑',
            color: '#78909c',
            imageSrc: 'images/equipment_icons/equip_helmet.png',
        });
        this.reduction = 0.15;
    }

    apply(player) {
        player.damageReduction += this.reduction;
    }

    remove(player) {
        player.damageReduction -= this.reduction;
    }

    onLevelUp() {
        this.reduction = 0.15 + (this.level - 1) * 0.10;
        const percent = Math.round(this.reduction * 100);
        this.description = `받는 데미지 -${percent}%`;
    }
}
