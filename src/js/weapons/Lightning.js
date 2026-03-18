// Lightning: 번개 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { LightningEffect } from '../entities/projectiles/LightningEffect.js';

export class Lightning extends Weapon {
    constructor() {
        super({
            name: '번개',
            damage: 30,       // 25 → 30
            cooldown: 1800,   // 2000 → 1800
            spriteKey: 'lightning',
            description: '랜덤 적에게 번개를 내려칩니다.',
        });

        this.strikeCount = 1;
        this.chainCount = 0;
        this.chainDamageRatio = 0.7;
        this.chainRadius = 150;
    }

    attack(game) {
        if (!game.player || !game.enemies || game.enemies.length === 0) return;

        const aliveEnemies = game.enemies.filter(e => e.alive);
        if (aliveEnemies.length === 0) return;

        const hitSet = new Set();

        for (let i = 0; i < this.strikeCount; i++) {
            const candidates = aliveEnemies.filter(e => !hitSet.has(e));
            if (candidates.length === 0) break;

            const target = candidates[Math.floor(Math.random() * candidates.length)];
            hitSet.add(target);

            const damage = this.getEffectiveDamage(game);
            target.takeDamage(damage, game);

            const effect = new LightningEffect(target.x, target.y);
            game.projectiles.push(effect);

            if (this.chainCount > 0) {
                this.applyChain(game, target, damage, hitSet);
            }
        }
    }

    applyChain(game, origin, prevDamage, hitSet) {
        let currentX = origin.x;
        let currentY = origin.y;
        let currentDamage = prevDamage;

        for (let c = 0; c < this.chainCount; c++) {
            currentDamage *= this.chainDamageRatio;

            let closestEnemy = null;
            let closestDist = Infinity;

            for (const enemy of game.enemies) {
                if (!enemy.alive || hitSet.has(enemy)) continue;
                const dx = enemy.x - currentX;
                const dy = enemy.y - currentY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= this.chainRadius && dist < closestDist) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            }

            if (!closestEnemy) break;

            hitSet.add(closestEnemy);
            closestEnemy.takeDamage(Math.round(currentDamage), game);

            const effect = new LightningEffect(closestEnemy.x, closestEnemy.y, {
                color: '#80d8ff',
            });
            game.projectiles.push(effect);

            currentX = closestEnemy.x;
            currentY = closestEnemy.y;
        }
    }

    onUpgrade() {
        switch (this.level) {
            case 2:
                this.damage = 40;
                this.description = '데미지가 크게 증가합니다.';
                break;
            case 3:
                this.strikeCount = 2;
                this.chainCount = 1;
                this.description = '2명 동시 공격 + 체인 1회.';
                break;
            case 4:
                this.strikeCount = 3;
                this.chainCount = 2;
                this.cooldown = 1400;
                this.description = '3명 공격 + 체인 2회, 쿨다운 감소.';
                break;
            case 5:
                this.strikeCount = 4;
                this.chainCount = 3;
                this.damage = 50;
                this.description = '4명 공격 + 체인 3회! 천벌!';
                break;
        }
    }
}
