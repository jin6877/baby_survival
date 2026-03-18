// SwiftBoots: 민첩의 장화 - 이동속도 증가
import { Equipment } from './Equipment.js';

export class SwiftBoots extends Equipment {
    constructor() {
        super({
            name: '민첩의 장화',
            description: '이동속도 +12%',
            icon: 'B',
            color: '#4fc3f7',
        });
        this.speedBonus = 0.12;
    }

    apply(player) {
        player.speedMultiplier += this.speedBonus;
    }

    remove(player) {
        player.speedMultiplier -= this.speedBonus;
    }

    onLevelUp() {
        this.speedBonus = 0.12 + (this.level - 1) * 0.08;
        const percent = Math.round(this.speedBonus * 100);
        this.description = `이동속도 +${percent}%`;
    }
}
