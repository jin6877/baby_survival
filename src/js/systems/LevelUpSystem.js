// LevelUpSystem: 레벨업/라운드 시작 시 무기 + 장비 혼합 3개 선택
import { WeaponRegistry } from '../data/WeaponRegistry.js';
import { EquipmentRegistry } from '../data/EquipmentRegistry.js';

// 장비 스탯 공식 (레벨별 수치 계산, 절대 수치)
const EQUIP_FORMULAS = {
    armor: [
        { label: '피해감소', fn: lv => Math.round((0.15 + (lv - 1) * 0.10) * 100), format: 'flat' },
    ],
    attackRing: [
        { label: '공격력', fn: lv => Math.round((0.15 + (lv - 1) * 0.10) * 100), format: 'flat' },
    ],
    swiftBoots: [
        { label: '이동속도', fn: lv => Math.round((0.12 + (lv - 1) * 0.08) * 100), format: 'flat' },
    ],
    timeClock: [
        { label: '공격속도', fn: lv => Math.round((0.08 + (lv - 1) * 0.06) * 100), format: 'flat' },
    ],
    sharpshooterGlass: [
        { label: '투사체크기', fn: lv => Math.round((0.15 + (lv - 1) * 0.10) * 100), format: 'flat' },
    ],
    luckyClover: [
        { label: '경험치', fn: lv => Math.round((0.25 + (lv - 1) * 0.15) * 100), format: 'flat' },
    ],
    magnetAmulet: [
        { label: '흡수범위', fn: lv => 20 + (lv - 1) * 15, format: 'flat' },
    ],
    lifeNecklace: [
        { label: '최대HP', fn: lv => 20 + (lv - 1) * 15, format: 'flat' },
        { label: '재생', fn: lv => +(0.5 + (lv - 1) * 0.3).toFixed(1), format: 'decimal' },
    ],
};

function formatStatValue(val, format) {
    switch (format) {
        case 'flat': return '+' + val;
        case 'decimal': return '+' + val;
        case 'sec': return (val / 1000).toFixed(1) + '초';
        default: return '' + val;
    }
}

export class LevelUpSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.choices = [];
    }

    showChoices(roundStart = false) {
        this.game.paused = true;
        this.roundStart = roundStart;
        this.choices = this.generateChoices(roundStart);
        this.active = true;
    }

    // 무기의 주요 스탯 추출
    extractWeaponStats(weapon) {
        const stats = {};
        stats['공격력'] = weapon.damage;
        stats['쿨타임'] = weapon.cooldown;
        if (weapon.projectileCount !== undefined) stats['투사체'] = weapon.projectileCount;
        if (weapon.radius) stats['범위'] = weapon.radius;
        if (weapon.strikeCount) stats['대상수'] = weapon.strikeCount;
        if (weapon.bombCount) stats['폭탄수'] = weapon.bombCount;
        if (weapon.piercing) stats['관통'] = true;
        if (weapon.explodeOnHit) stats['폭발'] = true;
        if (weapon.chainCount) stats['체인'] = weapon.chainCount;
        return stats;
    }

    // 무기 스탯 비교 생성
    getWeaponStatChanges(weaponKey, existingWeapon) {
        const statChanges = [];
        const temp = WeaponRegistry.create(weaponKey);
        if (!temp) return statChanges;

        if (existingWeapon) {
            // 현재 레벨까지 시뮬레이션
            for (let i = 1; i < existingWeapon.level; i++) temp.upgrade();
            const cur = this.extractWeaponStats(temp);
            temp.upgrade();
            const next = this.extractWeaponStats(temp);

            // 변경된 스탯만 표시
            const allKeys = new Set([...Object.keys(cur), ...Object.keys(next)]);
            for (const key of allKeys) {
                const c = cur[key];
                const n = next[key];
                if (c !== n) {
                    if (key === '쿨타임') {
                        statChanges.push({ label: key, current: formatStatValue(c, 'sec'), next: formatStatValue(n, 'sec') });
                    } else if (typeof n === 'boolean') {
                        statChanges.push({ label: key, current: c ? '✓' : '✗', next: '✓' });
                    } else {
                        statChanges.push({ label: key, current: '' + (c || 0), next: '' + n });
                    }
                }
            }
        } else {
            // 새 무기: 기본 스탯 표시
            const base = this.extractWeaponStats(temp);
            for (const [key, val] of Object.entries(base)) {
                if (key === '쿨타임') {
                    statChanges.push({ label: key, value: formatStatValue(val, 'sec') });
                } else if (typeof val === 'boolean') {
                    if (val) statChanges.push({ label: key, value: '✓' });
                } else {
                    statChanges.push({ label: key, value: '' + val });
                }
            }
        }
        return statChanges;
    }

    // 장비 스탯 비교 생성
    getEquipStatChanges(equipKey, existingEquip) {
        const statChanges = [];
        const formulas = EQUIP_FORMULAS[equipKey];
        if (!formulas) return statChanges;

        if (existingEquip) {
            const curLv = existingEquip.level;
            const nextLv = curLv + 1;
            for (const f of formulas) {
                statChanges.push({
                    label: f.label,
                    current: formatStatValue(f.fn(curLv), f.format),
                    next: formatStatValue(f.fn(nextLv), f.format),
                });
            }
        } else {
            for (const f of formulas) {
                statChanges.push({
                    label: f.label,
                    value: formatStatValue(f.fn(1), f.format),
                });
            }
        }
        return statChanges;
    }

    generateChoices(roundStart = false) {
        const player = this.game.player;
        const choices = [];

        // 무기 후보 모으기
        const weaponOptions = [];
        const allWeapons = WeaponRegistry.getAll();
        for (const w of allWeapons) {
            const existing = player.weapons.find(pw => pw.constructor === w.weaponClass);
            if (existing && existing.level < (existing.maxLevel || 5)) {
                weaponOptions.push({
                    choiceType: 'weapon',
                    key: w.key,
                    name: w.name,
                    description: `${w.name} Lv.${existing.level + 1}로 강화`,
                    icon: '⚔️',
                    color: '#4fc3f7',
                    statChanges: this.getWeaponStatChanges(w.key, existing),
                    apply(player) {
                        existing.levelUp();
                    },
                });
            } else if (!existing && player.weapons.length < player.maxWeapons) {
                weaponOptions.push({
                    choiceType: 'weapon',
                    key: w.key,
                    name: w.name,
                    description: w.description,
                    icon: '⚔️',
                    color: '#4fc3f7',
                    statChanges: this.getWeaponStatChanges(w.key, null),
                    apply(player) {
                        const weapon = WeaponRegistry.create(w.key);
                        if (weapon) player.addWeapon(weapon);
                    },
                });
            }
        }

        // 라운드 시작 시 (무기가 없으면) 무기만 3개 보여주기
        if (roundStart && player.weapons.length === 0) {
            // 셔플
            for (let i = weaponOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [weaponOptions[i], weaponOptions[j]] = [weaponOptions[j], weaponOptions[i]];
            }
            return weaponOptions.slice(0, 3);
        }

        // 장비 후보 모으기
        const equipOptions = [];
        const allEquips = EquipmentRegistry.getAll();
        for (const e of allEquips) {
            const existing = player.equipment.find(pe => pe.constructor === e.equipmentClass);
            if (existing && existing.level < (existing.maxLevel || 5)) {
                equipOptions.push({
                    choiceType: 'equip',
                    key: e.key,
                    name: e.name,
                    description: `${e.name} Lv.${existing.level + 1}로 강화`,
                    icon: e.icon || '📦',
                    color: e.color || '#ffd740',
                    statChanges: this.getEquipStatChanges(e.key, existing),
                    apply(player) {
                        existing.levelUp(player);
                    },
                });
            } else if (!existing && player.equipment.length < player.maxEquipment) {
                equipOptions.push({
                    choiceType: 'equip',
                    key: e.key,
                    name: e.name,
                    description: e.description,
                    icon: e.icon || '📦',
                    color: e.color || '#ffd740',
                    statChanges: this.getEquipStatChanges(e.key, null),
                    apply(player) {
                        const equip = EquipmentRegistry.create(e.key);
                        if (equip) player.addEquipment(equip);
                    },
                });
            }
        }

        // 모든 후보 합치고 셔플
        const allOptions = [...weaponOptions, ...equipOptions];
        for (let i = allOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }

        // 3개 선택 (최소 1개 무기, 1개 장비 보장 시도)
        if (allOptions.length <= 3) {
            return allOptions;
        }

        // 무기 1개 + 장비 1개 + 랜덤 1개 보장
        const weapons = allOptions.filter(o => o.choiceType === 'weapon');
        const equips = allOptions.filter(o => o.choiceType === 'equip');
        const picked = new Set();

        if (weapons.length > 0) {
            const w = weapons[Math.floor(Math.random() * weapons.length)];
            choices.push(w);
            picked.add(w);
        }
        if (equips.length > 0) {
            const e = equips[Math.floor(Math.random() * equips.length)];
            choices.push(e);
            picked.add(e);
        }

        // 나머지 채우기
        const remaining = allOptions.filter(o => !picked.has(o));
        while (choices.length < 3 && remaining.length > 0) {
            const idx = Math.floor(Math.random() * remaining.length);
            choices.push(remaining.splice(idx, 1)[0]);
        }

        return choices;
    }

    selectChoice(index) {
        if (index < 0 || index >= this.choices.length) return;

        const choice = this.choices[index];
        if (choice && this.game.player) {
            choice.apply(this.game.player);
        }

        this.active = false;
        this.choices = [];
        this.game.paused = false;
    }
}
