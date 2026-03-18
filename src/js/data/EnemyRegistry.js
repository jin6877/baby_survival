import { Zombie } from '../entities/enemies/Zombie.js';
import { Bat } from '../entities/enemies/Bat.js';
import { Skeleton } from '../entities/enemies/Skeleton.js';
import { Ghost } from '../entities/enemies/Ghost.js';
import { Knight } from '../entities/enemies/Knight.js';
import { Slime } from '../entities/enemies/Slime.js';
import { GiantSkeleton } from '../entities/enemies/bosses/GiantSkeleton.js';
import { Necromancer } from '../entities/enemies/bosses/Necromancer.js';
import { DarkKnight } from '../entities/enemies/bosses/DarkKnight.js';
import { Lich } from '../entities/enemies/bosses/Lich.js';
import { VampireLord } from '../entities/enemies/bosses/VampireLord.js';

const registry = new Map();

export const EnemyRegistry = {
    register(key, EnemyClass) {
        registry.set(key, EnemyClass);
    },

    create(key, x, y, stageMultiplier = 1) {
        const EnemyClass = registry.get(key);
        if (!EnemyClass) {
            console.warn(`EnemyRegistry: unknown enemy key "${key}"`);
            return null;
        }
        const enemy = new EnemyClass(x, y);
        if (stageMultiplier !== 1) {
            enemy.hp = Math.round(enemy.hp * stageMultiplier);
            enemy.maxHp = enemy.hp;
            enemy.speed *= (1 + (stageMultiplier - 1) * 0.3);
            enemy.baseSpeed = enemy.speed;
        }
        return enemy;
    },

    has(key) { return registry.has(key); },
    keys() { return Array.from(registry.keys()); },
};

// Regular enemies
EnemyRegistry.register('zombie', Zombie);
EnemyRegistry.register('bat', Bat);
EnemyRegistry.register('skeleton', Skeleton);
EnemyRegistry.register('ghost', Ghost);
EnemyRegistry.register('knight', Knight);
EnemyRegistry.register('slime', Slime);

// Bosses
EnemyRegistry.register('giantSkeleton', GiantSkeleton);
EnemyRegistry.register('necromancer', Necromancer);
EnemyRegistry.register('darkKnight', DarkKnight);
EnemyRegistry.register('lich', Lich);
EnemyRegistry.register('vampireLord', VampireLord);
