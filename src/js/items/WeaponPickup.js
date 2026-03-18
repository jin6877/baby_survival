import { Item } from './Item.js';
import { WeaponRegistry } from '../data/WeaponRegistry.js';

export class WeaponPickup extends Item {
    constructor(x, y, weaponKey) {
        super(x, y, {
            spriteKey: 'weaponPickup',
            size: 20,
            duration: 30000, // 30초 (이전 20초)
        });

        this.weaponKey = weaponKey;
    }

    onPickup(player, game) {
        const weaponData = WeaponRegistry.get(this.weaponKey);
        if (!weaponData) return;

        // 같은 타입의 무기가 있으면 레벨업
        const existingWeapon = player.weapons.find(
            w => w.constructor === weaponData.weaponClass
        );

        if (existingWeapon) {
            existingWeapon.levelUp();
            return;
        }

        // 빈 슬롯이 있으면 추가
        if (player.weapons.length < player.maxWeapons) {
            const weapon = WeaponRegistry.create(this.weaponKey);
            if (weapon) {
                player.addWeapon(weapon);
            }
        } else {
            // 무기 슬롯이 다 찬 경우 - 교체 UI 표시 (일시정지됨)
            if (game.showWeaponSwapUI) {
                game.showWeaponSwapUI(this.weaponKey);
            }
        }
    }

    render(ctx, camera) {
        if (!this.alive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Off-screen culling
        if (screenX < -this.width || screenX > camera.width + this.width ||
            screenY < -this.height || screenY > camera.height + this.height) {
            return;
        }

        // 무기 픽업 글로우
        ctx.save();
        ctx.shadowColor = '#76ff03';
        ctx.shadowBlur = 10;

        // 아이콘
        ctx.fillStyle = '#76ff03';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('W', screenX, screenY);

        ctx.restore();

        // 무기 이름 표시
        const weaponData = WeaponRegistry.get(this.weaponKey);
        const name = weaponData ? weaponData.name : this.weaponKey;

        ctx.fillStyle = '#76ff03';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(name, screenX, screenY + this.height / 2 + 12);
    }
}
