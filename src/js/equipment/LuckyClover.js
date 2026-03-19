// LuckyClover: 행운의 클로버 - 경험치 획득량 증가
import { Equipment } from './Equipment.js';

export class LuckyClover extends Equipment {
    constructor() {
        super({
            name: '행운의 곰돌이',
            description: '경험치 획득 +25%',
            icon: '🧸',
            color: '#66bb6a',
            imageSrc: 'images/equipment_icons/equip_lucky_bear.png',
        });
        this.expBonus = 0.25;
    }

    apply(player) {
        player.expMultiplier += this.expBonus;
    }

    remove(player) {
        player.expMultiplier -= this.expBonus;
    }

    onLevelUp() {
        this.expBonus = 0.25 + (this.level - 1) * 0.15;
        const percent = Math.round(this.expBonus * 100);
        this.description = `경험치 획득 +${percent}%`;
    }
}
