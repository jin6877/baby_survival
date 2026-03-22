// Garlic: 젖병 방어막 - 근접 방어 + 넉백 무기
import { Weapon } from './Weapon.js';
import { assets } from '../core/AssetManager.js';

export class Garlic extends Weapon {
    constructor() {
        super({
            name: '젖병 방어막',
            damage: 15,
            cooldown: 800,
            spriteKey: 'garlic',
            description: '젖병의 힘으로 주변 적을 밀어냅니다!',
        });

        this.radius = 90;
        this.knockbackForce = 10;

        this.pulseTimer = 0;
        this.pulseDuration = 300;
        this.isPulsing = false;
        this.shieldRotation = 0;
    }

    attack(game) {
        if (!game.player || !game.enemies || game.enemies.length === 0) return;

        const px = game.player.x;
        const py = game.player.y;
        const damage = this.getEffectiveDamage(game);

        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;

            const dx = enemy.x - px;
            const dy = enemy.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.radius) {
                enemy.takeDamage(damage, game);

                if (dist > 0) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const knockback = this.knockbackForce * (game.player.knockbackMultiplier || 1);
                    enemy.x += nx * knockback;
                    enemy.y += ny * knockback;
                }
            }
        }

        this.isPulsing = true;
        this.pulseTimer = 0;
    }

    update(dt, game) {
        super.update(dt, game);

        this.shieldRotation += dt * 2;

        if (this.isPulsing) {
            this.pulseTimer += dt * 1000;
            if (this.pulseTimer >= this.pulseDuration) {
                this.isPulsing = false;
            }
        }
    }

    render(ctx, camera, player) {
        if (!this.isPulsing || !player) return;

        const screenX = player.x - camera.x;
        const screenY = player.y - camera.y;

        const progress = this.pulseTimer / this.pulseDuration;
        const currentRadius = this.radius * (0.5 + progress * 0.5);
        const alpha = 0.7 * (1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (assets.hasSprite('bottleShieldEffect')) {
            const shieldSize = currentRadius * 2.2;
            assets.drawSprite(ctx, 'bottleShieldEffect', screenX, screenY, shieldSize, shieldSize, this.shieldRotation);

            ctx.globalAlpha = alpha * 0.3;
            ctx.strokeStyle = 'rgba(255, 220, 180, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = 'rgba(255, 248, 230, 0.3)';
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 220, 180, 0.7)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 240, 210, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentRadius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 22;
                this.radius = 110;
                this.description = '방어막이 넓어집니다!';
                break;
            case 3:
                this.damage = 30;
                this.cooldown = 600;
                this.knockbackForce = 14;
                this.description = '더 빠르고 강한 넉백!';
                break;
            case 4:
                this.radius = 140;
                this.damage = 40;
                this.description = '넓은 젖병 방어막!';
                break;
            case 5:
                this.radius = 180;
                this.knockbackForce = 20;
                this.damage = 55;
                this.cooldown = 500;
                this.description = '거대한 젖병 방어막! 모두 밀어낸다!';
                break;
        }
    }
}
