// Lightning: 번개 무기 - 강화 버전
import { Weapon } from './Weapon.js';
import { LightningEffect } from '../entities/projectiles/LightningEffect.js';

export class Lightning extends Weapon {
    constructor() {
        super({
            name: '엄마 눈물',
            damage: 40,
            cooldown: 1100,
            spriteKey: 'weaponMomTears',
            description: '엄마의 눈물이 적에게 즉발 데미지를 줍니다!',
        });

        this.strikeCount = 1;
        this.chainCount = 0;
        this.chainDamageRatio = 0.7;
        this.chainRadius = 200;
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
                this.damage = 55;
                this.strikeCount = 2;
                this.description = '엄마 눈물 2방! 더 아프게!';
                break;
            case 3:
                this.damage = 70;
                this.strikeCount = 3;
                this.chainCount = 1;
                this.cooldown = 900;
                this.description = '3명에게 눈물 + 체인!';
                break;
            case 4:
                this.damage = 85;
                this.strikeCount = 4;
                this.chainCount = 2;
                this.cooldown = 700;
                this.description = '4명 공격 + 체인 2회!';
                break;
            case 5:
                this.damage = 100;
                this.strikeCount = 5;
                this.chainCount = 3;
                this.cooldown = 550;
                this.description = '엄마의 대폭발 눈물! 체인 3회!';
                break;
        }
    }
}
