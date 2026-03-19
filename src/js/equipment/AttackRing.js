// AttackRing: 공격의 반지 - 공격력 증가
import { Equipment } from './Equipment.js';

export class AttackRing extends Equipment {
    constructor() {
        super({
            name: '아빠 응원',
            description: '공격력 +15%',
            icon: '💪',
            color: '#ff7043',
            imageSrc: 'images/equipment_icons/equip_dad_cheer.png',
        });
        this.attackBonus = 0.15;
    }

    apply(player) {
        player.attackMultiplier += this.attackBonus;
    }

    remove(player) {
        player.attackMultiplier -= this.attackBonus;
    }

    onLevelUp() {
        this.attackBonus = 0.15 + (this.level - 1) * 0.10;
        const percent = Math.round(this.attackBonus * 100);
        this.description = `공격력 +${percent}%`;
    }
}
