// SharpshooterGlass: 명사수의 안경 - 투사체 크기 퍼센트 증가
import { Equipment } from './Equipment.js';

export class SharpshooterGlass extends Equipment {
    constructor() {
        super({
            name: '두꺼운 안경',
            description: '투사체 크기 +10%',
            icon: '👓',
            color: '#26c6da',
            imageSrc: 'images/equipment_icons/equip_thick_glasses.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.projectileSizeMultiplier *= (1 + this.pctBonus);
    }

    remove(player) {
        player.projectileSizeMultiplier /= (1 + this.pctBonus);
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `투사체 크기 +${Math.round(this.pctBonus * 100)}%`;
    }
}
