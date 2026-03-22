import { Item } from './Item.js';

export class Bomb extends Item {
    constructor(x, y) {
        super(x, y, {
            spriteKey: 'bomb',
            size: 48,
            duration: 12000,
        });
    }

    onPickup(player, game) {
        // Deal 100 damage to all living enemies (game 전달로 자동 드롭/킬카운트 처리)
        if (game.enemies) {
            for (const enemy of game.enemies) {
                if (enemy.alive) {
                    enemy.takeDamage(100, undefined, game);
                }
            }
        }

        // Brief white flash effect
        game.screenFlash = {
            color: 'rgba(255, 255, 255, 0.8)',
            duration: 200,
            timer: 200,
        };
    }
}
