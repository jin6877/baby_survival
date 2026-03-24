# Baby Survival — 게임 레퍼런스

이 문서 하나로 모든 게임 요소를 파악하고 작업할 수 있습니다.
한글 이름, 코드 키, 클래스명, 수정할 파일:라인 번호를 모두 포함합니다.

---

## 게임 전체 흐름

```
시작화면(StartScreen)
└── 캐릭터 선택(CharacterSelectScreen)
    └── [스테이지 1~10 반복]
        ├── 무기 선택 (3개 중 1개)
        ├── 5분 전투
        │   ├── 적 처치 → ExpGem → 경험치 → 레벨업
        │   │   └── 무기1 + 장비1 + 랜덤1 중 선택
        │   └── 적 처치 → StatGem → 영구스탯 + 성장포인트
        ├── 4분30초 → 보스 등장 (홀수 스테이지)
        ├── 스테이지 클리어
        │   └── 무기/장비/버프/레벨 초기화, 영구스탯 유지
        └── 다음 스테이지
    └── 10스테이지 클리어 → 승리

게임 상태 (game.state)
├── playing     → 전투 중
├── levelup     → 레벨업 선택 (일시정지)
├── weaponswap  → 무기 교체 (일시정지)
├── stageclear  → 스테이지 클리어 연출
├── gameover    → 게임 오버
└── victory     → 승리
```

---

## 무기 (Weapons)

레지스트리: `WeaponRegistry` (`src/js/data/WeaponRegistry.js`)
최대 4개 (`MAX_WEAPONS`), 최대 레벨 5 (`MAX_WEAPON_LEVEL`)

```
엄마 손 (dagger) — src/js/weapons/Dagger.js
├── 기본 수치
│   ├── :9   damage: 20
│   ├── :10  cooldown: 600
│   ├── :15  projectileCount: 1
│   ├── :16  spread: 0
│   └── :17  piercing: false
├── 투사체
│   ├── :58  speed: 7
│   └── :61  size: 30 * sizeMult
├── 레벨업 (onUpgrade :73~98)
│   ├── Lv2 :76~78  → damage 28, 투사체 2, spread 0.15
│   ├── Lv3 :82~83  → damage 35, cooldown 450
│   ├── Lv4 :87~89  → 투사체 3, spread 0.2, 관통 true
│   └── Lv5 :93~95  → 투사체 5, damage 45, cooldown 350
└── 이미지: images/weapon_projectiles/weapon_mom_hand.png (AssetManager :37)

아빠 슬리퍼 (axe) — src/js/weapons/Axe.js
├── 기본 수치
│   ├── :9   damage: 35
│   ├── :10  cooldown: 1400
│   ├── :15  projectileCount: 1
│   └── :16  sizeMultiplier: 1.2
├── 투사체
│   └── :31  size: 38 * sizeMultiplier * sizeMult
├── 레벨업 (onUpgrade :40~66)
│   ├── Lv2 :43~44  → damage 50, 투사체 2
│   ├── Lv3 :48~50  → damage 65, cooldown 1100, size 1.4
│   ├── Lv4 :54~55  → 투사체 3, damage 80
│   └── Lv5 :59~62  → 투사체 4, size 1.8, damage 100, cooldown 900
└── 이미지: images/weapon_projectiles/weapon_dad_slipper.png (AssetManager :38)

엄마 잔소리 (magicWand) — src/js/weapons/MagicWand.js
├── 기본 수치
│   ├── :9   damage: 25
│   ├── :10  cooldown: 900
│   ├── :15  projectileCount: 1
│   └── :16  explodeOnHit: false
├── 투사체
│   ├── :33  speed: 6
│   ├── :36  size: 30 * sizeMult
│   ├── :40  explosionRadius: 60
│   └── :41  explosionDamageRatio: 0.7
├── 레벨업 (onUpgrade :48~73)
│   ├── Lv2 :51~52  → damage 35, 투사체 2
│   ├── Lv3 :56~58  → damage 45, cooldown 700, 투사체 3
│   ├── Lv4 :62~64  → damage 55, 투사체 4, 폭발 true
│   └── Lv5 :68~70  → 투사체 6, damage 70, cooldown 500
└── 이미지: images/weapon_projectiles/weapon_mom_nagging.png (AssetManager :39)

젖병 방어막 (garlic) — src/js/weapons/Garlic.js
├── 기본 수치
│   ├── :9   damage: 15
│   ├── :10  cooldown: 800
│   ├── :15  radius: 90
│   ├── :16  knockbackForce: 10
│   └── :19  pulseDuration: 300
├── 레벨업 (onUpgrade :111~137)
│   ├── Lv2 :114~115 → damage 22, radius 110
│   ├── Lv3 :119~121 → damage 30, cooldown 600, knockback 14
│   ├── Lv4 :125~126 → radius 140, damage 40
│   └── Lv5 :130~133 → radius 180, knockback 20, damage 55, cooldown 500
└── 이미지: images/weapon_projectiles/effect_bottle_shield.png (AssetManager :42)

기저귀 (cross) — src/js/weapons/Cross.js
├── 기본 수치
│   ├── :9   damage: 18
│   ├── :10  cooldown: 1400
│   ├── :15  projectileCount: 1
│   ├── :16  sizeMultiplier: 1
│   └── :17  rangeMultiplier: 1
├── 투사체
│   ├── :56  size: 34 * sizeMultiplier * sizeMult
│   └── :57  maxRange: 220 * rangeMultiplier
├── 레벨업 (onUpgrade :68~96)
│   ├── Lv2 :71~72  → damage 25, range 1.2
│   ├── Lv3 :76~78  → damage 32, cooldown 1100, 투사체 2
│   ├── Lv4 :82~84  → damage 40, size 1.3, range 1.4
│   └── Lv5 :88~92  → damage 50, 투사체 3, size 1.5, range 1.6, cooldown 900
└── 이미지: images/weapon_projectiles/weapon_diaper.png (AssetManager :40)

장난감 폭탄 (firebomb) — src/js/weapons/Firebomb.js
├── 기본 수치
│   ├── :9   damage: 18
│   ├── :10  cooldown: 2500
│   ├── :15  areaRadius: 70
│   ├── :16  areaDuration: 3000
│   ├── :17  tickInterval: 350
│   └── :18  bombCount: 1
├── 레벨업 (onUpgrade :48~76)
│   ├── Lv2 :51~52  → damage 25, radius 85
│   ├── Lv3 :56~58  → damage 32, cooldown 2000, 폭탄 2개
│   ├── Lv4 :62~64  → damage 40, radius 100, duration 4000
│   └── Lv5 :68~72  → 폭탄 3개, radius 120, duration 5000, damage 50, cooldown 1600
└── 이미지: images/weapon_projectiles/effect_toy_bomb.png (AssetManager :44)

엄마 눈물 (lightning) — src/js/weapons/Lightning.js
├── 기본 수치
│   ├── :9   damage: 40
│   ├── :10  cooldown: 1100
│   ├── :15  strikeCount: 1
│   ├── :16  chainCount: 0
│   ├── :17  chainDamageRatio: 0.7
│   └── :18  chainRadius: 200
├── 레벨업 (onUpgrade :85~113)
│   ├── Lv2 :88~89  → damage 55, strike 2
│   ├── Lv3 :93~96  → damage 70, strike 3, chain 1, cooldown 900
│   ├── Lv4 :100~103 → damage 85, strike 4, chain 2, cooldown 700
│   └── Lv5 :107~110 → damage 100, strike 5, chain 3, cooldown 550
└── 이미지: images/weapon_projectiles/effect_mom_tears.png (AssetManager :41)

아빠 목소리 (holyWater) — src/js/weapons/HolyWater.js
├── 기본 수치
│   ├── :9   damage: 15
│   ├── :10  cooldown: 2000
│   ├── :15  radius: 100
│   ├── :16  effectDuration: 3000
│   ├── :17  leavesZone: false
│   ├── :18  zoneDuration: 3000
│   └── :19  tickRate: 50
├── 데미지 계산
│   ├── :27  메인: damage * 0.1 (틱당)
│   └── :41  잔여장판: damage * 0.05 (틱당)
├── 레벨업 (onUpgrade :54~81)
│   ├── Lv2 :57~58  → damage 22, radius 120
│   ├── Lv3 :62~64  → damage 30, cooldown 1600, radius 140
│   ├── Lv4 :68~70  → damage 40, radius 160, duration 4000
│   └── Lv5 :74~77  → radius 200, 잔여장판 true, damage 50, cooldown 1200
└── 이미지: images/weapon_projectiles/effect_dad_voice.png (AssetManager :43)
```

---

## 장비 (Equipment)

레지스트리: `EquipmentRegistry` (`src/js/data/EquipmentRegistry.js`)
최대 6개 (`MAX_EQUIPMENT`), 최대 레벨 5, 공통 공식: `pctBonus = 0.10 * level`

```
아빠 응원 (attackRing) — src/js/equipment/AttackRing.js
├── :13  pctBonus: 0.10 (레벨당 공격력 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_dad_cheer.png

아기 헬멧 (armor) — src/js/equipment/Armor.js
├── :13  pctBonus: 0.10 (레벨당 피해감소 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_helmet.png

아기 신발 (swiftBoots) — src/js/equipment/SwiftBoots.js
├── :13  pctBonus: 0.10 (레벨당 이속 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_shoes.png

낮잠 시계 (timeClock) — src/js/equipment/TimeClock.js
├── :13  pctBonus: 0.10 (레벨당 쿨다운감소 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_clock.png

두꺼운 안경 (sharpshooterGlass) — src/js/equipment/SharpshooterGlass.js
├── :13  pctBonus: 0.10 (레벨당 투사체크기 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_glasses.png

행운의 곰돌이 (luckyClover) — src/js/equipment/LuckyClover.js
├── :13  pctBonus: 0.10 (레벨당 경험치 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_bear.png

엄마 손수건 (magnetAmulet) — src/js/equipment/MagnetAmulet.js
├── :13  pctBonus: 0.10 (레벨당 흡수범위 +10%)
├── :25  레벨업: 0.10 * level
└── :11  이미지: images/equipment_icons/equip_handkerchief.png

젖병 목걸이 (lifeNecklace) — src/js/equipment/LifeNecklace.js
├── :13  pctBonus: 0.10 (레벨당 최대HP +10%)
├── :14  regenBonus: 0.5 (HP재생 초기값)
├── :32  레벨업: pctBonus = 0.10 * level
├── :33  레벨업: regenBonus = 0.5 + (level - 1) * 0.3
└── :11  이미지: images/equipment_icons/equip_bottle_necklace.png
```

장비 스탯 표시 공식: `LevelUpSystem.js :6~32` (수치 변경 시 함께 수정)

---

## 일반 몬스터 (Enemies)

레지스트리: `EnemyRegistry` (`src/js/data/EnemyRegistry.js`)

```
병균 (zombie) — src/js/entities/enemies/Zombie.js
├── 일반: :6 hp:20, :7 size:48, :8 speed:1.2, :9 damage:5, :10 exp:1
├── 미니: :6 hp:8,  :7 size:28, :8 speed:1.8, :9 damage:3, :10 exp:1
├── 분열: :29 2마리, :31 offset:20
├── :39  미니 스케일링: hp *= 1 + (stageNumber-1) * 0.3
├── 이미지: images/enemy_normal/germ/enemy_germ.png (AssetManager :8)
└── 이펙트: images/enemy_normal/germ/germ_effect.png (AssetManager :9)

B형 독감 (bat) — src/js/entities/enemies/Bat.js
├── :7 hp:8, :8 speed:3.5, :9 damage:3, :10 size:42, :14 exp:1
├── :18 zigzagAmplitude:40, :19 zigzagFrequency:3
├── :22 burstTimer:1.5+rand*2, :24 burstDuration:0.8, :26 burstSpeedMult:3
├── :31 restDuration:0.8
├── 이미지: images/enemy_normal/flu_b/enemy_flu_b.png (AssetManager :10)
└── 이펙트: images/enemy_normal/flu_b/flu_b_effect.png (AssetManager :11)

A형 독감 (skeleton) — src/js/entities/enemies/Skeleton.js
├── :7 hp:35, :8 speed:1.5, :9 damage:12, :10 size:52, :14 exp:2
├── :18 chargeTimer:2+rand*2, :19 chargeInterval:3.5
├── :21 chargeDuration:0.5, :25 chargeSpeed:8, :28 windUpDuration:0.6
├── 이미지: images/enemy_normal/flu_a/enemy_flu_a.png (AssetManager :12)
└── 이펙트: images/enemy_normal/flu_a/flu_a_effect.png (AssetManager :13)

감기 바이러스 (ghost) — src/js/entities/enemies/Ghost.js
├── :8 hp:15, :9 speed:2, :10 damage:10, :11 size:44, :15 exp:2
├── :19 shootInterval:2.5, :20 keepDistance:200
├── :24 teleportTimer:5+rand*3, :25 teleportCooldown:6, :28 fadeDuration:0.4
├── 확산탄: :120 count:3, :121 angle:0.3, :131 데미지:damage*0.7
├── :92  3발마다 확산탄
├── 이미지: images/enemy_normal/cold_virus/enemy_cold_virus.png (AssetManager :14)
└── 이펙트: images/enemy_normal/cold_virus/cold_virus_effect.png (AssetManager :15)

충치균 (knight) — src/js/entities/enemies/Knight.js
├── :8 hp:80, :9 speed:1, :10 damage:15, :11 size:60, :15 exp:3
├── 공격: :20 animDuration:0.6, :24 attackInterval:2.5
├── 보호막: :27 timer:4+rand*2, :28 duration:3, :31 cooldown:8, :48 감소:amount*0.2
├── 지면강타: :35 interval:5, :36 radius:120, :128 데미지:damage*0.8, :133 넉백:8
├── 분노(HP30%↓): :53 threshold:0.3, :55 speed*1.8, :56 damage*1.5
├── 이미지: images/enemy_normal/cavity/enemy_cavity_germ.png (AssetManager :16)
├── 이펙트: images/enemy_normal/cavity/cavity_effect.png (AssetManager :17)
└── 공격프레임: images/enemy_normal/cavity/cavity_attack_frame_[1-4].png (AssetManager :18~21)

장염균 (slime) — src/js/entities/enemies/Slime.js
├── :8 hp:30, :9 speed:2.5, :10 damage:25, :11 size:44, :14 exp:2
├── 자폭: :18 duration:1.5, :20 radius:90, :72 트리거거리:60
├── 독흔적: :25 interval:0.8, :26 radius:30, :27 duration:3000, :81 dmg:2, :83 tick:500
├── 폭발독: :109 dmg:3, :110 duration:4000, :111 tick:400
└── 이미지: images/enemy_normal/stomach_bug/enemy_stomach_bug.png (AssetManager :22)
```

---

## 보스 (Bosses)

```
과자 봉지 (giantSkeleton) — src/js/entities/enemies/bosses/GiantSkeleton.js
├── :8 hp:300, :9 speed:0.8, :10 damage:12, :11 size:90, :15 exp:20
├── :21 sweepInterval:3, :22 sweepRadius:100
├── 이미지: images/enemy_boss/snack_bag/boss_snack_bag.png (AssetManager :25)
└── 이펙트: images/enemy_boss/snack_bag/boss_snack_crumbs.png (AssetManager :26)

사탕 괴물 (necromancer) — src/js/entities/enemies/bosses/Necromancer.js
├── :10 hp:500, :11 speed:1.2, :12 damage:10, :13 size:88, :17 exp:50
├── :20 페이즈전환: HP 50%, :32 페이즈2속도: baseSpeed*1.5
├── 소환: :52 일반 5초/3마리, 페이즈2 4초/5마리
├── 총알: :62 일반 3초/3발, 페이즈2 2초/5발
├── 이미지: images/enemy_boss/candy_monster/boss_candy_monster.png (AssetManager :27)
└── 이펙트: images/enemy_boss/candy_monster/candy_stars.png (AssetManager :28)

스마트폰 (darkKnight) — src/js/entities/enemies/bosses/DarkKnight.js
├── :8 hp:600, :9 speed:1.5, :10 damage:20, :11 size:90, :15 exp:40
├── :21 chargeInterval:4, :23 chargeDuration:0.5, :24 chargeSpeed:8
├── 이미지: images/enemy_boss/smartphone/boss_smartphone.png (AssetManager :29)
└── 이펙트: images/enemy_boss/smartphone/boss_phone_speed.png (AssetManager :30)

아이스크림 (lich) — src/js/entities/enemies/bosses/Lich.js
├── :120 hp:800, :121 speed:1.3, :122 damage:15, :123 size:88, :127 exp:60
├── 장판: :133 interval:3, :134 radius:120, :135 duration:3, :162 dmg:5, slowFactor:0.5
├── 유도탄: :138 shootInterval:2, :9 speed:3, :10 turnSpeed:2
├── 이미지: images/enemy_boss/ice_cream/boss_ice_cream.png (AssetManager :31)
└── 이펙트: images/enemy_boss/ice_cream/boss_ice_cream_drip.png (AssetManager :32)

낡은 TV (vampireLord) — src/js/entities/enemies/bosses/VampireLord.js
├── :10 hp:1500, :11 speed:1.5, :12 damage:20, :13 size:100, :17 exp:100
├── 페이즈: :20 HP66%→phase2, :21 HP33%→phase3
├── 속도: :34 phase2 *1.3, :36 phase3 *1.5
├── P1(:62~78): :67 소환4초/2박쥐, :74 사격3초/3발
├── P2(:80~96): :85 소환3초/4박쥐, :92 링3초/8발
├── P3(:98~121): :103 텔레포트5초, :110 소환2초/3박쥐, :117 링3초/12발
├── :190 텔레포트거리: 300+rand*200
├── :209 흡혈: damageDealt * 0.1 (HP33%↓)
├── 이미지: images/enemy_boss/old_tv/boss_old_tv.png (AssetManager :33)
└── 이펙트: images/enemy_boss/old_tv/boss_tv_lightning.png (AssetManager :34)
```

---

## 드롭 아이템 (Items)

```
경험치 보석 (ExpGem) — src/js/items/ExpGem.js
├── 등급 (:4~10): T1 exp1/size5, T2 exp1/size6, T3 exp1/size7, T4 exp2/size9, T5 exp3/size11
├── 가중치 (:13): [50, 28, 14, 6, 2]
├── :31 duration: 0 (영구)
└── 흡수: :74 baseAccel:150, :77 maxSpeed:200

스탯 젬 (StatGem) — src/js/items/StatGem.js
├── 종류 (:4~9)
│   ├── :5 공격력: attackPower+0.2, dropStats.attack+0.2
│   ├── :6 이속: speedMultiplier+0.005
│   ├── :7 공속: attackSpeedMultiplier+0.005
│   └── :8 HP: maxHp+0.2, dropStats.maxHp+0.2
├── :16 duration: 30000 (30초)
└── :81 성장포인트: +1

고기 (Meat) — src/js/items/Meat.js
├── :8  duration: 15000 (15초)
└── :13 회복: hp+20

자석 (Magnet) — src/js/items/Magnet.js
├── :8  duration: 10000 (10초)
└── :18 효과: pullSpeed=9999, _magnetPull=true

폭탄 (Bomb) — src/js/items/Bomb.js
├── :8  duration: 12000 (12초)
├── :17 데미지: 100 (전체)
└── :24 플래시: rgba(255,255,255,0.8), :25 200ms
```

---

## 드롭 확률 — src/js/systems/DropSystem.js

```
├── :22~27  ExpGem: 100%
├── :30     StatGem: 0.03 + dropBonus * 0.01
├── :39     Meat: 0.07 + dropBonus * 0.03
├── :45     Magnet: 0.001 + dropBonus * 0.0005
└── :51     Bomb: 0.001 + dropBonus * 0.0005
```

---

## 레벨업 버프 — src/js/data/BuffData.js

```
├── :12  공격력(attack): attackPower += 1
├── :24  공속(attackSpeed): attackSpeedMultiplier += 0.02
├── :36  이속(speed): speedMultiplier += 0.02
├── :48  체력(maxHp): maxHp += 5
├── :61  HP회복(hpRecover): hp += 20
├── :73  투사체크기(projSize): projectileSizeMultiplier += 0.03
├── :85  투사체추가(projCount): projectileCountBonus += 1
├── :97  경험치(expBonus): expMultiplier += 0.05
├── :109 넉백(knockback): knockbackMultiplier += 0.05
├── :121 방어력(damageReduction): defense += 1
└── :134 체력재생(hpRegen): hpRegen += 0.3
```

---

## 플레이어 — src/js/entities/Player.js

```
기본 스탯 (:29~33)
├── :30 hp:80, :31 attack:5, :32 speed:1.5, :33 defense:0

성장 단계 (GROWTH_STAGES :12~18)
├── Lv1 :13 누워있는아기 → hp+0,  speed:1.5, size:48, sprite:level1_baby_lying
├── Lv2 :14 기는아기     → hp+20, speed:2.0, size:54, sprite:level2_baby_crawling
├── Lv3 :15 일어서는아기 → hp+40, speed:2.5, size:60, sprite:level3_baby_wobble
├── Lv4 :16 유치원생     → hp+60, speed:3.2, size:66, sprite:level4_kindergartener
└── Lv5 :17 초등학생     → hp+80, speed:4.0, size:72, sprite:level5_elementary

성장 필요 포인트 (:22): [0, 25, 58, 100, 158]
```

---

## 스폰 & 난이도 — src/js/systems/SpawnSystem.js

```
├── :8  baseSpawnInterval: 400ms
├── :13 maxEnemies: 180 + stageNumber * 60
├── 스폰 간격: :36 stage1=2.0배느림, 이후=0.88^(stage-1) | :37 1분마다 20%단축
├── 동시 스폰: :43 stage≤2→1, 이후→min(4, 1+floor(stage/2)) | :44 1분마다 +2
├── 몬스터 HP: :82 stage별, :87 1분+40%, :93 성장레벨+30%, :95 공격드롭+1%
└── 몬스터 속도: :102 base0.7, :103 1분+0.15, :104 stage+6%
```

---

## 스테이지 — src/js/stages/StageData.js

```
├── S1  :3~12   거실(livingroom)      병균                              보스 없음
├── S2  :14~24  거실(livingroom)      병균,B형독감                     보스 없음
├── S3  :26~37  아기방(babyroom)      병균,B형독감,A형독감             과자봉지(giantSkeleton) @270초
├── S4  :39~51  아기방(babyroom)      병균,B형독감,A형독감,감기바이러스 보스 없음
├── S5  :53~65  키즈카페(kidscafe)    병균,B형독감,A형독감,감기바이러스 사탕괴물(necromancer) @270초
├── S6  :67~80  키즈카페(kidscafe)    병균,B형독감,A형독감,감기바이러스,충치균 보스 없음
├── S7  :82~94  어린이집(kindergarten) B형독감,A형독감,감기바이러스,충치균 스마트폰(darkKnight) @270초
├── S8  :96~108 어린이집(kindergarten) A형독감,감기바이러스,충치균,장염균 보스 없음
├── S9  :110~121 놀이터(playground)   감기바이러스,충치균,장염균         아이스크림(lich) @270초
└── S10 :123~137 놀이터(playground)   B형독감,A형독감,감기바이러스,충치균,장염균 낡은TV(vampireLord) @270초

수정 항목: duration(초), spawnConfig[{type,weight}], bossConfig{type,spawnAtTime}
```

---

## 스테이지 클리어 시 상태 — Player.js `resetForNewRound()`

```
├── [유지] growthLevel, growthPoints, killCount, dropStats
└── [초기화] weapons→제거, equipment→제거, buffStacks→제거, level→1, exp→0, HP→최대
```

---

## 게임 상수 — src/js/data/Constants.js

```
├── :1 CANVAS_WIDTH:800, :2 CANVAS_HEIGHT:600, :3 WORLD_SIZE:3000
├── :5 PLAYER_BASE_HP:100, :6 PLAYER_BASE_SPEED:3, :7 PLAYER_SIZE:48
├── :8 PLAYER_INVINCIBLE_TIME:500ms
├── :10 MAX_WEAPONS:4, :11 MAX_WEAPON_LEVEL:5
├── :12 MAX_EQUIPMENT:6, :13 MAX_EQUIPMENT_LEVEL:5
├── :17 EXP_PICKUP_RADIUS:50, :18 MAGNET_PICKUP_RADIUS:500
└── 레벨업 경험치: Player.js 내 Math.round(Math.pow(level, 1.8) * 2.5)
```

---

## 시스템 & UI 파일 맵

```
시스템
├── Game              → src/js/core/Game.js
├── Camera            → src/js/core/Camera.js
├── InputManager      → src/js/core/InputManager.js
├── AssetManager      → src/js/core/AssetManager.js
├── SaveSystem        → src/js/core/SaveSystem.js
├── SpawnSystem       → src/js/systems/SpawnSystem.js
├── DropSystem        → src/js/systems/DropSystem.js
├── CollisionSystem   → src/js/systems/CollisionSystem.js
└── LevelUpSystem     → src/js/systems/LevelUpSystem.js

UI
├── StartScreen            → src/js/ui/StartScreen.js
├── CharacterSelectScreen  → src/js/ui/CharacterSelectScreen.js
├── WeaponSelectUI         → src/js/ui/WeaponSelectUI.js
├── WeaponSwapUI           → src/js/ui/WeaponSwapUI.js
├── LevelUpUI              → src/js/ui/LevelUpUI.js
├── HUD                    → src/js/ui/HUD.js
└── GameOverScreen         → src/js/ui/GameOverScreen.js
```

---

## 스프라이트 이미지 전체 경로 — src/js/core/AssetManager.js (SPRITE_CONFIG)

```
몬스터:    :8~22   images/enemy_normal/{germ,flu_b,flu_a,cold_virus,cavity,stomach_bug}/
보스:      :25~34  images/enemy_boss/{snack_bag,candy_monster,smartphone,ice_cream,old_tv}/
무기투사체: :37~49  images/weapon_projectiles/
적탄환:    :50     images/enemy_normal/cold_virus/ghost_bullet.png
아이템:    :59~63  images/field_items/
장비아이콘: 각 장비파일 :11  images/equipment_icons/
```
