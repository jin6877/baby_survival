// TimeClock: 시간의 시계 - 쿨다운 감소
import { Equipment } from './Equipment.js';

export class TimeClock extends Equipment {
    constructor() {
        super({
            name: '낮잠 시계',
            description: '쿨다운 감소 -8%',
            icon: '⏰',
            color: '#ab47bc',
            imageSrc: 'images/equipment_icons/equip_nap_clock.png',
        });
        this.speedBonus = 0.08;
    }

    apply(player) {
        player.attackSpeedMultiplier += this.speedBonus;
    }

    remove(player) {
        player.attackSpeedMultiplier -= this.speedBonus;
    }

    onLevelUp() {
        this.speedBonus = 0.08 + (this.level - 1) * 0.06;
        const percent = Math.round(this.speedBonus * 100);
        this.description = `공격속도 +${percent}%`;
    }
}
