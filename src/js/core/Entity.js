// Entity: 모든 게임 오브젝트의 베이스 클래스
import { assets } from './AssetManager.js';

export class Entity {
    constructor(x, y, width, height, spriteKey) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spriteKey = spriteKey;
        this.rotation = 0;
        this.alive = true;
        this.opacity = 1;
    }

    update(dt, game) {
        // 서브클래스에서 구현
    }

    render(ctx, camera) {
        if (!this.alive) return;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // 화면 밖이면 렌더링 스킵
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        ctx.globalAlpha = this.opacity;
        assets.drawSprite(ctx, this.spriteKey, screenX, screenY, this.width, this.height, this.rotation);
        ctx.globalAlpha = 1;
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
        };
    }

    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    onDestroy(game) {
        // 서브클래스에서 구현
    }

    destroy(game) {
        this.alive = false;
        this.onDestroy(game);
    }
}
