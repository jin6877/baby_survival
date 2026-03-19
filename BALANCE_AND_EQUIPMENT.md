# Baby Survival - 밸런스 조정 & 장비 시스템 설계 문서

## 📌 이 문서는 개발 시 항상 참고해야 합니다

---

## 1. 밸런스 조정 원칙

### 경험치 (별 모양 게이지)

- `expToNext = level * 3 + 3` → 빠른 레벨업으로 성장감 제공
- 경험치 별 값: 소형 = 2, 대형 = 8
- 적 처치 시 1~2개 별 드롭 가능

### 무기 드롭 빈도

- **드롭 간격**: 15~25초
- 첫 무기 드롭: 3초 후
- WeaponPickup 지속시간: 30초

### 몬스터 수량 & 난이도

- **maxEnemies**: 50 + stageNumber \* 15
- **기본 스폰 간격**: 1200ms
- 스테이지별 스폰 간격 감소: 0.88배

### 몬스터 HP/속도 스케일링

- 스테이지별 HP 증가: +15%
- 스테이지별 속도 증가: +3%

---

## 2. 아기 성장 단계별 스탯 보너스

| 단계 | 이름          | HP 보너스 | 이동속도 | 무기슬롯 | 추가 효과                  |
| ---- | ------------- | --------- | -------- | -------- | -------------------------- |
| 1    | 안겨있는 아기 | 기본(80)  | 1.5      | 4        | 히트박스 10% 작음          |
| 2    | 기는 아기     | +20(100)  | 2.0      | 4        | 없음                       |
| 3    | 일어서는 아기 | +20(120)  | 2.5      | 4        | 점프 회피 해금 (쿨 3초)    |
| 4    | 유치원생      | +20(140)  | 3.2      | 4        | 특수 스킬 슬롯 1개 해금    |
| 5    | 초등학생      | +20(160)  | 4.0      | 6        | 무기 슬롯 6개, 대시 해금   |
| 6    | 청소년        | +20(180)  | 4.5      | 6        | 엔딩 전용 (스탯 변화 없음) |

---

## 3. 무기 교체 시스템

- 무기 슬롯이 꽉 찬 상태에서 무기 픽업 시 **게임 일시정지**
- WeaponSwapUI.show() → game.paused = true
- game.state = 'weaponswap'으로 update() 차단

---

## 4. 무기 밸런스

### 무기별 기본 스탯

| 무기        | 데미지 | 쿨다운 | 특이사항                |
| ----------- | ------ | ------ | ----------------------- |
| 엄마 손     | 15     | 800ms  | 시작 무기, 자동 조준    |
| 아빠 목소리 | 8      | 2500ms | 범위 80, 지속 충격파    |
| 아빠 슬리퍼 | 25     | 1800ms | 포물선 낙하, 큰 판정    |
| 엄마 잔소리 | 15     | 1200ms | 호밍, 폭발 효과         |
| 기저귀      | 12     | 1500ms | 부메랑 회전, 관통       |
| 엄마 눈물   | 30     | 1800ms | 즉발, Lv3부터 체인      |
| 젖병 방어막 | 8      | 1000ms | 범위 70, 강한 넉백      |
| 장난감 폭탄 | 15     | 2800ms | 범위 65, 지속 폭발 영역 |

### 업그레이드 단계별 강화

- Lv1: 기본
- Lv2: 데미지 +30%
- Lv3: 공격속도 +25%
- Lv4: 투사체/범위 증가
- Lv5: 특수 효과 해금

---

## 5. 장비 시스템 (Equipment System)

### 개요

- 무기와는 별도의 **패시브 장비 슬롯** (기본 4개, 초등학생 이후 6개)
- 장비는 필드에서 픽업하여 획득
- 같은 장비 중복 획득 시 레벨업 (최대 레벨 5)
- 장비는 상시 패시브 효과 제공

### 장비 목록

| 장비              | 아이콘 | 컨셉                  | 효과                        | 레벨업 보너스            |
| ----------------- | ------ | --------------------- | --------------------------- | ------------------------ |
| **엄마 손수건**   | 🧣     | 엄마가 챙겨준 손수건  | 경험치 흡수 범위 +40%       | 레벨당 +30%              |
| **아기 헬멧**     | ⛑️     | 안전 헬멧             | 받는 데미지 -15%            | 레벨당 -10%              |
| **아기 신발**     | 👟     | 빠른 발걸음           | 이동속도 +12%               | 레벨당 +8%               |
| **아빠 응원**     | 💪     | 아빠의 응원이 힘이 됨 | 공격력 +15%                 | 레벨당 +10%              |
| **젖병 목걸이**   | 🍼     | 영양 공급             | 최대 HP +20, HP 재생 0.5/초 | 레벨당 HP+15, 재생+0.3   |
| **낮잠 시계**     | ⏰     | 낮잠으로 피로 회복    | 쿨다운 감소 -8%             | 레벨당 -6%               |
| **두꺼운 안경**   | 🔍     | 잘 보임               | 투사체 크기 +15%, 속도 +10% | 레벨당 크기+10%, 속도+5% |
| **행운의 곰돌이** | 🧸     | 행운을 주는 곰돌이    | 아이템 드롭률 +25%          | 레벨당 +15%              |

### 장비 드롭 조건

- 적 처치 시 1% 확률로 랜덤 장비 드롭
- 스테이지 클리어 시 보장 1개 드롭
- 장비 픽업 아이템은 30초 후 소멸

### 장비 슬롯 UI

- HUD 우측 하단에 장비 슬롯 표시
- 장비 아이콘 + 레벨 표시

---

## 6. 레벨업 선택지 (총 9종)

| 선택지        | 효과             |
| ------------- | ---------------- |
| 체력 회복     | HP +20 즉시 회복 |
| 이동속도 증가 | 이동속도 +10%    |
| 공격력 강화   | 공격력 +15%      |
| 공격속도 증가 | 공격속도 +10%    |
| 투사체 크기   | 투사체 크기 +15% |
| 투사체 수     | 투사체 수 +1     |
| 경험치 보너스 | 획득 경험치 +20% |
| 최대 HP 증가  | 최대 HP +25      |
| 넉백 강화     | 넉백 거리 +30%   |

---

## 7. 모바일 최적화 설정

### 캔버스 설정

- 기준 해상도: **960 x 540** (16:9 가로형)
- `canvas.style.width/height`로 실제 화면에 맞게 스케일
- `devicePixelRatio` 대응으로 레티나 디스플레이 선명하게 출력

### 터치 이벤트

- `touchstart`, `touchmove`, `touchend` 사용 (passive: true)
- 조이스틱: 좌측 50% 영역에서 드래그 감지
- 멀티터치 지원 (조이스틱 + 스킬 버튼 동시)

### 성능 최적화

- 오브젝트 풀링으로 투사체/파티클 재사용
- `requestAnimationFrame` 기반 게임 루프
- 화면 밖 오브젝트 렌더링 스킵

### 화면 방향 강제

```html
<meta
	name="viewport"
	content="width=device-width, initial-scale=1, orientation=landscape"
/>
```

- 세로 모드 진입 시 "가로로 돌려주세요" 안내 표시

---

## 8. 코드 아키텍처 (장비 + 성장 시스템)

### 새 파일 구조

```
src/js/
├── equipment/
│   ├── Equipment.js          // 장비 베이스 클래스
│   ├── MomHandkerchief.js    // 엄마 손수건
│   ├── BabyHelmet.js         // 아기 헬멧
│   ├── BabyShoes.js          // 아기 신발
│   ├── DadCheer.js           // 아빠 응원
│   ├── BottleNecklace.js     // 젖병 목걸이
│   ├── NapClock.js           // 낮잠 시계
│   ├── ThickGlasses.js       // 두꺼운 안경
│   └── LuckyBear.js          // 행운의 곰돌이
├── player/
│   └── GrowthStage.js        // 성장 단계 관리
├── items/
│   └── EquipmentPickup.js    // 장비 픽업 아이템
├── data/
│   └── EquipmentRegistry.js  // 장비 레지스트리
```

### Equipment 베이스 클래스

```javascript
class Equipment {
    constructor(config) { ... }
    apply(player)    // 장비 효과 적용
    remove(player)   // 장비 효과 제거
    levelUp()        // 레벨업
    getDescription() // 현재 레벨 효과 설명
}
```

### GrowthStage 클래스

```javascript
class GrowthStage {
    constructor() {
        this.stage = 1; // 1: 안겨있는 아기 ~ 6: 청소년
    }
    checkAndGrow(clearedStage)  // 스테이지 클리어 후 성장 여부 확인
    applyStageBonus(player)     // 현재 단계 스탯 보너스 적용
    getSpriteName()             // 현재 단계 스프라이트 이름
    playGrowthCutscene()        // 성장 연출 재생
}
```

### Player 속성 확장

```javascript
// 기존 속성 + 아기 버전 추가 속성
this.growthStage = new GrowthStage(); // 성장 단계
this.equipment = []; // 장비 배열
this.maxEquipment = 4; // 최대 장비 수 (초등학생: 6)
this.damageReduction = 0; // 데미지 감소율
this.expMultiplier = 1; // 경험치 배율
this.hpRegen = 0; // HP 초당 재생
this.knockbackMultiplier = 1; // 넉백 배율
this.dropRateBonus = 0; // 드롭률 보너스
this.cooldownReduction = 0; // 쿨다운 감소율
```

---

## 9. 스프라이트 교체 가이드

### 아기 성장 단계 스프라이트

```javascript
// AssetManager.js의 SPRITE_CONFIG에 등록
SPRITE_CONFIG = {
    'player_stage1': { src: 'assets/baby/stage1_bundled.png', ... },
    'player_stage2': { src: 'assets/baby/stage2_crawling.png', ... },
    'player_stage3': { src: 'assets/baby/stage3_standing.png', ... },
    'player_stage4': { src: 'assets/baby/stage4_kindergarten.png', ... },
    'player_stage5': { src: 'assets/baby/stage5_elementary.png', ... },
    'player_stage6': { src: 'assets/baby/stage6_teen.png', ... },
}
```

### 적 스프라이트 네이밍 규칙

- `enemy_germ`, `enemy_virus`, `enemy_mosquito`
- `enemy_mold`, `enemy_pigeon`, `enemy_supergerm`
- 보스: `boss_germking`, `boss_virusking`, ...

### 무기 아이콘 네이밍

- `weapon_momhand`, `weapon_dadvoice`, `weapon_dadslipper`
- `weapon_momnagging`, `weapon_diaper`, `weapon_momtears`
- `weapon_bottleshield`, `weapon_toybomb`

### 장비 아이콘 네이밍

- `equip_handkerchief`, `equip_helmet`, `equip_shoes`
- `equip_dadcheer`, `equip_bottle`, `equip_clock`
- `equip_glasses`, `equip_bear`

- 이미지 없을 경우 자동으로 fallbackShape/fallbackColor 사용
