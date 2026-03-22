import { Item } from './Item.js';

export class Magnet extends Item {
    constructor(x, y) {
        super(x, y, {
            spriteKey: 'magnet',
            size: 44,
            duration: 10000,
        });
    }

    onPickup(player, game) {
        // 바닥 자석: 필드 위 모든 아이템을 플레이어에게 흡수
        if (!game.items) return;
        for (const item of game.items) {
            if (!item.alive || item === this) continue;
            // pullSpeed를 매우 높게 설정하여 즉시 끌려오게
            item.pullSpeed = 9999;
            // pullSpeed가 없는 아이템도 강제로 끌어당기기 위해 위치 이동
            item._magnetPull = true;
        }
    }
}
