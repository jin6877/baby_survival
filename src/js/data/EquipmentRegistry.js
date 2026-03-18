// EquipmentRegistry: 장비 등록 및 생성 관리
import { MagnetAmulet } from '../equipment/MagnetAmulet.js';
import { Armor } from '../equipment/Armor.js';
import { SwiftBoots } from '../equipment/SwiftBoots.js';
import { AttackRing } from '../equipment/AttackRing.js';
import { LifeNecklace } from '../equipment/LifeNecklace.js';
import { TimeClock } from '../equipment/TimeClock.js';
import { SharpshooterGlass } from '../equipment/SharpshooterGlass.js';
import { LuckyClover } from '../equipment/LuckyClover.js';

const registry = new Map();

export const EquipmentRegistry = {
    register(key, config) {
        registry.set(key, config);
    },

    get(key) {
        return registry.get(key) || null;
    },

    create(key) {
        const config = registry.get(key);
        if (!config || !config.equipmentClass) {
            console.warn(`EquipmentRegistry: unknown equipment key "${key}"`);
            return null;
        }
        return new config.equipmentClass();
    },

    has(key) {
        return registry.has(key);
    },

    keys() {
        return Array.from(registry.keys());
    },

    getAll() {
        return Array.from(registry.entries()).map(([key, config]) => ({
            key,
            ...config,
        }));
    },

    getRandomKey() {
        const allKeys = Array.from(registry.keys());
        return allKeys[Math.floor(Math.random() * allKeys.length)];
    },
};

// 모든 장비 등록
EquipmentRegistry.register('magnetAmulet', { name: '자석 부적', equipmentClass: MagnetAmulet, description: '경험치 흡수 범위 증가', icon: 'M', color: '#ff5252' });
EquipmentRegistry.register('armor', { name: '갑옷', equipmentClass: Armor, description: '받는 데미지 감소', icon: 'A', color: '#78909c' });
EquipmentRegistry.register('swiftBoots', { name: '민첩의 장화', equipmentClass: SwiftBoots, description: '이동속도 증가', icon: 'B', color: '#4fc3f7' });
EquipmentRegistry.register('attackRing', { name: '공격의 반지', equipmentClass: AttackRing, description: '공격력 증가', icon: 'R', color: '#ff7043' });
EquipmentRegistry.register('lifeNecklace', { name: '생명의 목걸이', equipmentClass: LifeNecklace, description: '최대 HP + HP 재생', icon: 'H', color: '#e91e63' });
EquipmentRegistry.register('timeClock', { name: '시간의 시계', equipmentClass: TimeClock, description: '공격속도 증가', icon: 'T', color: '#ab47bc' });
EquipmentRegistry.register('sharpshooterGlass', { name: '명사수의 안경', equipmentClass: SharpshooterGlass, description: '투사체 크기 증가', icon: 'G', color: '#26c6da' });
EquipmentRegistry.register('luckyClover', { name: '행운의 클로버', equipmentClass: LuckyClover, description: '경험치 획득 증가', icon: 'L', color: '#66bb6a' });
