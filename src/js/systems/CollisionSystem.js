// CollisionSystem: 모든 충돌 감지 및 처리
export class CollisionSystem {
    constructor(game) {
        this.game = game;
    }

    update() {
        const game = this.game;
        if (!game.player || !game.player.alive) return;

        this._checkPlayerVsEnemies(game);
        this._checkProjectilesVsEnemies(game);
        this._checkPlayerVsItems(game);
        this._checkPlayerVsEnemyBullets(game);
    }

    _checkPlayerVsEnemies(game) {
        const player = game.player;
        if (player.invincibleTimer > 0) return;

        for (const enemy of game.enemies) {
            if (!enemy.alive) continue;

            if (player.collidesWith(enemy)) {
                player.takeDamage(enemy.damage);

                // 적이 부딪힌 후 넉백 + 잠시 멈춤 (0.5초)
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const knockbackForce = 300;
                enemy.knockbackX = (dx / dist) * knockbackForce;
                enemy.knockbackY = (dy / dist) * knockbackForce;
                enemy.knockbackTimer = 0.5;

                break;
            }
        }
    }

    _checkProjectilesVsEnemies(game) {
        const projectiles = game.projectiles;
        const enemies = game.enemies;
        if (!projectiles || !enemies) return;

        for (let i = projectiles.length - 1; i >= 0; i--) {
            const proj = projectiles[i];
            if (!proj.alive) continue;

            // Skip AreaEffects - they handle their own damage
            if (proj.radius !== undefined && proj.dealDamage) continue;

            // Skip visual-only effects (LightningEffect 등)
            if (proj.isVisualEffect) continue;

            for (const enemy of enemies) {
                if (!enemy.alive) continue;

                // Skip already-hit enemies for piercing projectiles
                if (proj.piercing && proj.hitEntities && proj.hitEntities.has(enemy)) {
                    continue;
                }

                if (proj.collidesWith(enemy)) {
                    const knockbackAngle = Math.atan2(
                        enemy.y - proj.y,
                        enemy.x - proj.x
                    );
                    enemy.takeDamage(proj.damage, knockbackAngle, game);

                    if (proj.piercing) {
                        // Track hit enemy to avoid double-hit
                        if (!proj.hitEntities) {
                            proj.hitEntities = new Set();
                        }
                        proj.hitEntities.add(enemy);
                    } else {
                        // Destroy non-piercing projectile
                        proj.alive = false;
                        break;
                    }
                }
            }
        }
    }

    _checkPlayerVsItems(game) {
        const player = game.player;
        const items = game.items;
        if (!items) return;

        const pickupRadius = player.expPickupRadius || 50;

        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (!item.alive) continue;

            const dist = player.distanceTo(item);

            if (dist < pickupRadius || player.collidesWith(item)) {
                item.onPickup(player, game);
                item.alive = false;
            }
        }
    }

    _checkPlayerVsEnemyBullets(game) {
        const player = game.player;
        const bullets = game.enemyBullets;
        if (!bullets || player.invincibleTimer > 0) return;

        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (!bullet.alive) continue;

            if (player.collidesWith(bullet)) {
                player.takeDamage(bullet.damage);
                bullet.alive = false;
                break; // Player becomes invincible after taking damage
            }
        }
    }
}
