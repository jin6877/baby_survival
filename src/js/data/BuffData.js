// BuffData: 레벨업 시 선택 가능한 소규모 버프 목록
// 모든 버프는 무한히 중첩 가능하며, 각 선택 시 소량(1~3%) 증가

export const BUFF_TYPES = [
    {
        type: 'attack',
        name: '공격력 강화',
        icon: '⚔️',
        color: '#ff5252',
        description: '공격력 +3%',
        apply(player) {
            player.attackMultiplier *= 1.03;
            player.buffStacks.attack = (player.buffStacks.attack || 0) + 1;
        },
        getDisplay(stacks) { return `+${(Math.pow(1.03, stacks) * 100 - 100).toFixed(0)}%`; },
    },
    {
        type: 'attackSpeed',
        name: '공격속도 강화',
        icon: '⚡',
        color: '#ffab40',
        description: '공격속도 +2%',
        apply(player) {
            player.attackSpeedMultiplier *= 1.02;
            player.buffStacks.attackSpeed = (player.buffStacks.attackSpeed || 0) + 1;
        },
        getDisplay(stacks) { return `+${(Math.pow(1.02, stacks) * 100 - 100).toFixed(0)}%`; },
    },
    {
        type: 'speed',
        name: '이동속도 강화',
        icon: '👟',
        color: '#69f0ae',
        description: '이동속도 +2%',
        apply(player) {
            player.speedMultiplier *= 1.02;
            player.buffStacks.speed = (player.buffStacks.speed || 0) + 1;
        },
        getDisplay(stacks) { return `+${(Math.pow(1.02, stacks) * 100 - 100).toFixed(0)}%`; },
    },
    {
        type: 'maxHp',
        name: '체력 강화',
        icon: '❤️',
        color: '#ef5350',
        description: '최대 HP +5',
        apply(player) {
            player.maxHp += 5;
            player.hp += 5;
            player.buffStacks.maxHp = (player.buffStacks.maxHp || 0) + 1;
        },
        getDisplay(stacks) { return `+${stacks * 5}`; },
    },
    {
        type: 'hpRecover',
        name: 'HP 회복',
        icon: '💊',
        color: '#66bb6a',
        description: 'HP 20 회복',
        apply(player) {
            player.hp = Math.min(player.hp + 20, player.maxHp);
            player.buffStacks.hpRecover = (player.buffStacks.hpRecover || 0) + 1;
        },
        getDisplay(stacks) { return `${stacks}회`; },
    },
    {
        type: 'projSize',
        name: '투사체 크기',
        icon: '🔮',
        color: '#7c4dff',
        description: '투사체 크기 +3%',
        apply(player) {
            player.projectileSizeMultiplier *= 1.03;
            player.buffStacks.projSize = (player.buffStacks.projSize || 0) + 1;
        },
        getDisplay(stacks) { return `+${(Math.pow(1.03, stacks) * 100 - 100).toFixed(0)}%`; },
    },
    {
        type: 'projCount',
        name: '투사체 추가',
        icon: '🎯',
        color: '#40c4ff',
        description: '투사체 +1',
        apply(player) {
            player.projectileCountBonus += 1;
            player.buffStacks.projCount = (player.buffStacks.projCount || 0) + 1;
        },
        getDisplay(stacks) { return `+${stacks}`; },
    },
    {
        type: 'expBonus',
        name: '경험치 보너스',
        icon: '⭐',
        color: '#ffd740',
        description: '경험치 획득 +5%',
        apply(player) {
            player.expMultiplier += 0.05;
            player.buffStacks.expBonus = (player.buffStacks.expBonus || 0) + 1;
        },
        getDisplay(stacks) { return `+${stacks * 5}%`; },
    },
    {
        type: 'knockback',
        name: '넉백 강화',
        icon: '💨',
        color: '#80cbc4',
        description: '넉백 거리 +5%',
        apply(player) {
            player.knockbackMultiplier += 0.05;
            player.buffStacks.knockback = (player.buffStacks.knockback || 0) + 1;
        },
        getDisplay(stacks) { return `+${stacks * 5}%`; },
    },
    {
        type: 'damageReduction',
        name: '방어력 강화',
        icon: '🛡️',
        color: '#42a5f5',
        description: '받는 피해 -1%',
        apply(player) {
            player.damageReduction = Math.min(0.8, player.damageReduction + 0.01);
            player.buffStacks.damageReduction = (player.buffStacks.damageReduction || 0) + 1;
        },
        getDisplay(stacks) { return `-${stacks}%`; },
    },
    {
        type: 'hpRegen',
        name: '체력 재생',
        icon: '💚',
        color: '#26a69a',
        description: '초당 HP 재생 +0.3',
        apply(player) {
            player.hpRegen += 0.3;
            player.buffStacks.hpRegen = (player.buffStacks.hpRegen || 0) + 1;
        },
        getDisplay(stacks) { return `+${(stacks * 0.3).toFixed(1)}/s`; },
    },
];
