// DropSystem: 적 사망 시 아이템 드롭 처리 (강화 버전)
import { ExpGem } from '../items/ExpGem.js';
import { Meat } from '../items/Meat.js';
import { Magnet } from '../items/Magnet.js';
import { Bomb } from '../items/Bomb.js';
import { EquipmentPickup } from '../items/EquipmentPickup.js';
import { EquipmentRegistry } from '../data/EquipmentRegistry.js';

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

        // 항상 ExpGem 드롭
        const isLarge = enemy.expValue >= 10;
        const gem = new ExpGem(x, y, isLarge);
        game.items.push(gem);

        // 보너스: 20% 확률로 추가 경험치 보석
        if (Math.random() < 0.20) {
            const extraGem = new ExpGem(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                false
            );
            game.items.push(extraGem);
        }

        // 7% 확률: 고기 드롭 (이전 5%)
        if (Math.random() < 0.07 + dropBonus * 0.03) {
            const meat = new Meat(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(meat);
        }

        // 4% 확률: 자석 드롭 (이전 3%)
        if (Math.random() < 0.04 + dropBonus * 0.02) {
            const magnet = new Magnet(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(magnet);
        }

        // 3% 확률: 폭탄 드롭 (이전 2%)
        if (Math.random() < 0.03 + dropBonus * 0.01) {
            const bomb = new Bomb(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            game.items.push(bomb);
        }

        // 1.5% 확률: 랜덤 장비 드롭
        if (Math.random() < 0.015 + dropBonus * 0.01) {
            const equipKeys = EquipmentRegistry.keys();
            if (equipKeys.length > 0) {
                const equipKey = equipKeys[Math.floor(Math.random() * equipKeys.length)];
                const pickup = new EquipmentPickup(
                    x + (Math.random() - 0.5) * 30,
                    y + (Math.random() - 0.5) * 30,
                    equipKey
                );
                game.items.push(pickup);
            }
        }
    }
}
