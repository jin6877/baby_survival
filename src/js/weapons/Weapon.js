// Weapon: 모든 무기의 베이스 클래스
export class Weapon {
    constructor(config = {}) {
        this.name = config.name || 'Unknown';
        this.damage = config.damage || 10;
        this.cooldown = config.cooldown || 1000;
        this.spriteKey = config.spriteKey || null;
        this.description = config.description || '';

        this.level = 1;
        this.maxLevel = 5;
        this.timer = 0;
        this.owner = null;
    }

    update(dt, game) {
        this.timer -= dt * 1000; // dt in seconds, timer/cooldown in ms
        if (this.timer <= 0) {
            this.attack(game);
            const speedMult = game.player ? game.player.attackSpeedMultiplier : 1;
            const cdReduction = game.player ? (1 - Math.min(0.5, game.player.cooldownReduction)) : 1;
            this.timer = (this.cooldown * cdReduction) / speedMult;
        }
    }

    attack(game) {
        // 서브클래스에서 구현
    }

    upgrade() {
        if (this.level < this.maxLevel) {
            this.level++;
            this.onUpgrade();
        }
    }

    // Alias for compatibility with Player.addWeapon
    levelUp() {
        this.upgrade();
    }

    onUpgrade() {
        // 서브클래스에서 구현 - 레벨별 보너스 적용
    }

    getLevelDescription() {
        return `${this.name} Lv.${this.level}: ${this.description}`;
    }

    getEffectiveDamage(game) {
        const mult = game && game.player ? game.player.attackMultiplier : 1;
        return this.damage * mult;
    }
}
