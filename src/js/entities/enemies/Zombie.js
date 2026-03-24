// Zombie → 병균: 기본 추적 적군 - 죽으면 2마리 미니 병균으로 분열
import { Enemy } from './Enemy.js';

export class Zombie extends Enemy {
    constructor(x, y, isMini = false) {
        const hp = isMini ? 8 : 20;
        const size = isMini ? 28 : 48;
        const speed = isMini ? 1.8 : 1.2;
        const damage = isMini ? 3 : 5;
        const exp = isMini ? 1 : 1;

        super(x, y, {
            hp,
            speed,
            damage,
            size,
            spriteKey: 'zombie',
            effectSpriteKey: 'zombieEffect',
            enemyName: isMini ? '미니 병균' : '병균',
            exp
        });

        this.isMini = isMini;
    }

    onDeath(game) {
        // 미니가 아닌 경우 2마리 미니 병균 분열
        if (!this.isMini && game) {
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const offset = 20;
                const mini = new Zombie(
                    this.x + Math.cos(angle) * offset,
                    this.y + Math.sin(angle) * offset,
                    true
                );
                // 스테이지 스케일링 반영 (약하게)
                const stageNumber = game.currentStage ? game.currentStage.stageNumber : 1;
                mini.hp *= 1 + (stageNumber - 1) * 0.3;
                mini.maxHp = mini.hp;
                game.enemies.push(mini);
            }
        }

        super.onDeath(game);
    }
}
