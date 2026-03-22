// Ghost → 감기 바이러스: 원거리 공격 + 텔레포트 + 확산탄
import { Enemy } from './Enemy.js';
import { EnemyBullet } from '../projectiles/EnemyBullet.js';

export class Ghost extends Enemy {
    constructor(x, y) {
        super(x, y, {
            hp: 15,
            speed: 2,
            damage: 10,
            size: 60,
            spriteKey: 'ghost',
            effectSpriteKey: 'ghostEffect',
            enemyName: '감기 바이러스',
            exp: 2
        });

        this.shootTimer = 0;
        this.shootInterval = 2.5;
        this.keepDistance = 200;
        this.shotCount = 0; // 몇 번 쐈는지

        // 텔레포트
        this.teleportTimer = 5 + Math.random() * 3;
        this.teleportCooldown = 6;
        this.isTeleporting = false;
        this.teleportFadeTimer = 0;
        this.teleportFadeDuration = 0.4;

        // 반투명 깜빡임
        this.flickerTimer = 0;
    }

    movementPattern(dt, game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.flickerTimer += dt;

        // 텔레포트 페이드 중
        if (this.isTeleporting) {
            this.teleportFadeTimer += dt;
            if (this.teleportFadeTimer >= this.teleportFadeDuration) {
                this.isTeleporting = false;
                // 플레이어 주변 랜덤 위치로 이동
                const angle = Math.random() * Math.PI * 2;
                const tpDist = 180 + Math.random() * 120;
                this.x = game.player.x + Math.cos(angle) * tpDist;
                this.y = game.player.y + Math.sin(angle) * tpDist;
            }
            return;
        }

        // 텔레포트 쿨다운
        this.teleportTimer -= dt;
        if (this.teleportTimer <= 0) {
            this.isTeleporting = true;
            this.teleportFadeTimer = 0;
            this.teleportTimer = this.teleportCooldown;
            return;
        }

        // 거리 유지 이동
        if (dist > this.keepDistance + 30) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.x += dirX * this.speed * 60 * dt;
            this.y += dirY * this.speed * 60 * dt;
        } else if (dist < this.keepDistance - 30) {
            // 너무 가까우면 뒤로
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.x -= dirX * this.speed * 60 * dt;
            this.y -= dirY * this.speed * 60 * dt;
        } else {
            // 적정 거리에서 원형 이동
            const perpX = -dy / dist;
            const perpY = dx / dist;
            this.x += perpX * this.speed * 0.5 * 60 * dt;
            this.y += perpY * this.speed * 0.5 * 60 * dt;
        }

        // 사격
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shotCount++;
            // 3발마다 확산탄
            if (this.shotCount % 3 === 0) {
                this.shootSpread(game);
            } else {
                this.shootAtPlayer(game);
            }
        }
    }

    shootAtPlayer(game) {
        if (!game.player || !game.player.alive) return;

        const bullet = new EnemyBullet(
            this.x, this.y,
            game.player.x, game.player.y,
            this.damage
        );

        if (game.enemyBullets) {
            game.enemyBullets.push(bullet);
        }
    }

    shootSpread(game) {
        if (!game.player || !game.player.alive) return;

        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const baseAngle = Math.atan2(dy, dx);
        const spreadCount = 3;
        const spreadAngle = 0.3; // 라디안

        for (let i = 0; i < spreadCount; i++) {
            const angle = baseAngle + (i - (spreadCount - 1) / 2) * spreadAngle;
            const targetX = this.x + Math.cos(angle) * 300;
            const targetY = this.y + Math.sin(angle) * 300;

            const bullet = new EnemyBullet(
                this.x, this.y,
                targetX, targetY,
                Math.round(this.damage * 0.7)
            );

            if (game.enemyBullets) {
                game.enemyBullets.push(bullet);
            }
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

        // 텔레포트 페이드
        if (this.isTeleporting) {
            const progress = this.teleportFadeTimer / this.teleportFadeDuration;
            ctx.globalAlpha = 1 - progress;
        } else {
            // 유령 같은 반투명 깜빡임
            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.flickerTimer * 4);
        }

        super.render(ctx, camera);
        ctx.globalAlpha = 1;
    }
}
