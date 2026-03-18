// WeaponRegistry: 무기 등록 및 생성 관리
import { Dagger } from '../weapons/Dagger.js';
import { HolyWater } from '../weapons/HolyWater.js';
import { Axe } from '../weapons/Axe.js';
import { MagicWand } from '../weapons/MagicWand.js';
import { Cross } from '../weapons/Cross.js';
import { Lightning } from '../weapons/Lightning.js';
import { Garlic } from '../weapons/Garlic.js';
import { Firebomb } from '../weapons/Firebomb.js';

const registry = new Map();

export const WeaponRegistry = {
    register(key, config) {
        // config can be { name, weaponClass, description } or just a class
        if (typeof config === 'function') {
            const instance = new config();
            registry.set(key, {
                name: instance.name,
                weaponClass: config,
                description: instance.description,
            });
        } else {
            registry.set(key, config);
        }
    },

    get(key) {
        return registry.get(key) || null;
    },

    create(key) {
        const config = registry.get(key);
        if (!config || !config.weaponClass) {
            console.warn(`WeaponRegistry: unknown weapon key "${key}"`);
            return null;
        }

        return new config.weaponClass();
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

    getRandomWeaponKey() {
        const allKeys = Array.from(registry.keys());
        return allKeys[Math.floor(Math.random() * allKeys.length)];
    },
};

// 모든 무기 등록
WeaponRegistry.register('dagger', { name: '단검', weaponClass: Dagger, description: '가장 가까운 적에게 단검을 발사합니다.' });
WeaponRegistry.register('holyWater', { name: '성수', weaponClass: HolyWater, description: '플레이어 주변에 성수 범위 효과를 생성합니다.' });
WeaponRegistry.register('axe', { name: '도끼', weaponClass: Axe, description: '위로 올라갔다 내려오는 도끼를 던집니다.' });
WeaponRegistry.register('magicWand', { name: '마법봉', weaponClass: MagicWand, description: '랜덤 적에게 유도 마법 투사체를 발사합니다.' });
WeaponRegistry.register('cross', { name: '십자가', weaponClass: Cross, description: '부메랑처럼 돌아오는 십자가를 발사합니다.' });
WeaponRegistry.register('lightning', { name: '번개', weaponClass: Lightning, description: '랜덤 적에게 번개를 내려칩니다.' });
WeaponRegistry.register('garlic', { name: '마늘', weaponClass: Garlic, description: '주변 적에게 데미지를 주고 밀어냅니다.' });
WeaponRegistry.register('firebomb', { name: '화염병', weaponClass: Firebomb, description: '플레이어 근처에 화염 지대를 생성합니다.' });
