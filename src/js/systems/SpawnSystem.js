// SpawnSystem: 적 스폰 관리 - 1분마다 난이도 증가
import { EnemyRegistry } from '../data/EnemyRegistry.js';

export class SpawnSystem {
    constructor(game) {
        this.game = game;
        this.spawnTimer = 0;
        this.baseSpawnInterval = 400;
    }

    get maxEnemies() {
        const stageNumber = this.game.currentStage ? this.game.currentStage.stageNumber : 1;
        return 180 + stageNumber * 60;
    }

    // 라운드 내 경과 분 수 (0분~5분)
    _getElapsedMinutes() {
        const stage = this.game.currentStage;
        if (!stage) return 0;
        return Math.floor(stage.elapsed / 60);
    }

    update(dt) {
        const game = this.game;
        const stage = game.currentStage;
        if (!stage || !game.player || !game.player.alive) return;

        const stageNumber = stage.stageNumber || 1;
        const elapsedMin = this._getElapsedMinutes(); // 0, 1, 2, 3, 4

        // --- Enemy spawning ---
        this.spawnTimer -= dt * 1000;
        if (this.spawnTimer <= 0) {
            // 스폰 간격: 스테이지 + 경과 시간에 따라 빨라짐
            // 1분마다 스폰 간격 15% 단축
            const stageSpeedUp = stageNumber === 1 ? 2.0 : Math.pow(0.88, stageNumber - 1);
            const timeSpeedUp = 1 - elapsedMin * 0.15; // 0분: 1.0, 1분: 0.85, 2분: 0.7, 3분: 0.55, 4분: 0.4
            const spawnInterval = this.baseSpawnInterval * stageSpeedUp * Math.max(0.3, timeSpeedUp);
            this.spawnTimer = spawnInterval;

            if (game.enemies.length < this.maxEnemies) {
                // 동시 스폰 수: 1분마다 +1
                let baseCount = stageNumber <= 2 ? 1 : Math.min(4, 1 + Math.floor(stageNumber / 2));
                const bonusCount = elapsedMin; // 0분: +0, 1분: +1, 2분: +2, 3분: +3, 4분: +4
                const spawnCount = baseCount + bonusCount;

                for (let s = 0; s < spawnCount; s++) {
                    if (game.enemies.length >= this.maxEnemies) break;
                    const enemyKey = this._weightedRandom(stage.spawnConfig);
                    if (enemyKey) {
                        this.spawnEnemy(enemyKey, stageNumber, elapsedMin);
                    }
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

    }

    spawnEnemy(enemyKey, stageNumber = 1, elapsedMin = 0) {
        const game = this.game;
        const player = game.player;
        if (!player) return;

        const angle = Math.random() * Math.PI * 2;
        const radius = 500;
        let x = player.x + Math.cos(angle) * radius;
        let y = player.y + Math.sin(angle) * radius;

        const enemy = EnemyRegistry.create(enemyKey, x, y);
        if (!enemy) return;

        // 스테이지 기본 스케일링
        let hpMult;
        if (stageNumber === 1) hpMult = 1;
        else if (stageNumber === 2) hpMult = 1.5;
        else hpMult = 2 * Math.pow(1.5, stageNumber - 3);

        // 1분마다 HP 20% 추가 증가
        const timeHpBonus = 1 + elapsedMin * 0.2; // 0분: 1.0, 1분: 1.2, 2분: 1.4, 3분: 1.6, 4분: 1.8

        enemy.hp *= hpMult * timeHpBonus;
        enemy.maxHp = enemy.hp;
        enemy.speed *= (1 + (stageNumber - 1) * 0.06);

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

        const boss = EnemyRegistry.create(bossKey, x, y);
        if (!boss) return;

        game.enemies.push(boss);
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
