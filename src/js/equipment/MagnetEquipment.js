// MagnetEquipment: 자석 - 경험치 흡수 범위 & 흡수력 증가
import { Equipment } from './Equipment.js';

export class MagnetEquipment extends Equipment {
    constructor() {
        super({
            name: '자석',
            description: '경험치 흡수 범위 +10px, 흡수력 약간 증가',
            icon: '🧲',
            color: '#ff4444',
            imageSrc: 'images/field_items/item_magnet.png',
        });
        this.radiusBonus = 10;
        this.magnetPower = 1; // 흡수력 레벨
    }

    apply(player) {
        player.expPickupRadius += this.radiusBonus;
        player.magnetLevel = (player.magnetLevel || 0) + this.magnetPower;
    }

    remove(player) {
        player.expPickupRadius -= this.radiusBonus;
        player.magnetLevel = Math.max(0, (player.magnetLevel || 0) - this.magnetPower);
    }

    onLevelUp() {
        // 레벨별 점진적 증가
        this.radiusBonus = 10 + (this.level - 1) * 8;
        this.magnetPower = this.level;
        this.description = `흡수 범위 +${this.radiusBonus}px, 흡수력 Lv.${this.level}`;
    }
}
