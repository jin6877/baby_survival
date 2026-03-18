// LevelUpSystem: 레벨업 선택지 관리 (확장 버전)
export class LevelUpSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.choices = [];
    }

    showChoices() {
        this.game.paused = true;
        this.choices = this.generateChoices();
        this.active = true;
    }

    generateChoices() {
        const allChoices = [
            {
                type: 'hpRecover',
                name: 'HP 회복',
                description: 'HP +30 회복',
                apply(player) {
                    player.hp = Math.min(player.hp + 30, player.maxHp);
                },
            },
            {
                type: 'maxHp',
                name: 'HP 최대치 증가',
                description: '최대 HP +25',
                apply(player) {
                    player.maxHp += 25;
                    player.hp += 25;
                },
            },
            {
                type: 'speed',
                name: '이동속도 증가',
                description: '이동속도 +10%',
                apply(player) {
                    player.speedMultiplier *= 1.1;
                },
            },
            {
                type: 'attack',
                name: '공격력 증가',
                description: '공격력 +15%',
                apply(player) {
                    player.attackMultiplier *= 1.15;
                },
            },
            {
                type: 'attackSpeed',
                name: '공격속도 증가',
                description: '공격속도 +12%',
                apply(player) {
                    player.attackSpeedMultiplier *= 1.12;
                },
            },
            {
                type: 'projSize',
                name: '투사체 크기 증가',
                description: '투사체 크기 +15%',
                apply(player) {
                    player.projectileSizeMultiplier *= 1.15;
                },
            },
            {
                type: 'projCount',
                name: '투사체 수 증가',
                description: '투사체 +1',
                apply(player) {
                    player.projectileCountBonus += 1;
                },
            },
            {
                type: 'expBonus',
                name: '경험치 보너스',
                description: '경험치 획득 +20%',
                apply(player) {
                    player.expMultiplier += 0.20;
                },
            },
            {
                type: 'knockback',
                name: '넉백 강화',
                description: '넉백 거리 +30%',
                apply(player) {
                    player.knockbackMultiplier += 0.30;
                },
            },
        ];

        // Shuffle and pick 3 unique choices
        const shuffled = allChoices.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 3);
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
