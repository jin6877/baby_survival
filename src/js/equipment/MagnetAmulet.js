// MagnetAmulet: 자석 부적 - 경험치 흡수 범위 증가
import { Equipment } from './Equipment.js';

export class MagnetAmulet extends Equipment {
    constructor() {
        super({
            name: '자석 부적',
            description: '경험치 흡수 범위 +40%',
            icon: 'M',
            color: '#ff5252',
        });
        this.radiusBonus = 20; // 픽셀 추가
    }

    apply(player) {
        player.expPickupRadius += this.radiusBonus;
    }

    remove(player) {
        player.expPickupRadius -= this.radiusBonus;
    }

    onLevelUp() {
        this.radiusBonus = 20 + (this.level - 1) * 15;
        this.description = `경험치 흡수 범위 +${this.radiusBonus}px`;
    }
}
