export const STAGES = [
    // Stage 1 - 거실 (병균만)
    {
        stageNumber: 1,
        duration: 60,
        bgColor: '#f5e6d3',
        bgTheme: 'livingroom',
        spawnConfig: [
            { type: 'zombie', weight: 10, minTime: 0 },  // 병균
        ],
        bossConfig: null,
        weaponSpawnInterval: 35000,
    },
    // Stage 2 - 거실 (병균 + B형 독감)
    {
        stageNumber: 2,
        duration: 75,
        bgColor: '#f5e6d3',
        bgTheme: 'livingroom',
        spawnConfig: [
            { type: 'zombie', weight: 7, minTime: 0 },   // 병균
            { type: 'bat', weight: 5, minTime: 0 },       // B형 독감
        ],
        bossConfig: null,
        weaponSpawnInterval: 35000,
    },
    // Stage 3 - 아기방 (보스: 과자 봉지)
    {
        stageNumber: 3,
        duration: 90,
        bgColor: '#e8d5f5',
        bgTheme: 'babyroom',
        spawnConfig: [
            { type: 'zombie', weight: 5, minTime: 0 },    // 병균
            { type: 'bat', weight: 4, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 4, minTime: 0 },   // A형 독감
        ],
        bossConfig: { type: 'giantSkeleton', spawnAtTime: 70 },  // 과자 봉지
        weaponSpawnInterval: 32000,
    },
    // Stage 4 - 아기방 (감기 바이러스 등장)
    {
        stageNumber: 4,
        duration: 90,
        bgColor: '#e8d5f5',
        bgTheme: 'babyroom',
        spawnConfig: [
            { type: 'zombie', weight: 4, minTime: 0 },    // 병균
            { type: 'bat', weight: 3, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 4, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
        ],
        bossConfig: null,
        weaponSpawnInterval: 32000,
    },
    // Stage 5 - 키즈카페 (보스: 사탕 괴물)
    {
        stageNumber: 5,
        duration: 105,
        bgColor: '#d5f5e3',
        bgTheme: 'kidscafe',
        spawnConfig: [
            { type: 'zombie', weight: 3, minTime: 0 },    // 병균
            { type: 'bat', weight: 3, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 4, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 4, minTime: 0 },      // 감기 바이러스
        ],
        bossConfig: { type: 'necromancer', spawnAtTime: 80 },  // 사탕 괴물
        weaponSpawnInterval: 30000,
    },
    // Stage 6 - 키즈카페 (충치균 등장)
    {
        stageNumber: 6,
        duration: 105,
        bgColor: '#d5f5e3',
        bgTheme: 'kidscafe',
        spawnConfig: [
            { type: 'zombie', weight: 2, minTime: 0 },    // 병균
            { type: 'bat', weight: 3, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 3, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
            { type: 'knight', weight: 3, minTime: 0 },     // 충치균
        ],
        bossConfig: null,
        weaponSpawnInterval: 30000,
    },
    // Stage 7 - 어린이집 (보스: 스마트폰)
    {
        stageNumber: 7,
        duration: 120,
        bgColor: '#f5f0d5',
        bgTheme: 'kindergarten',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 3, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
            { type: 'knight', weight: 4, minTime: 0 },     // 충치균
        ],
        bossConfig: { type: 'darkKnight', spawnAtTime: 90 },  // 스마트폰
        weaponSpawnInterval: 28000,
    },
    // Stage 8 - 어린이집 (장염균 등장)
    {
        stageNumber: 8,
        duration: 120,
        bgColor: '#f5f0d5',
        bgTheme: 'kindergarten',
        spawnConfig: [
            { type: 'skeleton', weight: 3, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
            { type: 'knight', weight: 3, minTime: 0 },     // 충치균
            { type: 'slime', weight: 4, minTime: 0 },      // 장염균
        ],
        bossConfig: null,
        weaponSpawnInterval: 28000,
    },
    // Stage 9 - 놀이터 (보스: 아이스크림)
    {
        stageNumber: 9,
        duration: 135,
        bgColor: '#d5e8f5',
        bgTheme: 'playground',
        spawnConfig: [
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
            { type: 'knight', weight: 4, minTime: 0 },     // 충치균
            { type: 'slime', weight: 4, minTime: 0 },      // 장염균
        ],
        bossConfig: { type: 'lich', spawnAtTime: 100 },  // 아이스크림
        weaponSpawnInterval: 25000,
    },
    // Stage 10 - 놀이터 최종 (보스: 낡은 TV)
    {
        stageNumber: 10,
        duration: 150,
        bgColor: '#d5e8f5',
        bgTheme: 'playground',
        spawnConfig: [
            { type: 'bat', weight: 3, minTime: 0 },        // B형 독감
            { type: 'skeleton', weight: 3, minTime: 0 },   // A형 독감
            { type: 'ghost', weight: 3, minTime: 0 },      // 감기 바이러스
            { type: 'knight', weight: 4, minTime: 0 },     // 충치균
            { type: 'slime', weight: 4, minTime: 0 },      // 장염균
        ],
        bossConfig: { type: 'vampireLord', spawnAtTime: 110 },  // 낡은 TV
        weaponSpawnInterval: 25000,
    },
];
