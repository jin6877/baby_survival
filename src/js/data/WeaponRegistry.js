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
WeaponRegistry.register('dagger', { name: '엄마 손', weaponClass: Dagger, description: '가장 가까운 적에게 엄마 손을 날립니다.' });
WeaponRegistry.register('holyWater', { name: '아빠 목소리', weaponClass: HolyWater, description: '아빠의 우렁찬 목소리로 주변을 공격합니다.' });
WeaponRegistry.register('axe', { name: '아빠 슬리퍼', weaponClass: Axe, description: '아빠의 슬리퍼가 포물선을 그리며 날아갑니다!' });
WeaponRegistry.register('magicWand', { name: '엄마 잔소리', weaponClass: MagicWand, description: '엄마의 잔소리가 적을 추적합니다!' });
WeaponRegistry.register('cross', { name: '기저귀', weaponClass: Cross, description: '부메랑처럼 회전하며 돌아오는 기저귀!' });
WeaponRegistry.register('lightning', { name: '엄마 눈물', weaponClass: Lightning, description: '엄마의 눈물이 적에게 즉발 데미지!' });
WeaponRegistry.register('garlic', { name: '젖병 방어막', weaponClass: Garlic, description: '젖병의 힘으로 주변 적을 밀어냅니다!' });
WeaponRegistry.register('firebomb', { name: '장난감 폭탄', weaponClass: Firebomb, description: '장난감 폭탄으로 폭발 영역을 만듭니다!' });
