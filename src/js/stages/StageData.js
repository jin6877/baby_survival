export const STAGES = [
    // Stage 1 - 거실 (병균만)
    {
        stageNumber: 1,
        duration: 300,
        bgColor: '#f5e6d3',
        bgTheme: 'livingroom',
        spawnConfig: [
            { type: 'zombie', weight: 10, minTime: 0 },
        ],
        bossConfig: null,
    },
    // Stage 2 - 거실 (병균 + B형 독감)
    {
        stageNumber: 2,
        duration: 300,
        bgColor: '#f5e6d3',
        bgTheme: 'livingroom',
        spawnConfig: [
            { type: 'zombie', weight: 7, minTime: 0 },
            { type: 'bat', weight: 5, minTime: 0 },
        ],
        bossConfig: null,
    },
    // Stage 3 - 아기방 (보스: 과자 봉지)
    {
        stageNumber: 3,
        duration: 300,
        bgColor: '#e8d5f5',
        bgTheme: 'babyroom',
        spawnConfig: [
            { type: 'zombie', weight: 5, minTime: 0 },
            { type: 'bat', weight: 4, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'giantSkeleton', spawnAtTime: 270 },
    },
    // Stage 4 - 아기방 (감기 바이러스 등장)
    {
        stageNumber: 4,
        duration: 300,
        bgColor: '#e8d5f5',
        bgTheme: 'babyroom',
        spawnConfig: [
            { type: 'zombie', weight: 4, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
        ],
        bossConfig: null,
    },
    // Stage 5 - 키즈카페 (보스: 사탕 괴물)
    {
        stageNumber: 5,
        duration: 300,
        bgColor: '#d5f5e3',
        bgTheme: 'kidscafe',
        spawnConfig: [
            { type: 'zombie', weight: 3, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 4, minTime: 0 },
            { type: 'ghost', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'necromancer', spawnAtTime: 270 },
    },
    // Stage 6 - 키즈카페 (충치균 등장)
    {
        stageNumber: 6,
        duration: 300,
        bgColor: '#d5f5e3',
        bgTheme: 'kidscafe',
        spawnConfig: [
            { type: 'zombie', weight: 2, minTime: 0 },
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 3, minTime: 0 },
        ],
        bossConfig: null,
    },
    // Stage 7 - 어린이집 (보스: 스마트폰)
    {
        stageNumber: 7,
        duration: 300,
        bgColor: '#f5f0d5',
        bgTheme: 'kindergarten',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'darkKnight', spawnAtTime: 270 },
    },
    // Stage 8 - 어린이집 (장염균 등장)
    {
        stageNumber: 8,
        duration: 300,
        bgColor: '#f5f0d5',
        bgTheme: 'kindergarten',
        spawnConfig: [
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 3, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: null,
    },
    // Stage 9 - 놀이터 (보스: 아이스크림)
    {
        stageNumber: 9,
        duration: 300,
        bgColor: '#d5e8f5',
        bgTheme: 'playground',
        spawnConfig: [
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'lich', spawnAtTime: 270 },
    },
    // Stage 10 - 놀이터 최종 (보스: 낡은 TV)
    {
        stageNumber: 10,
        duration: 300,
        bgColor: '#d5e8f5',
        bgTheme: 'playground',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },
            { type: 'skeleton', weight: 3, minTime: 0 },
            { type: 'ghost', weight: 3, minTime: 0 },
            { type: 'knight', weight: 4, minTime: 0 },
            { type: 'slime', weight: 4, minTime: 0 },
        ],
        bossConfig: { type: 'vampireLord', spawnAtTime: 270 },
    },
];
