import { Entity } from '../core/Entity.js';
import {
    PLAYER_BASE_HP,
    PLAYER_BASE_SPEED,
    PLAYER_SIZE,
    PLAYER_INVINCIBLE_TIME,
    WORLD_SIZE,
    EXP_PICKUP_RADIUS,
    MAX_EQUIPMENT,
} from '../data/Constants.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, 'player');

        this.hp = PLAYER_BASE_HP;
        this.maxHp = PLAYER_BASE_HP;
        this.speed = PLAYER_BASE_SPEED;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 6; // level * 3 + 3

        this.weapons = [];
        this.maxWeapons = 4;

        // Equipment (패시브 장비)
        this.equipment = [];
        this.maxEquipment = MAX_EQUIPMENT;

        // Upgrade multipliers
        this.attackMultiplier = 1;
        this.speedMultiplier = 1;
        this.attackSpeedMultiplier = 1;
        this.projectileSizeMultiplier = 1;
        this.projectileCountBonus = 0;

        // Equipment-based stats
        this.damageReduction = 0;
        this.expMultiplier = 1;
        this.hpRegen = 0;
        this.knockbackMultiplier = 1;
        this.dropRateBonus = 0;
        this.projectileSpeedMultiplier = 1;
        this.cooldownReduction = 0;

        // Invincibility
        this.invincibleTimer = 0;

        // Stats
        this.killCount = 0;

        // Exp pickup
        this.expPickupRadius = EXP_PICKUP_RADIUS;
    }

    update(dt, game) {
        // Movement
        const movement = game.input.getMovement();
        const moveSpeed = this.speed * this.speedMultiplier * 60 * dt;

        this.x += movement.dx * moveSpeed;
        this.y += movement.dy * moveSpeed;

        // Clamp to world bounds
        const halfSize = this.width / 2;
        this.x = Math.max(halfSize, Math.min(WORLD_SIZE - halfSize, this.x));
        this.y = Math.max(halfSize, Math.min(WORLD_SIZE - halfSize, this.y));

        // Update invincibility timer
        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer < 0) {
                this.invincibleTimer = 0;
            }
        }

        // HP Regeneration
        if (this.hpRegen > 0 && this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + this.hpRegen * dt);
        }

        // Fire all weapons
        for (const weapon of this.weapons) {
            weapon.update(dt, game);
        }
    }

    render(ctx, camera) {
        // Flash effect when invincible
        if (this.invincibleTimer > 0) {
            this.opacity = Math.sin(this.invincibleTimer * 20) > 0 ? 1 : 0.3;
        } else {
            this.opacity = 1;
        }

        super.render(ctx, camera);

        // Draw HP bar above the player
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        const barWidth = this.width + 8;
        const barHeight = 4;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.height / 2 - 8;

        // Background
        ctx.fillStyle = '#424242';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // HP fill
        const hpRatio = this.hp / this.maxHp;
        ctx.fillStyle = hpRatio > 0.5 ? '#4caf50' : hpRatio > 0.25 ? '#ff9800' : '#ef5350';
        ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0) return false;

        // 갑옷 등 데미지 감소 적용
        const reducedAmount = amount * (1 - Math.min(0.8, this.damageReduction));
        this.hp -= reducedAmount;
        if (this.hp < 0) this.hp = 0;

        this.invincibleTimer = PLAYER_INVINCIBLE_TIME / 1000;
        return true;
    }

    addExp(amount) {
        // 경험치 배율 적용
        const actualAmount = Math.round(amount * this.expMultiplier);
        this.exp += actualAmount;

        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            this.expToNext = this.level * 3 + 3;
            this._pendingLevelUp = true;
        }
    }

    onLevelUp(game) {
        if (this._pendingLevelUp) {
            this._pendingLevelUp = false;
            if (game.levelUpSystem) {
                game.levelUpSystem.showChoices(game);
            }
        }
    }

    addWeapon(weapon) {
        const existing = this.getWeaponOfType(weapon.constructor);
        if (existing) {
            existing.levelUp();
            return true;
        }

        if (this.weapons.length < this.maxWeapons) {
            weapon.owner = this;
            this.weapons.push(weapon);
            return true;
        }

        return false;
    }

    // 장비 추가
    addEquipment(equipment) {
        // 같은 타입 장비가 있으면 레벨업
        const existing = this.equipment.find(e => e.constructor === equipment.constructor);
        if (existing) {
            existing.levelUp(this);
            return true;
        }

        if (this.equipment.length < this.maxEquipment) {
            this.equipment.push(equipment);
            equipment.apply(this);
            return true;
        }

        return false;
    }

    hasEquipmentType(type) {
        return this.equipment.some(e => e instanceof type);
    }

    getEquipmentOfType(type) {
        return this.equipment.find(e => e instanceof type) || null;
    }

    hasWeaponType(type) {
        return this.weapons.some(w => w instanceof type);
    }

    getWeaponOfType(type) {
        return this.weapons.find(w => w instanceof type) || null;
    }
}
