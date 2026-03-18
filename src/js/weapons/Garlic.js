// Garlic: 마늘 무기 - 강화 버전
import { Weapon } from './Weapon.js';

export class Garlic extends Weapon {
    constructor() {
        super({
            name: '마늘',
            damage: 8,
            cooldown: 1000,
            spriteKey: 'garlic',
            description: '주변 적에게 데미지를 주고 밀어냅니다.',
        });

        this.radius = 70;
        this.knockbackForce = 6;

        this.pulseTimer = 0;
        this.pulseDuration = 300;
        this.isPulsing = false;
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
        const alpha = 0.4 * (1 - progress);

        ctx.globalAlpha = alpha;

        ctx.fillStyle = 'rgba(200, 230, 150, 0.3)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(180, 220, 100, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 12;
                this.radius = 85;
                this.description = '데미지 증가, 범위 확장.';
                break;
            case 3:
                this.cooldown = 800;
                this.knockbackForce = 8;
                this.description = '빠른 공격, 강한 넉백.';
                break;
            case 4:
                this.radius = 110;
                this.damage = 16;
                this.description = '넓은 범위, 높은 데미지.';
                break;
            case 5:
                this.radius = 140;
                this.knockbackForce = 14;
                this.damage = 22;
                this.description = '거대한 마늘 오라! 모든 것을 밀어낸다!';
                break;
        }
    }
}
