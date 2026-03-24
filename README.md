# Baby Survival

뱀파이어 서바이벌 류 웹 게임 (HTML5 Canvas + JavaScript)

## 실행 방법

`start_server.command` 실행 또는 `src/index.html`을 로컬 서버로 열기

---

## 밸런스 수정 가이드

각 항목의 **파일:라인**을 찾아 숫자를 직접 수정하면 됩니다.

### 무기

| 이름 | 파일 | 기본 수치 (라인) | 레벨업 (라인) | 이미지 |
|------|------|-----------------|-------------|--------|
| 엄마 손 | `src/js/weapons/Dagger.js` | :9 dmg:20, :10 cd:600, :15 투사체:1 | :73~98 | `images/weapon_projectiles/weapon_mom_hand.png` |
| 아빠 슬리퍼 | `src/js/weapons/Axe.js` | :9 dmg:35, :10 cd:1400, :15 투사체:1 | :40~66 | `images/weapon_projectiles/weapon_dad_slipper.png` |
| 엄마 잔소리 | `src/js/weapons/MagicWand.js` | :9 dmg:25, :10 cd:900, :15 투사체:1 | :48~73 | `images/weapon_projectiles/weapon_mom_nagging.png` |
| 젖병 방어막 | `src/js/weapons/Garlic.js` | :9 dmg:15, :10 cd:800, :15 반경:90 | :111~137 | `images/weapon_projectiles/effect_bottle_shield.png` |
| 기저귀 | `src/js/weapons/Cross.js` | :9 dmg:18, :10 cd:1400, :15 투사체:1 | :68~96 | `images/weapon_projectiles/weapon_diaper.png` |
| 장난감 폭탄 | `src/js/weapons/Firebomb.js` | :9 dmg:18, :10 cd:2500, :15 반경:70 | :48~76 | `images/weapon_projectiles/effect_toy_bomb.png` |
| 엄마 눈물 | `src/js/weapons/Lightning.js` | :9 dmg:40, :10 cd:1100, :15 타격수:1 | :85~113 | `images/weapon_projectiles/effect_mom_tears.png` |
| 아빠 목소리 | `src/js/weapons/HolyWater.js` | :9 dmg:15, :10 cd:2000, :15 반경:100 | :54~81 | `images/weapon_projectiles/effect_dad_voice.png` |

### 장비

모든 장비 공통: `:13`에 `pctBonus: 0.10`, `:25`에 레벨업 공식

| 이름 | 파일 | 효과 | 이미지 (:11) |
|------|------|------|-------------|
| 아빠 응원 | `src/js/equipment/AttackRing.js` | 레벨당 공격력 +10% | `images/equipment_icons/equip_dad_cheer.png` |
| 아기 헬멧 | `src/js/equipment/Armor.js` | 레벨당 피해감소 +10% | `images/equipment_icons/equip_helmet.png` |
| 아기 신발 | `src/js/equipment/SwiftBoots.js` | 레벨당 이속 +10% | `images/equipment_icons/equip_shoes.png` |
| 낮잠 시계 | `src/js/equipment/TimeClock.js` | 레벨당 쿨다운 -10% | `images/equipment_icons/equip_clock.png` |
| 두꺼운 안경 | `src/js/equipment/SharpshooterGlass.js` | 레벨당 투사체크기 +10% | `images/equipment_icons/equip_glasses.png` |
| 행운의 곰돌이 | `src/js/equipment/LuckyClover.js` | 레벨당 경험치 +10% | `images/equipment_icons/equip_bear.png` |
| 엄마 손수건 | `src/js/equipment/MagnetAmulet.js` | 레벨당 흡수범위 +10% | `images/equipment_icons/equip_handkerchief.png` |
| 젖병 목걸이 | `src/js/equipment/LifeNecklace.js` | 레벨당 HP+10%, 재생+0.3/s | `images/equipment_icons/equip_bottle_necklace.png` |

장비 수치 변경 시 `src/js/systems/LevelUpSystem.js :6~32`의 표시 공식도 함께 수정

### 일반 몬스터

| 이름 | 파일 | hp | speed | damage | size | exp | 특수 |
|------|------|----|-------|--------|------|-----|------|
| 병균 | `Zombie.js` | :6 20 | :8 1.2 | :9 5 | :7 48 | :10 1 | :29 분열2마리, 미니(hp:8,spd:1.8,dmg:3) |
| B형 독감 | `Bat.js` | :7 8 | :8 3.5 | :9 3 | :10 42 | :14 1 | :26 버스트속도x3, :24 지속0.8초 |
| A형 독감 | `Skeleton.js` | :7 35 | :8 1.5 | :9 12 | :10 52 | :14 2 | :25 돌진속도8, :21 지속0.5초 |
| 감기 바이러스 | `Ghost.js` | :8 15 | :9 2 | :10 10 | :11 44 | :15 2 | :19 사격2.5초, :24 텔포5~8초 |
| 충치균 | `Knight.js` | :8 80 | :9 1 | :10 15 | :11 60 | :15 3 | :48 방패80%감소, :53 분노HP30%↓ |
| 장염균 | `Slime.js` | :8 30 | :9 2.5 | :10 25 | :11 44 | :14 2 | :18 자폭1.5초, :20 폭발반경90 |

경로: `src/js/entities/enemies/`

### 보스

| 이름 | 파일 | hp | speed | damage | size | exp | 핵심 수치 |
|------|------|----|-------|--------|------|-----|----------|
| 과자 봉지 | `GiantSkeleton.js` | :8 300 | :9 0.8 | :10 12 | :11 90 | :15 20 | :21 sweep3초, :22 반경100 |
| 사탕 괴물 | `Necromancer.js` | :10 500 | :11 1.2 | :12 10 | :13 88 | :17 50 | :52 소환5초/3마리, :62 사격3초/3발 |
| 스마트폰 | `DarkKnight.js` | :8 600 | :9 1.5 | :10 20 | :11 90 | :15 40 | :21 돌진4초, :24 돌진속도8 |
| 아이스크림 | `Lich.js` | :120 800 | :121 1.3 | :122 15 | :123 88 | :127 60 | :133 장판3초, :138 유도탄2초 |
| 낡은 TV | `VampireLord.js` | :10 1500 | :11 1.5 | :12 20 | :13 100 | :17 100 | 3페이즈(:62~121), :209 흡혈10% |

경로: `src/js/entities/enemies/bosses/`

### 드롭 아이템

| 이름 | 파일 | 핵심 수치 |
|------|------|----------|
| 경험치 보석 | `src/js/items/ExpGem.js` | :4~10 등급별 exp(1,1,1,2,3), :13 가중치[50,28,14,6,2] |
| 스탯 젬 | `src/js/items/StatGem.js` | :5~8 공격력+0.2/이속+0.005/공속+0.005/HP+0.2, :16 수명30초 |
| 고기 | `src/js/items/Meat.js` | :13 회복+20, :8 수명15초 |
| 자석 | `src/js/items/Magnet.js` | :8 수명10초 |
| 폭탄 | `src/js/items/Bomb.js` | :17 데미지100, :8 수명12초 |

### 드롭 확률

`src/js/systems/DropSystem.js`

| 아이템 | 라인 | 확률 |
|--------|------|------|
| ExpGem | :22~27 | 100% |
| StatGem | :30 | 3% + dropBonus*0.01 |
| Meat | :39 | 7% + dropBonus*0.03 |
| Magnet | :45 | 0.1% + dropBonus*0.0005 |
| Bomb | :51 | 0.1% + dropBonus*0.0005 |

### 레벨업 버프

`src/js/data/BuffData.js`

| 이름 | 라인 | 효과 |
|------|------|------|
| 공격력 강화 | :12 | attackPower += 1 |
| 공격속도 강화 | :24 | attackSpeedMultiplier += 0.02 |
| 이동속도 강화 | :36 | speedMultiplier += 0.02 |
| 체력 강화 | :48 | maxHp += 5 |
| HP 회복 | :61 | hp += 20 |
| 투사체 크기 | :73 | projectileSizeMultiplier += 0.03 |
| 투사체 추가 | :85 | projectileCountBonus += 1 |
| 경험치 보너스 | :97 | expMultiplier += 0.05 |
| 넉백 강화 | :109 | knockbackMultiplier += 0.05 |
| 방어력 강화 | :121 | defense += 1 |
| 체력 재생 | :134 | hpRegen += 0.3 |

### 플레이어 기본 스탯

`src/js/entities/Player.js`

| 항목 | 라인 | 값 |
|------|------|----|
| HP | :30 | 80 |
| 공격력 | :31 | 5 |
| 이동속도 | :32 | 1.5 |
| 방어력 | :33 | 0 |

### 성장 단계

`src/js/entities/Player.js :12~18`

| 단계 | 이름 | 필요포인트 (:22) | HP보너스 | 이속 | 크기 |
|------|------|-----------------|----------|------|------|
| 1 | 누워있는 아기 | 0 | +0 | 1.5 | 48 |
| 2 | 기는 아기 | 25 | +20 | 2.0 | 54 |
| 3 | 일어서는 아기 | 58 | +40 | 2.5 | 60 |
| 4 | 유치원생 | 100 | +60 | 3.2 | 66 |
| 5 | 초등학생 | 158 | +80 | 4.0 | 72 |

### 스폰 & 난이도

`src/js/systems/SpawnSystem.js`

| 항목 | 라인 | 값/공식 |
|------|------|--------|
| 기본 스폰 간격 | :8 | 400ms |
| 최대 몬스터 수 | :13 | 180 + stageNumber * 60 |
| 스폰 가속 (스테이지) | :36 | stage1=2.0배느림, 이후=0.88^(stage-1) |
| 스폰 가속 (시간) | :37 | 1분마다 20% 단축 |
| 동시 스폰 기본 | :43 | stage1~2=1, 이후=min(4, 1+floor(stage/2)) |
| 동시 스폰 시간보너스 | :44 | 1분마다 +2마리 |
| 몬스터 HP (스테이지) | :82 | stage1=1, stage2=1.5, stage3+=2*pow(1.5,stage-3) |
| 몬스터 HP (시간) | :87 | 1분마다 +40% |
| 몬스터 HP (성장) | :93 | 성장레벨당 +30% |
| 몬스터 HP (공격드롭) | :95 | 공격력드롭당 +1% |
| 몬스터 속도 (기본) | :102 | 0.7 |
| 몬스터 속도 (시간) | :103 | 1분마다 +0.15 |
| 몬스터 속도 (스테이지) | :104 | 스테이지당 +6% |

### 스테이지 구성

`src/js/stages/StageData.js`

| 스테이지 | 라인 | 맵 | 몬스터 | 보스 |
|----------|------|----|--------|------|
| 1 | :3~12 | 거실 | 병균 | - |
| 2 | :14~24 | 거실 | 병균, B형독감 | - |
| 3 | :26~37 | 아기방 | 병균, B형독감, A형독감 | 과자봉지 @270초 |
| 4 | :39~51 | 아기방 | 병균, B형독감, A형독감, 감기바이러스 | - |
| 5 | :53~65 | 키즈카페 | 병균, B형독감, A형독감, 감기바이러스 | 사탕괴물 @270초 |
| 6 | :67~80 | 키즈카페 | 병균, B형독감, A형독감, 감기바이러스, 충치균 | - |
| 7 | :82~94 | 어린이집 | B형독감, A형독감, 감기바이러스, 충치균 | 스마트폰 @270초 |
| 8 | :96~108 | 어린이집 | A형독감, 감기바이러스, 충치균, 장염균 | - |
| 9 | :110~121 | 놀이터 | 감기바이러스, 충치균, 장염균 | 아이스크림 @270초 |
| 10 | :123~137 | 놀이터 | B형독감, A형독감, 감기바이러스, 충치균, 장염균 | 낡은TV @270초 |

수정 가능: `duration`(초), `spawnConfig[{type,weight}]`, `bossConfig{type,spawnAtTime}`

### 게임 상수

`src/js/data/Constants.js`

| 상수 | 라인 | 값 |
|------|------|----|
| CANVAS_WIDTH | :1 | 800 |
| CANVAS_HEIGHT | :2 | 600 |
| WORLD_SIZE | :3 | 3000 |
| PLAYER_BASE_HP | :5 | 100 |
| PLAYER_BASE_SPEED | :6 | 3 |
| PLAYER_SIZE | :7 | 48 |
| PLAYER_INVINCIBLE_TIME | :8 | 500ms |
| MAX_WEAPONS | :10 | 4 |
| MAX_WEAPON_LEVEL | :11 | 5 |
| MAX_EQUIPMENT | :12 | 6 |
| MAX_EQUIPMENT_LEVEL | :13 | 5 |
| EXP_PICKUP_RADIUS | :17 | 50 |
| MAGNET_PICKUP_RADIUS | :18 | 500 |

레벨업 필요 경험치: `Player.js` 내 `Math.round(Math.pow(level, 1.8) * 2.5)`

### 이미지 경로 총 정리

`src/js/core/AssetManager.js` (SPRITE_CONFIG)

| 카테고리 | 라인 | 경로 패턴 |
|----------|------|----------|
| 일반 몬스터 | :8~22 | `images/enemy_normal/{germ,flu_b,flu_a,cold_virus,cavity,stomach_bug}/` |
| 보스 | :25~34 | `images/enemy_boss/{snack_bag,candy_monster,smartphone,ice_cream,old_tv}/` |
| 무기 투사체 | :37~49 | `images/weapon_projectiles/` |
| 적 탄환 | :50 | `images/enemy_normal/cold_virus/ghost_bullet.png` |
| 필드 아이템 | :59~63 | `images/field_items/` |
| 장비 아이콘 | 각 장비파일 :11 | `images/equipment_icons/` |

---

## 문서 목록

| 파일 | 설명 |
|------|------|
| `README.md` | 밸런스 직접 수정 가이드 (이 파일) |
| `GAME_REFERENCE.md` | 개발용 전체 레퍼런스 (코드키, 클래스명, 트리구조) |
| `GAME_DESIGN.md` | 초기 기획서 (컨셉 참고용) |
| `IMAGE_PROMPTS.md` | 이미지 생성 프롬프트 |
