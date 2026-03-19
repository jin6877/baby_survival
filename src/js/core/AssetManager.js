// AssetManager: 스프라이트 이미지를 중앙에서 관리

const SPRITE_CONFIG = {
    // === 플레이어 (Player.js에서 직접 로드) ===
    player: { src: null, fallbackColor: '#4fc3f7', fallbackShape: 'circle' },

    // === 적 (병균 테마) ===
    zombie: { src: 'images/enemy_normal/germ/enemy_germ.png', fallbackColor: '#6a994e', fallbackShape: 'circle' },
    zombieEffect: { src: 'images/enemy_normal/germ/germ_effect.png', fallbackColor: '#6a994e', fallbackShape: 'circle' },
    bat: { src: 'images/enemy_normal/flu_b/enemy_flu_b.png', fallbackColor: '#9b59b6', fallbackShape: 'triangle' },
    batEffect: { src: 'images/enemy_normal/flu_b/flu_b_effect.png', fallbackColor: '#9b59b6', fallbackShape: 'circle' },
    skeleton: { src: 'images/enemy_normal/flu_a/enemy_flu_a.png', fallbackColor: '#e0e0e0', fallbackShape: 'circle' },
    skeletonEffect: { src: 'images/enemy_normal/flu_a/flu_a_effect.png', fallbackColor: '#e0e0e0', fallbackShape: 'circle' },
    ghost: { src: 'images/enemy_normal/cold_virus/enemy_cold_virus.png', fallbackColor: '#80cbc4', fallbackShape: 'diamond' },
    ghostEffect: { src: 'images/enemy_normal/cold_virus/cold_virus_effect.png', fallbackColor: '#80cbc4', fallbackShape: 'circle' },
    knight: { src: 'images/enemy_normal/cavity/enemy_cavity_germ.png', fallbackColor: '#78909c', fallbackShape: 'rect' },
    knightEffect: { src: 'images/enemy_normal/cavity/cavity_effect.png', fallbackColor: '#78909c', fallbackShape: 'circle' },
    knightAttack1: { src: 'images/enemy_normal/cavity/cavity_attack_frame_1.png', fallbackColor: '#78909c', fallbackShape: 'circle' },
    knightAttack2: { src: 'images/enemy_normal/cavity/cavity_attack_frame_2.png', fallbackColor: '#78909c', fallbackShape: 'circle' },
    knightAttack3: { src: 'images/enemy_normal/cavity/cavity_attack_frame_3.png', fallbackColor: '#78909c', fallbackShape: 'circle' },
    knightAttack4: { src: 'images/enemy_normal/cavity/cavity_attack_frame_4.png', fallbackColor: '#78909c', fallbackShape: 'circle' },
    slime: { src: 'images/enemy_normal/stomach_bug/enemy_stomach_bug.png', fallbackColor: '#66bb6a', fallbackShape: 'circle' },

    // === 보스 ===
    giantSkeleton: { src: 'images/enemy_boss/snack_bag/boss_snack_bag.png', fallbackColor: '#fafafa', fallbackShape: 'circle' },
    giantSkeletonEffect: { src: 'images/enemy_boss/snack_bag/boss_snack_crumbs.png', fallbackColor: '#fafafa', fallbackShape: 'circle' },
    necromancer: { src: 'images/enemy_boss/candy_monster/boss_candy_monster.png', fallbackColor: '#7b1fa2', fallbackShape: 'diamond' },
    necromancerEffect: { src: 'images/enemy_boss/candy_monster/candy_stars.png', fallbackColor: '#7b1fa2', fallbackShape: 'circle' },
    darkKnight: { src: 'images/enemy_boss/smartphone/boss_smartphone.png', fallbackColor: '#37474f', fallbackShape: 'rect' },
    darkKnightEffect: { src: 'images/enemy_boss/smartphone/boss_phone_speed.png', fallbackColor: '#37474f', fallbackShape: 'circle' },
    lich: { src: 'images/enemy_boss/ice_cream/boss_ice_cream.png', fallbackColor: '#00bcd4', fallbackShape: 'diamond' },
    lichEffect: { src: 'images/enemy_boss/ice_cream/boss_ice_cream_drip.png', fallbackColor: '#00bcd4', fallbackShape: 'circle' },
    vampireLord: { src: 'images/enemy_boss/old_tv/boss_old_tv.png', fallbackColor: '#b71c1c', fallbackShape: 'diamond' },
    vampireLordEffect: { src: 'images/enemy_boss/old_tv/boss_tv_lightning.png', fallbackColor: '#b71c1c', fallbackShape: 'circle' },

    // === 무기 투사체 ===
    daggerProjectile: { src: 'images/weapon_projectiles/weapon_mom_hand.png', fallbackColor: '#ffb0b0', fallbackShape: 'circle' },
    axeProjectile: { src: 'images/weapon_projectiles/weapon_dad_slipper.png', fallbackColor: '#8d6e63', fallbackShape: 'triangle' },
    magicProjectile: { src: 'images/weapon_projectiles/weapon_mom_nagging.png', fallbackColor: '#f48fb1', fallbackShape: 'circle' },
    crossProjectile: { src: 'images/weapon_projectiles/weapon_diaper.png', fallbackColor: '#e0e0e0', fallbackShape: 'cross' },
    momTearsEffect: { src: 'images/weapon_projectiles/effect_mom_tears.png', fallbackColor: '#64b5f6', fallbackShape: 'circle' },
    bottleShieldEffect: { src: 'images/weapon_projectiles/effect_bottle_shield.png', fallbackColor: '#fff8e6', fallbackShape: 'circle' },
    dadVoiceEffect: { src: 'images/weapon_projectiles/effect_dad_voice.png', fallbackColor: '#ffa000', fallbackShape: 'circle' },
    toyBombEffect: { src: 'images/weapon_projectiles/effect_toy_bomb.png', fallbackColor: '#ff6d00', fallbackShape: 'circle' },
    // 무기 픽업용 이미지
    weaponMomTears: { src: 'images/weapon_projectiles/weapon_mom_tears.png', fallbackColor: '#64b5f6', fallbackShape: 'circle' },
    weaponBottle: { src: 'images/weapon_projectiles/weapon_bottle.png', fallbackColor: '#fff8e6', fallbackShape: 'circle' },
    weaponDadVoice: { src: 'images/weapon_projectiles/weapon_dad_voice.png', fallbackColor: '#ffa000', fallbackShape: 'circle' },
    weaponToyBomb: { src: 'images/weapon_projectiles/weapon_toy_bomb.png', fallbackColor: '#ff6d00', fallbackShape: 'circle' },
    ghostBullet: { src: 'images/enemy_normal/cold_virus/ghost_bullet.png', fallbackColor: '#80cbc4', fallbackShape: 'circle' },

    // === 무기 픽업 ===
    weaponPickup: { src: null, fallbackColor: '#76ff03', fallbackShape: 'rect' },

    // === 장비 픽업 ===
    equipmentPickup: { src: null, fallbackColor: '#ffd740', fallbackShape: 'diamond' },

    // === 아이템 ===
    expGemSmall: { src: 'images/field_items/item_star_small.png', fallbackColor: '#7c4dff', fallbackShape: 'diamond' },
    expGemLarge: { src: 'images/field_items/item_star_large.png', fallbackColor: '#e040fb', fallbackShape: 'diamond' },
    meat: { src: 'images/field_items/item_milk.png', fallbackColor: '#e3f2fd', fallbackShape: 'rect' },
    magnet: { src: 'images/field_items/item_magnet.png', fallbackColor: '#ff5252', fallbackShape: 'triangle' },
    bomb: { src: 'images/field_items/item_bomb.png', fallbackColor: '#ff6d00', fallbackShape: 'circle' },
};

export class AssetManager {
    constructor() {
        this.images = {};
        this.loaded = false;
    }

    async loadAll() {
        const promises = [];
        for (const [key, config] of Object.entries(SPRITE_CONFIG)) {
            if (config.src) {
                promises.push(this._loadImage(key, config.src));
            }
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
        this.loaded = true;
    }

    _loadImage(key, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${key} (${src}), using fallback`);
                resolve();
            };
            img.src = src;
        });
    }

    drawSprite(ctx, key, x, y, width, height, rotation = 0) {
        const img = this.images[key];
        if (img) {
            ctx.save();
            ctx.translate(x, y);
            if (rotation) ctx.rotate(rotation);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
            return;
        }

        const config = SPRITE_CONFIG[key];
        if (!config) {
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(x, y, width / 2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        ctx.save();
        ctx.translate(x, y);
        if (rotation) ctx.rotate(rotation);
        ctx.fillStyle = config.fallbackColor;

        const w = width;
        const h = height;
        const r = w / 2;

        switch (config.fallbackShape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rect':
                ctx.fillRect(-w / 2, -h / 2, w, h);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -r);
                ctx.lineTo(r, r);
                ctx.lineTo(-r, r);
                ctx.closePath();
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -r);
                ctx.lineTo(r, 0);
                ctx.lineTo(0, r);
                ctx.lineTo(-r, 0);
                ctx.closePath();
                ctx.fill();
                break;
            case 'cross': {
                const t = w * 0.2;
                ctx.fillRect(-t, -r, t * 2, h);
                ctx.fillRect(-r, -t, w, t * 2);
                break;
            }
        }

        ctx.restore();
    }

    hasSprite(key) {
        return !!this.images[key];
    }

    async replaceSprite(key, newSrc) {
        await this._loadImage(key, newSrc);
    }

    static registerSprite(key, config) {
        SPRITE_CONFIG[key] = config;
    }
}

export const assets = new AssetManager();
