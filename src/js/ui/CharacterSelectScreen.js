// CharacterSelectScreen: 아기 캐릭터 선택 + 이름 입력
import { assets } from '../core/AssetManager.js';
import { SaveSystem } from '../core/SaveSystem.js';

// roundRect 폴리필
function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

const BABY_TYPES = [
    { id: 0, name: '아기 1', color: '#4fc3f7', desc: '기본 아기' },
    { id: 1, name: '아기 2', color: '#f48fb1', desc: '핑크 아기' },
    { id: 2, name: '아기 3', color: '#81c784', desc: '초록 아기' },
    { id: 3, name: '아기 4', color: '#ffb74d', desc: '오렌지 아기' },
];

export default class CharacterSelectScreen {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.selectedType = 0;
        this.babyName = '';
        this.maxNameLength = 8;
        this.blinkTimer = 0;
        this.phase = 'select'; // 'select' | 'name'
        this.cursorBlink = 0;

        // 키보드 입력 처리
        this._onKeyDown = (e) => this._handleKey(e);

        // 저장 데이터 확인
        this.saveData = SaveSystem.load();
        this.showContinue = false;
    }

    show() {
        this.active = true;
        this.phase = 'select';
        this.selectedType = 0;
        this.babyName = '';
        this.blinkTimer = 0;
        this.cursorBlink = 0;
        this.saveData = SaveSystem.load();
        this.showContinue = !!(this.saveData && this.saveData.maxStage > 1);

        // 이전 저장 데이터가 있으면 기본값 복원
        if (this.saveData) {
            this.selectedType = this.saveData.babyType || 0;
            this.babyName = this.saveData.babyName || '';
        }

        window.addEventListener('keydown', this._onKeyDown);
    }

    hide() {
        this.active = false;
        window.removeEventListener('keydown', this._onKeyDown);
    }

    _handleKey(e) {
        if (!this.active) return;
        e.preventDefault();

        if (this.phase === 'select') {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.selectedType = (this.selectedType - 1 + BABY_TYPES.length) % BABY_TYPES.length;
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.selectedType = (this.selectedType + 1) % BABY_TYPES.length;
            } else if (e.code === 'Enter' || e.code === 'Space') {
                this.phase = 'name';
            } else if (e.code === 'KeyC' && this.showContinue) {
                // C키로 이어하기
                this.babyName = this.saveData.babyName || '아기';
                this.selectedType = this.saveData.babyType || 0;
                this._confirm(true);
            }
        } else if (this.phase === 'name') {
            if (e.code === 'Backspace') {
                this.babyName = this.babyName.slice(0, -1);
            } else if (e.code === 'Enter') {
                if (this.babyName.trim().length === 0) {
                    this.babyName = BABY_TYPES[this.selectedType].name;
                }
                this._confirm(false);
            } else if (e.code === 'Escape') {
                this.phase = 'select';
            } else if (e.key && e.key.length === 1 && this.babyName.length < this.maxNameLength) {
                // Space는 이름에 허용
                this.babyName += e.key;
            }
        }
    }

    _confirm(continueFromSave) {
        const name = this.babyName.trim() || BABY_TYPES[this.selectedType].name;
        const type = this.selectedType;

        // 저장
        const maxStage = continueFromSave && this.saveData ? this.saveData.maxStage : 1;
        SaveSystem.save({
            babyName: name,
            babyType: type,
            maxStage: maxStage,
        });

        this.hide();

        // 게임 시작
        this.game.babyName = name;
        this.game.babyType = type;
        this.game.startGame(continueFromSave ? maxStage - 1 : 0);
    }

    handleClick(mx, my, W, H) {
        if (!this.active) return;

        if (this.phase === 'select') {
            // 캐릭터 카드 클릭
            const cardW = 100;
            const cardH = 130;
            const gap = 20;
            const totalW = BABY_TYPES.length * cardW + (BABY_TYPES.length - 1) * gap;
            const startX = W / 2 - totalW / 2;
            const cardY = H / 2 - 40;

            for (let i = 0; i < BABY_TYPES.length; i++) {
                const x = startX + i * (cardW + gap);
                if (mx >= x && mx <= x + cardW && my >= cardY && my <= cardY + cardH) {
                    this.selectedType = i;
                    this.phase = 'name';
                    return;
                }
            }

            // 이어하기 버튼 클릭
            if (this.showContinue) {
                const btnW = 200;
                const btnH = 40;
                const btnX = W / 2 - btnW / 2;
                const btnY = H / 2 + 140;
                if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
                    this.babyName = this.saveData.babyName || '아기';
                    this.selectedType = this.saveData.babyType || 0;
                    this._confirm(true);
                    return;
                }
            }
        } else if (this.phase === 'name') {
            // 확인 버튼
            const btnW = 160;
            const btnH = 44;
            const btnX = W / 2 - btnW / 2;
            const btnY = H / 2 + 80;
            if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
                if (this.babyName.trim().length === 0) {
                    this.babyName = BABY_TYPES[this.selectedType].name;
                }
                this._confirm(false);
            }

            // 뒤로 버튼
            const backW = 100;
            const backH = 34;
            const backX = W / 2 - backW / 2;
            const backY = H / 2 + 135;
            if (mx >= backX && mx <= backX + backW && my >= backY && my <= backY + backH) {
                this.phase = 'select';
            }
        }
    }

    render(ctx, W, H) {
        if (!this.active) return;

        this.blinkTimer += 0.02;
        this.cursorBlink += 0.04;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;

        if (this.phase === 'select') {
            this._renderSelectPhase(ctx, W, H, centerX);
        } else {
            this._renderNamePhase(ctx, W, H, centerX);
        }
    }

    _renderSelectPhase(ctx, W, H, centerX) {
        // 타이틀
        ctx.save();
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('아기를 선택하세요', centerX, H / 2 - 130);
        ctx.restore();

        // 캐릭터 카드
        const cardW = 100;
        const cardH = 130;
        const gap = 20;
        const totalW = BABY_TYPES.length * cardW + (BABY_TYPES.length - 1) * gap;
        const startX = W / 2 - totalW / 2;
        const cardY = H / 2 - 40;

        for (let i = 0; i < BABY_TYPES.length; i++) {
            const baby = BABY_TYPES[i];
            const x = startX + i * (cardW + gap);
            const selected = i === this.selectedType;

            // 카드 배경
            ctx.fillStyle = selected ? 'rgba(79, 195, 247, 0.3)' : 'rgba(50, 50, 70, 0.6)';
            ctx.strokeStyle = selected ? '#4fc3f7' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = selected ? 3 : 1;
            drawRoundRect(ctx, x, cardY, cardW, cardH, 10);
            ctx.fill();
            ctx.stroke();

            // 아기 미리보기 (색 원으로)
            const previewX = x + cardW / 2;
            const previewY = cardY + 45;
            const previewR = 28;

            // 아기 이미지 시도
            const spriteKey = 'level1_baby_lying_front';
            const img = assets.images[spriteKey];
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                if (baby.id > 0) {
                    // 색 틴트 오버레이
                    ctx.drawImage(img, previewX - previewR, previewY - previewR, previewR * 2, previewR * 2);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.globalAlpha = 0.35;
                    ctx.fillStyle = baby.color;
                    ctx.fillRect(previewX - previewR, previewY - previewR, previewR * 2, previewR * 2);
                } else {
                    ctx.drawImage(img, previewX - previewR, previewY - previewR, previewR * 2, previewR * 2);
                }
                ctx.restore();
            } else {
                // 폴백: 색 원
                ctx.fillStyle = baby.color;
                ctx.beginPath();
                ctx.arc(previewX, previewY, previewR, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#000';
                ctx.font = '20px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👶', previewX, previewY);
            }

            // 이름
            ctx.fillStyle = selected ? '#fff' : '#aaa';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(baby.desc, x + cardW / 2, cardY + cardH - 25);

            // 선택 표시
            if (selected) {
                ctx.fillStyle = '#4fc3f7';
                ctx.font = 'bold 14px monospace';
                ctx.fillText('▼', x + cardW / 2, cardY - 12);
            }
        }

        // 조작법
        const isMobile = this.game.input.isMobile;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        if (isMobile) {
            ctx.fillText('캐릭터를 터치하여 선택', centerX, cardY + cardH + 30);
        } else {
            const hint = this.showContinue
                ? '← → 선택  |  ENTER 확인  |  C 이어하기'
                : '← → 선택  |  ENTER 확인';
            ctx.fillText(hint, centerX, cardY + cardH + 30);
        }

        // 이어하기 버튼
        if (this.showContinue) {
            const btnW = 200;
            const btnH = 40;
            const btnX = W / 2 - btnW / 2;
            const btnY = H / 2 + 140;

            ctx.fillStyle = 'rgba(255, 183, 77, 0.3)';
            ctx.strokeStyle = '#ffb74d';
            ctx.lineWidth = 2;
            drawRoundRect(ctx, btnX, btnY, btnW, btnH, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffb74d';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const stageText = `이어하기 (Stage ${this.saveData.maxStage})`;
            ctx.fillText(stageText, W / 2, btnY + btnH / 2);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '12px monospace';
            ctx.fillText(`${this.saveData.babyName}`, W / 2, btnY + btnH + 16);
        }
    }

    _renderNamePhase(ctx, W, H, centerX) {
        const baby = BABY_TYPES[this.selectedType];

        // 타이틀
        ctx.save();
        ctx.shadowColor = baby.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('이름을 지어주세요', centerX, H / 2 - 100);
        ctx.restore();

        // 선택된 캐릭터 미리보기
        const previewY = H / 2 - 40;
        const previewR = 35;
        const spriteKey = 'level1_baby_lying_front';
        const img = assets.images[spriteKey];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.drawImage(img, centerX - previewR, previewY - previewR, previewR * 2, previewR * 2);
            if (baby.id > 0) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = baby.color;
                ctx.fillRect(centerX - previewR, previewY - previewR, previewR * 2, previewR * 2);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = baby.color;
            ctx.beginPath();
            ctx.arc(centerX, previewY, previewR, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '28px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👶', centerX, previewY);
        }

        // 이름 입력 필드
        const fieldW = 240;
        const fieldH = 40;
        const fieldX = centerX - fieldW / 2;
        const fieldY = H / 2 + 20;

        ctx.fillStyle = 'rgba(30, 30, 50, 0.8)';
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, fieldX, fieldY, fieldW, fieldH, 8);
        ctx.fill();
        ctx.stroke();

        // 이름 텍스트
        const displayName = this.babyName;
        const cursor = Math.sin(this.cursorBlink * 3) > 0 ? '|' : '';
        ctx.fillStyle = displayName ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            displayName ? displayName + cursor : '이름을 입력하세요...',
            centerX,
            fieldY + fieldH / 2
        );

        // 확인 버튼
        const btnW = 160;
        const btnH = 44;
        const btnX = centerX - btnW / 2;
        const btnY = H / 2 + 80;

        ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, btnX, btnY, btnW, btnH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const isMobile = this.game.input.isMobile;
        ctx.fillText(isMobile ? '시작하기' : '시작 (ENTER)', centerX, btnY + btnH / 2);

        // 뒤로 버튼
        const backW = 100;
        const backH = 34;
        const backX = centerX - backW / 2;
        const backY = H / 2 + 135;

        ctx.fillStyle = 'rgba(100,100,100,0.3)';
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        drawRoundRect(ctx, backX, backY, backW, backH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '14px monospace';
        ctx.fillText(isMobile ? '뒤로' : '뒤로 (ESC)', centerX, backY + backH / 2);
    }
}
