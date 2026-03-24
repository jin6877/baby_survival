// MagnetAmulet: 자석 부적 - 경험치 흡수 범위 퍼센트 증가
import { Equipment } from './Equipment.js';

export class MagnetAmulet extends Equipment {
    constructor() {
        super({
            name: '엄마 손수건',
            description: '흡수 범위 +10%',
            icon: '🧣',
            color: '#ff5252',
            imageSrc: 'images/equipment_icons/equip_handkerchief.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.expPickupRadius *= (1 + this.pctBonus);
    }

    remove(player) {
        player.expPickupRadius /= (1 + this.pctBonus);
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `흡수 범위 +${Math.round(this.pctBonus * 100)}%`;
    }
}
