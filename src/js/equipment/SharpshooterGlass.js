// SharpshooterGlass: 명사수의 안경 - 투사체 크기 및 속도 증가
import { Equipment } from './Equipment.js';

export class SharpshooterGlass extends Equipment {
    constructor() {
        super({
            name: '두꺼운 안경',
            description: '투사체 크기 +15%',
            icon: '👓',
            color: '#26c6da',
            imageSrc: 'images/equipment_icons/equip_thick_glasses.png',
        });
        this.sizeBonus = 0.15;
    }

    apply(player) {
        player.projectileSizeMultiplier += this.sizeBonus;
    }

    remove(player) {
        player.projectileSizeMultiplier -= this.sizeBonus;
    }

    onLevelUp() {
        this.sizeBonus = 0.15 + (this.level - 1) * 0.10;
        const percent = Math.round(this.sizeBonus * 100);
        this.description = `투사체 크기 +${percent}%`;
    }
}
