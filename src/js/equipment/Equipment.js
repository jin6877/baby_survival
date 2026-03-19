// Equipment: 모든 장비의 베이스 클래스
export class Equipment {
    constructor(config = {}) {
        this.name = config.name || '알 수 없는 장비';
        this.description = config.description || '';
        this.icon = config.icon || '?';
        this.color = config.color || '#ffd740';
        this.imageSrc = config.imageSrc || null;
        this.image = null;
        this.level = 1;
        this.maxLevel = 5;

        // 이미지 로드
        if (this.imageSrc) {
            this.image = new Image();
            this.image.src = this.imageSrc;
        }
    }

    // 장비 효과 적용 (플레이어 스탯에 반영)
    apply(player) {
        // 서브클래스에서 구현
    }

    // 장비 효과 제거
    remove(player) {
        // 서브클래스에서 구현
    }

    // 레벨업 - 기존 효과 제거 후 새 효과 적용
    levelUp(player) {
        if (this.level >= this.maxLevel) return;
        this.remove(player);
        this.level++;
        this.onLevelUp();
        this.apply(player);
    }

    // 레벨업 시 스탯 변경
    onLevelUp() {
        // 서브클래스에서 구현
    }

    getDescription() {
        return `${this.icon} ${this.name} Lv.${this.level}: ${this.description}`;
    }
}
