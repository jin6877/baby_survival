// Slime → 장염균: 자폭형 적군 + 독 웅덩이 잔류
import { Enemy } from './Enemy.js';
import { AreaEffect } from '../projectiles/AreaEffect.js';

export class Slime extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 30,
            speed: 2.5,
            damage: 25,
            size: 60,
            spriteKey: 'slime',
            enemyName: '장염균',
            exp: 2
        });

        this.selfDestructTimer = 0;
        this.selfDestructDuration = 1.5;
        this.isSelfDestructing = false;
        this.explodeRadius = 90;
        this.hasExploded = false;

        // 독 웅덩이 잔류
        this.poisonTrailTimer = 0;
        this.poisonTrailInterval = 0.8;
        this.poisonRadius = 30;
        this.poisonDuration = 3000;

        // 가까워지면 점점 커짐
        this.growthFactor = 1;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.isSelfDestructing) {
            // 자폭 카운트다운 중 점점 커짐
            this.selfDestructTimer += dt;
            this.growthFactor = 1 + (this.selfDestructTimer / this.selfDestructDuration) * 0.5;
            this.width = 60 * this.growthFactor;
            this.height = 60 * this.growthFactor;

            const flashRate = 10 + (this.selfDestructTimer / this.selfDestructDuration) * 20;
            this.opacity = 0.5 + 0.5 * Math.abs(Math.sin(this.selfDestructTimer * flashRate));

            if (this.selfDestructTimer >= this.selfDestructDuration) {
                this.explode(game);
            }
            return;
        }

        // 추적
        if (dist > 0) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.x += dirX * this.speed * 60 * dt;
            this.y += dirY * this.speed * 60 * dt;
        }

        // 이동 중 독 웅덩이 흘리기
        this.poisonTrailTimer += dt;
        if (this.poisonTrailTimer >= this.poisonTrailInterval) {
            this.poisonTrailTimer = 0;
            this._dropPoison(game);
        }

        // 자폭 시작
        if (dist <= 60) {
            this.isSelfDestructing = true;
            this.selfDestructTimer = 0;
        }
    }

    _dropPoison(game) {
        const poison = new AreaEffect(this.x, this.y, {
            radius: this.poisonRadius,
            damage: 2,
            duration: this.poisonDuration,
            tickInterval: 500,
            color: 'rgba(80, 200, 50, 0.3)',
            owner: null,
            followOwner: false,
            isEnemyArea: true, // 플레이어에게 데미지
        });
        game.projectiles.push(poison);
    }

    explode(game) {
        if (this.hasExploded) return;
        this.hasExploded = true;

        // 플레이어에게 데미지
        if (game.player && game.player.alive) {
            const dist = this.distanceTo(game.player);
            if (dist <= this.explodeRadius) {
                if (game.player.takeDamage) {
                    game.player.takeDamage(this.damage);
                }
            }
        }

        // 폭발 자리에 큰 독 웅덩이 남김
        const poisonZone = new AreaEffect(this.x, this.y, {
            radius: this.explodeRadius,
            damage: 3,
            duration: 4000,
            tickInterval: 400,
            color: 'rgba(100, 220, 50, 0.35)',
            owner: null,
            followOwner: false,
            isEnemyArea: true,
        });
        game.projectiles.push(poisonZone);

        this.alive = false;
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // 자폭 중 빨간 깜빡임 + 커지는 효과
        if (this.isSelfDestructing) {
            ctx.save();
            super.render(ctx, camera);
            const flashIntensity = Math.abs(Math.sin(this.selfDestructTimer * 15));
            ctx.fillStyle = `rgba(255, 0, 0, ${flashIntensity * 0.6})`;
            ctx.fillRect(
                screenX - this.width / 2,
                screenY - this.height / 2,
                this.width,
                this.height
            );
            // 폭발 경고 원
            const progress = this.selfDestructTimer / this.selfDestructDuration;
            ctx.strokeStyle = `rgba(255, 50, 0, ${progress})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.explodeRadius * progress, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        } else {
            super.render(ctx, camera);
        }

        // HP 바
        if (this.hp < this.maxHp) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = screenX - barWidth / 2;
            const barY = screenY - this.height / 2 - 8;
            const hpRatio = this.hp / this.maxHp;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = hpRatio > 0.5 ? '#0f0' : hpRatio > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
        }
    }
}
