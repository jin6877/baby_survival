// TimeClock: 시간의 시계 - 공격속도 퍼센트 증가
import { Equipment } from './Equipment.js';

export class TimeClock extends Equipment {
    constructor() {
        super({
            name: '낮잠 시계',
            description: '공격속도 +10%',
            icon: '⏰',
            color: '#ab47bc',
            imageSrc: 'images/equipment_icons/equip_nap_clock.png',
        });
        this.pctBonus = 0.10;
    }

    apply(player) {
        player.attackSpeedMultiplier *= (1 + this.pctBonus);
    }

    remove(player) {
        player.attackSpeedMultiplier /= (1 + this.pctBonus);
    }

    onLevelUp() {
        this.pctBonus = 0.10 * this.level;
        this.description = `공격속도 +${Math.round(this.pctBonus * 100)}%`;
    }
}
