// SwiftBoots: 민첩의 장화 - 이동속도 증가
import { Equipment } from './Equipment.js';

export class SwiftBoots extends Equipment {
    constructor() {
        super({
            name: '아기 신발',
            description: '이동속도 +12%',
            icon: '👟',
            color: '#4fc3f7',
            imageSrc: 'images/equipment_icons/equip_shoes.png',
        });
        this.speedBonus = 0.12;
    }

    apply(player) {
        player.speedMultiplier += this.speedBonus;
    }

    remove(player) {
        player.speedMultiplier -= this.speedBonus;
    }

    onLevelUp() {
        this.speedBonus = 0.12 + (this.level - 1) * 0.08;
        const percent = Math.round(this.speedBonus * 100);
        this.description = `이동속도 +${percent}%`;
    }
}
