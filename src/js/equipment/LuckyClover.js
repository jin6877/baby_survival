// LuckyClover: 행운의 클로버 - 경험치 획득량 퍼센트 증가
import { Equipment } from './Equipment.js';

export class LuckyClover extends Equipment {
    constructor() {
        super({
            name: '행운의 곰돌이',
            description: '경험치 획득 +10%',
            icon: '🧸',
            color: '#66bb6a',
            imageSrc: 'images/equipment_icons/equip_lucky_bear.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.expMultiplier *= (1 + this.pctBonus);
    }

    remove(player) {
        player.expMultiplier /= (1 + this.pctBonus);
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `경험치 획득 +${Math.round(this.pctBonus * 100)}%`;
    }
}
