export const STAGES = [
    // Stage 1
    {
        stageNumber: 1,
        duration: 60,
        bgColor: '#2d5a27',
        spawnConfig: [
            { type: 'zombie', weight: 10, minTime: 0 },
        ],
        bossConfig: null,
        weaponSpawnInterval: 35000,
    },
    // Stage 2
    {
        stageNumber: 2,
        duration: 75,
        bgColor: '#2d5a27',
        spawnConfig: [
            { type: 'zombie', weight: 7, minTime: 0 },
            { type: 'bat', weight: 5, minTime: 0 },
        ],
        bossConfig: null,
        weaponSpawnInterval: 35000,
    },
    // Stage 3
    {
        stageNumber: 3,
        duration: 90,
        bgColor: '#3a3a4a',
        spawnConfig: [
            { type: 'zombie', weight: 5, minTime: 0 },
            { type: 'bat', weight: 4, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'giantSkeleton', spawnAtTime: 70 },
        weaponSpawnInterval: 32000,
    },
    // Stage 4
    {
        stageNumber: 4,
        duration: 90,
        bgColor: '#3a3a4a',
        spawnConfig: [
            { type: 'zombie', weight: 4, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
        ],
        bossConfig: null,
        weaponSpawnInterval: 32000,
    },
    // Stage 5
    {
        stageNumber: 5,
        duration: 105,
        bgColor: '#4a4a3a',
        spawnConfig: [
            { type: 'zombie', weight: 3, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
            { type: 'ghost', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'necromancer', spawnAtTime: 80 },
        weaponSpawnInterval: 30000,
    },
    // Stage 6
    {
        stageNumber: 6,
        duration: 105,
        bgColor: '#3a3a3a',
        spawnConfig: [
            { type: 'zombie', weight: 2, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 3, minTime: 0 },
        ],
        bossConfig: null,
        weaponSpawnInterval: 30000,
    },
    // Stage 7
    {
        stageNumber: 7,
        duration: 120,
        bgColor: '#3a3a3a',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'darkKnight', spawnAtTime: 90 },
        weaponSpawnInterval: 28000,
    },
    // Stage 8
    {
        stageNumber: 8,
        duration: 120,
        bgColor: '#2a2a3a',
        spawnConfig: [
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 3, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: null,
        weaponSpawnInterval: 28000,
    },
    // Stage 9
    {
        stageNumber: 9,
        duration: 135,
        bgColor: '#2a2a3a',
        spawnConfig: [
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'lich', spawnAtTime: 100 },
        weaponSpawnInterval: 25000,
    },
    // Stage 10
    {
        stageNumber: 10,
        duration: 150,
        bgColor: '#1a1a2e',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'vampireLord', spawnAtTime: 110 },
        weaponSpawnInterval: 25000,
    },
];
