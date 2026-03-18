import { Item } from './Item.js';

export class Meat extends Item {
    constructor(x, y) {
        super(x, y, {
            spriteKey: 'meat',
            size: 16,
            duration: 15000,
        });
    }

    onPickup(player, game) {
        player.hp = Math.min(player.hp + 20, player.maxHp);
    }
}
