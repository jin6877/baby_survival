// SpawnSystem: 적 및 무기/장비 픽업 스폰 관리
import { WeaponPickup } from '../items/WeaponPickup.js';
import { EquipmentPickup } from '../items/EquipmentPickup.js';
import { EnemyRegistry } from '../data/EnemyRegistry.js';
import { WeaponRegistry } from '../data/WeaponRegistry.js';
import { EquipmentRegistry } from '../data/EquipmentRegistry.js';
// 무한 월드

export class SpawnSystem {
    constructor(game) {
        this.game = game;
        this.spawnTimer = 0;
        this.baseSpawnInterval = 1200; // 이전 2000 → 더 빠른 스폰
        this.weaponSpawnTimer = 0;
        this.equipmentSpawnTimer = 0;
    }

    get maxEnemies() {
        const stageNumber = this.game.currentStage ? this.game.currentStage.stageNumber : 1;
        return 50 + stageNumber * 15; // 이전 30 + stageNumber * 12
    }

    update(dt) {
        const game = this.game;
        const stage = game.currentStage;
        if (!stage || !game.player || !game.player.alive) return;

        const stageNumber = stage.stageNumber || 1;

        // --- Enemy spawning ---
        this.spawnTimer -= dt * 1000;
        if (this.spawnTimer <= 0) {
            const spawnInterval = this.baseSpawnInterval * Math.pow(0.88, stageNumber - 1);
            this.spawnTimer = spawnInterval;

            if (game.enemies.length < this.maxEnemies) {
                const enemyKey = this._weightedRandom(stage.spawnConfig);
                if (enemyKey) {
                    this.spawnEnemy(enemyKey, stageNumber);
                }
            }
        }

        // --- Boss spawning ---
        if (stage.shouldSpawnBoss()) {
            stage.bossSpawned = true;
            if (stage.bossConfig) {
                this.spawnBoss(stage.bossConfig.type);
            }
        }

        // --- Weapon pickup spawning (15~25초 간격) ---
        this.weaponSpawnTimer -= dt * 1000;
        if (this.weaponSpawnTimer <= 0) {
            this.weaponSpawnTimer = 15000 + Math.random() * 10000;
            this.spawnWeaponPickup();
        }

        // --- Equipment pickup spawning (20~35초 간격) ---
        this.equipmentSpawnTimer -= dt * 1000;
        if (this.equipmentSpawnTimer <= 0) {
            this.equipmentSpawnTimer = 20000 + Math.random() * 15000;
            this.spawnEquipmentPickup();
        }
    }

    spawnEnemy(enemyKey, stageNumber = 1) {
        const game = this.game;
        const player = game.player;
        if (!player) return;

        const angle = Math.random() * Math.PI * 2;
        const radius = 500;
        let x = player.x + Math.cos(angle) * radius;
        let y = player.y + Math.sin(angle) * radius;

        // 무한 월드 - 클램프 없음

        const enemy = EnemyRegistry.create(enemyKey, x, y);
        if (!enemy) return;

        // 스테이지 스탯 스케일링 (완화됨)
        enemy.hp *= (1 + (stageNumber - 1) * 0.15);
        enemy.maxHp = enemy.hp;
        enemy.speed *= (1 + (stageNumber - 1) * 0.03);

        game.enemies.push(enemy);
    }

    spawnBoss(bossKey) {
        const game = this.game;
        const player = game.player;
        if (!player) return;

        const angle = Math.random() * Math.PI * 2;
        const radius = 500;
        let x = player.x + Math.cos(angle) * radius;
        let y = player.y + Math.sin(angle) * radius;

        // 무한 월드 - 클램프 없음

        const boss = EnemyRegistry.create(bossKey, x, y);
        if (!boss) return;

        game.enemies.push(boss);
    }

    spawnWeaponPickup() {
        const game = this.game;
        const player = game.player;
        if (!player) return;

        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        let x = player.x + Math.cos(angle) * distance;
        let y = player.y + Math.sin(angle) * distance;

        // 무한 월드 - 클램프 없음

        const weaponKeys = WeaponRegistry.keys();
        if (weaponKeys.length === 0) return;

        const weaponKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
        const pickup = new WeaponPickup(x, y, weaponKey);
        game.items.push(pickup);
    }

    spawnEquipmentPickup() {
        const game = this.game;
        const player = game.player;
        if (!player) return;

        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        let x = player.x + Math.cos(angle) * distance;
        let y = player.y + Math.sin(angle) * distance;

        // 무한 월드 - 클램프 없음

        const equipKeys = EquipmentRegistry.keys();
        if (equipKeys.length === 0) return;

        const equipKey = equipKeys[Math.floor(Math.random() * equipKeys.length)];
        const pickup = new EquipmentPickup(x, y, equipKey);
        game.items.push(pickup);
    }

    _weightedRandom(spawnConfig) {
        if (!spawnConfig || spawnConfig.length === 0) return null;

        let totalWeight = 0;
        for (const entry of spawnConfig) {
            totalWeight += (entry.weight || 1);
        }

        let roll = Math.random() * totalWeight;
        for (const entry of spawnConfig) {
            roll -= (entry.weight || 1);
            if (roll <= 0) {
                return entry.key || entry.type;
            }
        }

        return spawnConfig[0].key || spawnConfig[0].type;
    }
}
