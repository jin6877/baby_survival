// Bat → B형 독감: 빠른 지그재그 이동 + 주기적으로 속도 폭발 (버스트)
import { Enemy } from './Enemy.js';

export class Bat extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 8,
            speed: 3.5,
            damage: 3,
            size: 42,
            spriteKey: 'bat',
            effectSpriteKey: 'batEffect',
            enemyName: 'B형 독감',
            exp: 1
        });

        this.zigzagTimer = 0;
        this.zigzagAmplitude = 40;
        this.zigzagFrequency = 3;

        // 속도 버스트: 잠깐 엄청 빨라졌다가 쉬기
        this.burstTimer = 1.5 + Math.random() * 2;
        this.isBursting = false;
        this.burstDuration = 0.8;
        this.burstElapsed = 0;
        this.burstSpeedMult = 3;

        // 쉬는 시간
        this.restTimer = 0;
        this.isResting = false;
        this.restDuration = 0.8;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        this.zigzagTimer += dt;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 쉬는 중 (거의 안 움직임)
        if (this.isResting) {
            this.restTimer += dt;
            if (this.restTimer >= this.restDuration) {
                this.isResting = false;
                this.burstTimer = 1.5 + Math.random() * 1.5;
            }
            // 느릿느릿
            if (dist > 0) {
                this.x += (dx / dist) * this.speed * 0.3 * 60 * dt;
                this.y += (dy / dist) * this.speed * 0.3 * 60 * dt;
            }
            return;
        }

        // 버스트 중
        if (this.isBursting) {
            this.burstElapsed += dt;
            if (this.burstElapsed >= this.burstDuration) {
                this.isBursting = false;
                this.isResting = true;
                this.restTimer = 0;
            }

            if (dist > 0) {
                const dirX = dx / dist;
                const dirY = dy / dist;
                this.x += dirX * this.speed * this.burstSpeedMult * 60 * dt;
                this.y += dirY * this.speed * this.burstSpeedMult * 60 * dt;
            }
            return;
        }

        // 일반 지그재그 이동
        this.burstTimer -= dt;
        if (this.burstTimer <= 0 && dist < 500) {
            this.isBursting = true;
            this.burstElapsed = 0;
        }

        if (dist > 0) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            const perpX = -dirY;
            const perpY = dirX;
            const zigzagOffset = Math.sin(this.zigzagTimer * this.zigzagFrequency) * this.zigzagAmplitude * dt;

            this.x += (dirX * this.speed * 60 * dt) + (perpX * zigzagOffset);
            this.y += (dirY * this.speed * 60 * dt) + (perpY * zigzagOffset);
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // 버스트 중 빨간 잔상
        if (this.isBursting) {
            ctx.globalAlpha = 0.4;
            ctx.filter = 'hue-rotate(280deg) brightness(1.5)';
            super.render(ctx, camera);
            ctx.filter = 'none';
            ctx.globalAlpha = 1;
        }

        // 쉬는 중 반투명
        if (this.isResting) {
            ctx.globalAlpha = 0.5;
        }

        super.render(ctx, camera);

        if (this.isResting) {
            ctx.globalAlpha = 1;
        }
    }
}
