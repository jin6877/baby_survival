// EquipmentPickup: 필드에서 주울 수 있는 장비 아이템
import { Item } from './Item.js';
import { EquipmentRegistry } from '../data/EquipmentRegistry.js';

export class EquipmentPickup extends Item {
    constructor(x, y, equipmentKey) {
        super(x, y, {
            spriteKey: 'equipmentPickup',
            size: 22,
            duration: 30000, // 30초 후 소멸
        });

        this.equipmentKey = equipmentKey;
    }

    onPickup(player, game) {
        const equipData = EquipmentRegistry.get(this.equipmentKey);
        if (!equipData) return;

        // 같은 타입의 장비가 있으면 레벨업
        const existing = player.equipment.find(
            e => e.constructor === equipData.equipmentClass
        );

        if (existing) {
            existing.levelUp(player);
            return;
        }

        // 새 장비 추가 (슬롯이 빈 경우)
        if (player.equipment.length < player.maxEquipment) {
            const equipment = EquipmentRegistry.create(this.equipmentKey);
            if (equipment) {
                player.addEquipment(equipment);
            }
        }
        // 장비 슬롯이 다 찬 경우 - 자동으로 무시 (무기와 달리 교체 UI 없음)
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

        // 장비 아이템은 금색 글로우
        ctx.save();
        ctx.shadowColor = '#ffd740';
        ctx.shadowBlur = 12;

        // 아이콘 배경 원
        const equipData = EquipmentRegistry.get(this.equipmentKey);
        const color = equipData ? equipData.color : '#ffd740';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // 아이콘 텍스트
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = equipData ? equipData.icon : '?';
        ctx.fillText(icon, screenX, screenY);

        ctx.restore();

        // 이름 표시
        const name = equipData ? equipData.name : this.equipmentKey;
        ctx.fillStyle = '#ffd740';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(name, screenX, screenY + this.height / 2 + 12);
    }
}
