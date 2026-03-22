import { Item } from './Item.js';
import { WeaponRegistry } from '../data/WeaponRegistry.js';
import { assets } from '../core/AssetManager.js';

// 무기 키 → 픽업 표시용 스프라이트 키 매핑
const WEAPON_SPRITE_MAP = {
    dagger: 'daggerProjectile',
    axe: 'axeProjectile',
    magicWand: 'magicProjectile',
    cross: 'crossProjectile',
    lightning: 'weaponMomTears',
    holyWater: 'weaponDadVoice',
    garlic: 'weaponBottle',
    firebomb: 'weaponToyBomb',
};

export class WeaponPickup extends Item {
    constructor(x, y, weaponKey) {
        super(x, y, {
            spriteKey: 'weaponPickup',
            size: 52,
            duration: 30000,
        });

        this.weaponKey = weaponKey;
    }

    onPickup(player, game) {
        const weaponData = WeaponRegistry.get(this.weaponKey);
        if (!weaponData) return;

        const existingWeapon = player.weapons.find(
            w => w.constructor === weaponData.weaponClass
        );

        if (existingWeapon) {
            existingWeapon.levelUp();
            return;
        }

        if (player.weapons.length < player.maxWeapons) {
            const weapon = WeaponRegistry.create(this.weaponKey);
            if (weapon) {
                player.addWeapon(weapon);
            }
        } else {
            if (game.showWeaponSwapUI) {
                game.showWeaponSwapUI(this.weaponKey);
            }
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        ctx.save();
        ctx.shadowColor = '#76ff03';
        ctx.shadowBlur = 6;

        // 배경 원
        ctx.fillStyle = 'rgba(118, 255, 3, 0.5)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // 무기 투사체 이미지가 있으면 이미지로 표시
        const spriteKey = WEAPON_SPRITE_MAP[this.weaponKey];
        if (spriteKey && assets.hasSprite(spriteKey)) {
            const imgSize = this.width * 0.7;
            assets.drawSprite(ctx, spriteKey, screenX, screenY, imgSize, imgSize);
        } else {
            // 이미지 없는 무기는 이모지/이름 첫글자
            const weaponData = WeaponRegistry.get(this.weaponKey);
            const name = weaponData ? weaponData.name : '?';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(name.charAt(0), screenX, screenY);
        }

        ctx.restore();

        // 무기 이름 표시
        const weaponData = WeaponRegistry.get(this.weaponKey);
        const name = weaponData ? weaponData.name : this.weaponKey;

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeText(name, screenX, screenY + this.height / 2 + 14);
        ctx.fillText(name, screenX, screenY + this.height / 2 + 14);
    }
}
