// DropSystem: 적 사망 시 아이템 드롭 처리
import { ExpGem } from '../items/ExpGem.js';
import { Meat } from '../items/Meat.js';
import { Magnet } from '../items/Magnet.js';
import { Bomb } from '../items/Bomb.js';
import { StatGem } from '../items/StatGem.js';

export class DropSystem {
    constructor(game) {
        this.game = game;
    }

    handleDrop(enemy) {
        const game = this.game;
        if (!game.items) return;

        const x = enemy.x;
        const y = enemy.y;
        const player = game.player;
        const dropBonus = player ? player.dropRateBonus : 0;

        // 항상 ExpGem 드롭 (100%)
        const isLarge = enemy.expValue >= 10;
        const gem = new ExpGem(x, y, isLarge);
        game.items.push(gem);

        // 경험치가 2 이상인 적은 추가 보석도 100% 드롭
        if (enemy.expValue >= 2) {
            const extraGem = new ExpGem(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                false
            );
            game.items.push(extraGem);
        }

        // 25% 확률: 스탯 젬 드롭 (바닥 드롭 = 소량 영구 스탯 증가)
        if (Math.random() < 0.25 + dropBonus * 0.05) {
            const statGem = new StatGem(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20
            );
            game.items.push(statGem);
        }

        // 7% 확률: 고기 드롭 (체력 회복)
        if (Math.random() < 0.07 + dropBonus * 0.03) {
            const meat = new Meat(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(meat);
        }

        // 0.002% 확률: 자석 드롭 (모든 아이템 흡수)
        if (Math.random() < 0.00002 + dropBonus * 0.00001) {
            const magnet = new Magnet(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(magnet);
        }

        // 0.03% 확률: 폭탄 드롭
        if (Math.random() < 0.0003 + dropBonus * 0.0001) {
            const bomb = new Bomb(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(bomb);
        }
    }
}
