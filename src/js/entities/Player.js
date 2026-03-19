import { Entity } from '../core/Entity.js';
import {
    PLAYER_BASE_HP,
    PLAYER_BASE_SPEED,
    PLAYER_SIZE,
    PLAYER_INVINCIBLE_TIME,
    EXP_PICKUP_RADIUS,
    MAX_EQUIPMENT,
} from '../data/Constants.js';

// 성장 단계 정의
const GROWTH_STAGES = [
    { level: 1, name: '누워있는 아기', prefix: 'level1_baby_lying', hpBonus: 0, speed: 1.5, size: 90 },
    { level: 2, name: '기는 아기', prefix: 'level2_baby_crawling', hpBonus: 20, speed: 2.0, size: 100 },
    { level: 3, name: '일어서는 아기', prefix: 'level3_baby_wobble', hpBonus: 40, speed: 2.5, size: 110 },
    { level: 4, name: '유치원생', prefix: 'level4_kindergartener', hpBonus: 60, speed: 3.2, size: 120 },
    { level: 5, name: '초등학생', prefix: 'level5_elementary', hpBonus: 80, speed: 4.0, size: 130 },
];

// 레벨업에 필요한 킬 수 (누적)
const LEVEL_UP_KILLS = [0, 15, 50, 120, 250];

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, 'player');

        this.baseHp = 80;
        this.hp = this.baseHp;
        this.maxHp = this.baseHp;
        this.speed = 1.5;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 6;

        this.weapons = [];
        this.maxWeapons = 4;

        this.equipment = [];
        this.maxEquipment = MAX_EQUIPMENT;

        // Growth stage (character level)
        this.growthLevel = 1;
        this.growthKills = 0; // 성장 레벨용 킬 카운트
        this.growthKillsToNext = LEVEL_UP_KILLS[1];

        // Sprite animation
        this.direction = 'front'; // front, back, left, right
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.15; // seconds per frame
        this.isMoving = false;
        this.spriteImages = {}; // loaded images cache

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

        // Load sprites
        this._loadSprites();
        this._applyGrowthStage();
    }

    _loadSprites() {
        // 모든 성장 단계의 이미지를 미리 로드
        this.spriteImages = {};

        const imageFiles = [
            // Level 1
            'level1_baby_lying_front_b7f79d', 'level1_baby_lying_back_e39690',
            'level1_baby_lying_left_5378c2', 'level1_baby_lying_right_2c0d33',
            'level1_baby_lying_anim1_f704b7', 'level1_baby_lying_anim2_c35c79',
            'level1_baby_lying_anim3_2b4d8d', 'level1_baby_lying_anim4_497f8c',
            'level1_baby_lying_anim5_0fa731',
            // Level 2
            'level2_baby_crawling_front_7a176c', 'level2_baby_crawling_back_caafa1',
            'level2_baby_crawling_left_556bef', 'level2_baby_crawling_right_562b28',
            'level2_baby_crawling_anim1_2599d8', 'level2_baby_crawling_anim2_fe4089',
            'level2_baby_crawling_anim3_b36481', 'level2_baby_crawling_anim4_f077c5',
            'level2_baby_crawling_anim5_d8187c',
            // Level 3
            'level3_baby_wobble_front_884fd7', 'level3_baby_wobble_back_e574da',
            'level3_baby_wobble_left_6cce2c', 'level3_baby_wobble_right_1d8d83',
            'level3_baby_wobble_anim1_993b9a', 'level3_baby_wobble_anim2_673b53',
            'level3_baby_wobble_anim3_b36764', 'level3_baby_wobble_anim4_2722e6',
            'level3_baby_wobble_anim5_6b8e6b',
            // Level 4
            'level4_kindergartener_front_a10eda', 'level4_kindergartener_back_44fa71',
            'level4_kindergartener_left_2aadd5', 'level4_kindergartener_right_f81c3d',
            'level4_kindergartener_anim1_23508d', 'level4_kindergartener_anim2_66f592',
            'level4_kindergartener_anim3_a4d1ac', 'level4_kindergartener_anim4_e84464',
            // Level 5
            'level5_elementary_front_b86d1c', 'level5_elementary_back_a25dcf',
            'level5_elementary_left_5101fb', 'level5_elementary_right_92039b',
            'level5_elementary_anim1_3284ec', 'level5_elementary_anim2_39d388',
            'level5_elementary_anim3_5e86a8', 'level5_elementary_anim4_97e8da',
            'level5_elementary_anim5_2f2938', 'level5_elementary_anim6_e217d0',
        ];

        for (const name of imageFiles) {
            const img = new Image();
            img.src = `images/character/${name}.png`;
            this.spriteImages[name] = img;
        }
    }

    _getStageConfig() {
        return GROWTH_STAGES[this.growthLevel - 1] || GROWTH_STAGES[0];
    }

    _applyGrowthStage() {
        const stage = this._getStageConfig();
        this.maxHp = this.baseHp + stage.hpBonus;
        this.speed = stage.speed;
        this.width = stage.size;
        this.height = stage.size;
    }

    _getSpriteKey(type) {
        const stage = this._getStageConfig();
        const prefix = stage.prefix;
        // Find matching image key
        const keys = Object.keys(this.spriteImages);
        return keys.find(k => k.startsWith(`${prefix}_${type}`)) || null;
    }

    _getAnimFrames() {
        const stage = this._getStageConfig();
        const prefix = stage.prefix;
        const keys = Object.keys(this.spriteImages);
        return keys.filter(k => k.startsWith(`${prefix}_anim`)).sort();
    }

    update(dt, game) {
        // Movement
        const movement = game.input.getMovement();
        const moveSpeed = this.speed * this.speedMultiplier * 60 * dt;

        this.x += movement.dx * moveSpeed;
        this.y += movement.dy * moveSpeed;

        // 무한 월드 - 경계 없음

        // Direction tracking
        this.isMoving = (movement.dx !== 0 || movement.dy !== 0);
        if (this.isMoving) {
            if (Math.abs(movement.dx) > Math.abs(movement.dy)) {
                this.direction = movement.dx > 0 ? 'right' : 'left';
            } else {
                this.direction = movement.dy > 0 ? 'front' : 'back';
            }
        }

        // Animation
        if (this.isMoving) {
            this.animTimer += dt;
            if (this.animTimer >= this.animSpeed) {
                this.animTimer = 0;
                const frames = this._getAnimFrames();
                if (frames.length > 0) {
                    this.animFrame = (this.animFrame + 1) % frames.length;
                }
            }
        } else {
            this.animTimer = 0;
            this.animFrame = 0;
        }

        // Update invincibility timer
        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer < 0) this.invincibleTimer = 0;
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
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // 화면 밖 스킵
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // Flash effect when invincible
        if (this.invincibleTimer > 0 && Math.sin(this.invincibleTimer * 20) < 0) {
            ctx.globalAlpha = 0.3;
        }

        // Choose sprite
        let spriteKey = null;
        if (this.isMoving) {
            const frames = this._getAnimFrames();
            if (frames.length > 0) {
                spriteKey = frames[this.animFrame % frames.length];
            }
        }
        if (!spriteKey) {
            spriteKey = this._getSpriteKey(this.direction);
        }

        const img = spriteKey ? this.spriteImages[spriteKey] : null;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, screenX - this.width / 2, screenY - this.height / 2, this.width, this.height);
        } else {
            // Fallback
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        // Draw HP bar above the player
        const barWidth = this.width + 8;
        const barHeight = 4;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.height / 2 - 8;

        ctx.fillStyle = '#424242';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        const hpRatio = this.hp / this.maxHp;
        ctx.fillStyle = hpRatio > 0.5 ? '#4caf50' : hpRatio > 0.25 ? '#ff9800' : '#ef5350';
        ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0) return false;

        const reducedAmount = amount * (1 - Math.min(0.8, this.damageReduction));
        this.hp -= reducedAmount;
        if (this.hp < 0) this.hp = 0;

        this.invincibleTimer = PLAYER_INVINCIBLE_TIME / 1000;
        return true;
    }

    addExp(amount) {
        const actualAmount = Math.round(amount * this.expMultiplier);
        this.exp += actualAmount;

        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            this.expToNext = this.level * 3 + 3;
            this._pendingLevelUp = true;
        }
    }

    addKill() {
        this.killCount++;
        this.growthKills++;
        this._checkGrowthLevelUp();
    }

    _checkGrowthLevelUp() {
        if (this.growthLevel >= GROWTH_STAGES.length) return;

        const nextKills = LEVEL_UP_KILLS[this.growthLevel];
        if (nextKills !== undefined && this.growthKills >= nextKills) {
            this.growthLevel++;
            this._applyGrowthStage();
            // 레벨업 보너스: 체력 전체 회복
            this.hp = this.maxHp;
            // 다음 레벨 킬 목표 설정
            if (this.growthLevel < GROWTH_STAGES.length) {
                this.growthKillsToNext = LEVEL_UP_KILLS[this.growthLevel];
            } else {
                this.growthKillsToNext = this.growthKills; // max
            }
        }
    }

    getGrowthProgress() {
        if (this.growthLevel >= GROWTH_STAGES.length) return 1;
        const currentThreshold = this.growthLevel > 1 ? LEVEL_UP_KILLS[this.growthLevel - 1] : 0;
        const nextThreshold = LEVEL_UP_KILLS[this.growthLevel];
        const progress = (this.growthKills - currentThreshold) / (nextThreshold - currentThreshold);
        return Math.min(1, Math.max(0, progress));
    }

    getGrowthStageName() {
        return this._getStageConfig().name;
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

    addEquipment(equipment) {
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

    hasEquipmentType(type) { return this.equipment.some(e => e instanceof type); }
    getEquipmentOfType(type) { return this.equipment.find(e => e instanceof type) || null; }
    hasWeaponType(type) { return this.weapons.some(w => w instanceof type); }
    getWeaponOfType(type) { return this.weapons.find(w => w instanceof type) || null; }
}
