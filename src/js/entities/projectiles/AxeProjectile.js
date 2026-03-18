// AxeProjectile: 포물선으로 날아가는 도끼 투사체
import { Projectile } from './Projectile.js';

export class AxeProjectile extends Projectile {
    constructor(x, y, config = {}) {
        super(x, y, {
            speed: config.speed || 1,
            damage: config.damage || 20,
            spriteKey: 'axeProjectile',
            size: config.size || 18,
            piercing: true,
            lifetime: config.lifetime || 3000,
            owner: config.owner || null,
        });

        // 초기 상방 속도 + 랜덤 X 오프셋
        this.velocityX = config.offsetX || (Math.random() - 0.5) * 3;
        this.velocityY = -8;
        this.gravity = 0.015;
        this.rotationSpeed = 0.01;
    }

    update(dt, game) {
        if (!this.alive) return;

        // 중력 적용
        this.velocityY += this.gravity * 60 * dt;

        // 이동
        this.x += this.velocityX * 60 * dt;
        this.y += this.velocityY * 60 * dt;

        // 회전
        this.rotation += this.rotationSpeed * 60 * dt;

        // 수명 감소 (ms)
        this.lifetime -= dt * 1000;
        if (this.lifetime <= 0) {
            this.destroy(game);
        }
    }
}
