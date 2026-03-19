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
        if (game.activateMagnet) {
            game.activateMagnet();
        } else {
            game.magnetActive = true;
        }
    }
}
