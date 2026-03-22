// EquipmentPickup: 필드에서 주울 수 있는 장비 아이템
import { Item } from './Item.js';
import { EquipmentRegistry } from '../data/EquipmentRegistry.js';

export class EquipmentPickup extends Item {
    constructor(x, y, equipmentKey) {
        super(x, y, {
            spriteKey: 'equipmentPickup',
            size: 52,
            duration: 30000,
        });

        this.equipmentKey = equipmentKey;

        // 장비 이미지 미리 로드
        const equipData = EquipmentRegistry.get(this.equipmentKey);
        if (equipData && equipData.equipmentClass) {
            const tempEquip = new equipData.equipmentClass();
            this._equipImage = tempEquip.image;
            this._equipIcon = tempEquip.icon;
        }
    }

    onPickup(player, game) {
        const equipData = EquipmentRegistry.get(this.equipmentKey);
        if (!equipData) return;

        const existing = player.equipment.find(
            e => e.constructor === equipData.equipmentClass
        );

        if (existing) {
            existing.levelUp(player);
            return;
        }

        if (player.equipment.length < player.maxEquipment) {
            const equipment = EquipmentRegistry.create(this.equipmentKey);
            if (equipment) {
                player.addEquipment(equipment);
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

        const equipData = EquipmentRegistry.get(this.equipmentKey);
        const color = equipData ? equipData.color : '#ffd740';

        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;

        // 배경 원
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 장비 이미지 표시
        if (this._equipImage && this._equipImage.complete && this._equipImage.naturalWidth > 0) {
            const imgSize = this.width * 0.7;
            ctx.drawImage(this._equipImage, screenX - imgSize / 2, screenY - imgSize / 2, imgSize, imgSize);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this._equipIcon || equipData?.icon || '?', screenX, screenY);
        }

        ctx.restore();

        // 이름 표시
        const name = equipData ? equipData.name : this.equipmentKey;
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeText(name, screenX, screenY + this.height / 2 + 14);
        ctx.fillText(name, screenX, screenY + this.height / 2 + 14);
    }
}
