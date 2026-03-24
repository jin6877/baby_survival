// SwiftBoots: 민첩의 장화 - 이동속도 퍼센트 증가
import { Equipment } from './Equipment.js';

export class SwiftBoots extends Equipment {
    constructor() {
        super({
            name: '아기 신발',
            description: '이동속도 +10%',
            icon: '👟',
            color: '#4fc3f7',
            imageSrc: 'images/equipment_icons/equip_shoes.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.speedMultiplier *= (1 + this.pctBonus);
    }

    remove(player) {
        player.speedMultiplier /= (1 + this.pctBonus);
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `이동속도 +${Math.round(this.pctBonus * 100)}%`;
    }
}
