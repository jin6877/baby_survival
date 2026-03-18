# 밸런스 조정 & 장비 시스템 설계 문서

## 📌 이 문서는 개발 시 항상 참고해야 합니다

---

## 1. 밸런스 조정 원칙

### 경험치 (보라색 게이지)
- **이전**: expToNext = level * 5 + 5 → 레벨 1에서 10 필요, 레벨 10에서 55 필요
- **변경**: expToNext = level * 3 + 3 → 더 빠른 레벨업
- 경험치 보석 값: 소형 = 2 (이전 1), 대형 = 8 (이전 5)
- 적 처치 시 경험치 다중 드롭: 한 적에서 1~2개 보석 드롭 가능

### 무기 드롭 빈도
- **이전**: 30~45초 간격
- **변경**: 15~25초 간격
- 첫 무기 드롭: 3초 후 (이전 5초)
- WeaponPickup 지속시간: 30초 (이전 20초)

### 몬스터 수량 & 난이도
- **maxEnemies**: 50 + stageNumber * 15 (이전 30 + stageNumber * 12)
- **기본 스폰 간격**: 1200ms (이전 2000ms)
- 스테이지별 스폰 간격 감소: 0.88배 (이전 0.85배)
- 몬스터가 더 많이 나오지만, 무기/경험치도 더 많으므로 학살의 재미 제공

### 몬스터 HP 스케일링
- 스테이지별 HP 증가: +15% (이전 +20%)
- 스테이지별 속도 증가: +3% (이전 +5%)
- → 몬스터가 약간 더 약해지지만 수가 많아 전체 난이도 유지

---

## 2. 무기 교체 시스템 (버그 수정)
- 무기 4개가 다 찬 상태에서 무기 픽업 시 **반드시 게임 일시정지**
- WeaponSwapUI.show()에서 game.paused = true 확실히 설정
- game.state를 'weaponswap'으로 변경하여 update() 차단

---

## 3. 무기 밸런스 조정

### 기존 무기 상향 조정
| 무기 | 이전 | 변경 | 이유 |
|------|------|------|------|
| 성수 | DMG 5, CD 3000ms | DMG 8, CD 2500ms, radius 80 | 범위 넓히고 데미지 올려 쓸모있게 |
| 도끼 | DMG 20, CD 2000ms | DMG 25, CD 1800ms | 높은 한방 데미지로 차별화 |
| 마법봉 | DMG 12, CD 1500ms | DMG 15, CD 1200ms | 유도 장점 살리기 |
| 번개 | DMG 25, CD 2000ms | DMG 30, CD 1800ms, chain 1 from Lv3 | 즉발 장점 강화 |
| 마늘 | DMG 4, CD 1500ms, radius 50 | DMG 8, CD 1000ms, radius 70 | 근접 생존형으로 강화 |
| 화염병 | DMG 10, CD 3500ms | DMG 15, CD 2800ms, radius 65 | 지역 제압 특화 |

---

## 4. 장비 시스템 (Equipment System)

### 개요
- 무기와는 별도의 **패시브 장비 슬롯** (최대 6개)
- 장비는 필드에서 픽업하여 획득
- 같은 장비를 중복 획득하면 레벨업 (최대 레벨 5)
- 장비는 상시 패시브 효과 제공

### 장비 목록

| 장비 | 효과 | 레벨업 보너스 |
|------|------|--------------|
| 🧲 자석 부적 | 경험치 흡수 범위 +40% | 레벨당 +30% 추가 |
| 🛡️ 갑옷 | 받는 데미지 -15% | 레벨당 -10% 추가 |
| 👟 민첩의 장화 | 이동속도 +12% | 레벨당 +8% 추가 |
| 💎 공격의 반지 | 공격력 +15% | 레벨당 +10% 추가 |
| ❤️ 생명의 목걸이 | 최대 HP +20, HP 재생 0.5/초 | 레벨당 HP+15, 재생+0.3 |
| ⏱️ 시간의 시계 | 쿨다운 감소 -8% | 레벨당 -6% 추가 |
| 🎯 명사수의 안경 | 투사체 크기 +15%, 속도 +10% | 레벨당 크기+10%, 속도+5% |
| 🍀 행운의 클로버 | 아이템 드롭률 +25% | 레벨당 +15% 추가 |

### 장비 드롭 조건
- 적 처치 시 1% 확률로 랜덤 장비 드롭
- 스테이지 클리어 시 보장 1개 드롭
- 장비 픽업 아이템은 30초 후 소멸

### 장비 슬롯 UI
- HUD 오른쪽 하단에 장비 슬롯 6칸 표시
- 장비 아이콘 + 레벨 표시

---

## 5. 레벨업 선택지 확장
기존 6개 + 새로운 3개 추가:
- **경험치 보너스**: 획득 경험치 +20%
- **HP 최대치 증가**: 최대 HP +25
- **넉백 강화**: 넉백 거리 +30%

---

## 6. 코드 아키텍처 (장비 시스템)

### 새 파일 구조
```
src/js/
├── equipment/
│   ├── Equipment.js          // 장비 베이스 클래스
│   ├── MagnetAmulet.js       // 자석 부적
│   ├── Armor.js              // 갑옷
│   ├── SwiftBoots.js         // 민첩의 장화
│   ├── AttackRing.js         // 공격의 반지
│   ├── LifeNecklace.js       // 생명의 목걸이
│   ├── TimeClock.js          // 시간의 시계
│   ├── SharpshooterGlass.js  // 명사수의 안경
│   └── LuckyClover.js        // 행운의 클로버
├── items/
│   └── EquipmentPickup.js    // 장비 픽업 아이템
├── data/
│   └── EquipmentRegistry.js  // 장비 레지스트리
```

### Equipment 베이스 클래스 인터페이스
```javascript
class Equipment {
    constructor(config) { ... }
    apply(player)    // 장비 효과 적용
    remove(player)   // 장비 효과 제거
    levelUp()        // 레벨업
    getDescription() // 현재 레벨 효과 설명
}
```

### Player 확장
```javascript
// Player에 추가되는 속성
this.equipment = [];           // 장비 배열
this.maxEquipment = 6;         // 최대 장비 수
this.damageReduction = 0;      // 데미지 감소율
this.expMultiplier = 1;        // 경험치 배율
this.hpRegen = 0;              // HP 초당 재생
this.knockbackMultiplier = 1;  // 넉백 배율
this.dropRateBonus = 0;        // 드롭률 보너스
this.projectileSpeedMultiplier = 1; // 투사체 속도 배율
this.cooldownReduction = 0;    // 쿨다운 감소율
```

---

## 7. 스프라이트 교체 가이드
- `AssetManager.js`의 `SPRITE_CONFIG`에서 각 엔티티의 `src` 값을 이미지 경로로 변경
- 장비 아이콘: `SPRITE_CONFIG`에 `equipment_` 접두사로 등록
- 이미지 없을 경우 자동으로 fallbackShape/fallbackColor 사용
