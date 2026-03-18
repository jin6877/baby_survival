export class Stage {
    constructor(config = {}) {
        this.stageNumber = config.stageNumber || 1;
        this.duration = config.duration || 60;
        this.bgColor = config.bgColor || '#1a1a2e';
        this.spawnConfig = config.spawnConfig || [];
        this.bossConfig = config.bossConfig || null;
        this.weaponSpawnInterval = config.weaponSpawnInterval || 35000;

        this.timer = 0;
        this.elapsed = 0;
        this.cleared = false;
        this.bossSpawned = false;
    }

    update(dt) {
        this.elapsed += dt;

        // Check if stage is cleared
        if (this.elapsed >= this.duration && !this.cleared) {
            this.cleared = true;
        }
    }

    getSpawnableEnemies() {
        return this.spawnConfig.filter(
            entry => this.elapsed >= (entry.minTime || 0)
        );
    }

    shouldSpawnBoss() {
        if (!this.bossConfig) return false;
        return this.elapsed >= this.bossConfig.spawnAtTime && !this.bossSpawned;
    }

    getTotalWeight() {
        const spawnable = this.getSpawnableEnemies();
        return spawnable.reduce((sum, entry) => sum + entry.weight, 0);
    }

    getRandomEnemyType() {
        const spawnable = this.getSpawnableEnemies();
        if (spawnable.length === 0) return null;

        const totalWeight = spawnable.reduce((sum, e) => sum + e.weight, 0);
        let roll = Math.random() * totalWeight;

        for (const entry of spawnable) {
            roll -= entry.weight;
            if (roll <= 0) {
                return entry.type;
            }
        }

        return spawnable[spawnable.length - 1].type;
    }
}
