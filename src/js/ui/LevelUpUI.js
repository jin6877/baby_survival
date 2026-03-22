export default class LevelUpUI {
    constructor(game) {
        this.game = game;
    }

    render(ctx, choices, W, H) {
        if (!choices || choices.length === 0) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const isMobile = this.game.input.isMobile;

        // Title
        ctx.save();
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LEVEL UP!', centerX, 70);
        ctx.restore();

        ctx.fillStyle = '#b0bec5';
        ctx.font = '15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('무기 또는 아이템을 선택하세요', centerX, 100);

        // Choice cards - 스탯 표시 위해 카드 높이 증가
        const cardW = 230;
        const cardH = 280;
        const cardPadding = 16;
        const totalW = choices.length * cardW + (choices.length - 1) * cardPadding;
        const startX = centerX - totalW / 2;
        const cardY = H / 2 - cardH / 2 + 10;

        const mouseX = this.game.mouseX || -1;
        const mouseY = this.game.mouseY || -1;

        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const x = startX + i * (cardW + cardPadding);
            const y = cardY;

            const hovered = mouseX >= x && mouseX <= x + cardW &&
                            mouseY >= y && mouseY <= y + cardH;

            const isWeapon = choice.choiceType === 'weapon';
            const cardColor = isWeapon ? '#4fc3f7' : (choice.color || '#ffd740');

            // 카드 배경
            ctx.fillStyle = hovered ? 'rgba(60, 60, 120, 0.95)' : 'rgba(30, 30, 60, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);

            // 상단 타입 바
            ctx.fillStyle = cardColor;
            ctx.fillRect(x, y, cardW, 4);

            ctx.strokeStyle = hovered ? cardColor : '#3949ab';
            ctx.lineWidth = hovered ? 3 : 2;
            ctx.strokeRect(x, y, cardW, cardH);

            // 타입 라벨
            ctx.fillStyle = cardColor;
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(isWeapon ? 'WEAPON' : 'ITEM', x + 8, y + 10);

            // 번호
            ctx.fillStyle = '#9e9e9e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`[${i + 1}]`, x + cardW - 8, y + 10);

            // 아이콘
            ctx.font = '26px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(choice.icon || (isWeapon ? '⚔️' : '📦'), x + cardW / 2, y + 42);

            // 이름
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(choice.name || '???', x + cardW / 2, y + 68);

            // 설명 (한 줄)
            ctx.fillStyle = '#b0bec5';
            ctx.font = '11px monospace';
            const desc = choice.description || '';
            const maxDescWidth = cardW - 20;
            let truncDesc = desc;
            if (ctx.measureText(truncDesc).width > maxDescWidth) {
                while (truncDesc.length > 0 && ctx.measureText(truncDesc + '..').width > maxDescWidth) {
                    truncDesc = truncDesc.slice(0, -1);
                }
                truncDesc += '..';
            }
            ctx.fillText(truncDesc, x + cardW / 2, y + 88);

            // 구분선
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 12, y + 100);
            ctx.lineTo(x + cardW - 12, y + 100);
            ctx.stroke();

            // 스탯 변경 표시
            const stats = choice.statChanges || [];
            let statY = y + 118;
            const statLineH = 22;

            if (stats.length > 0) {
                ctx.font = 'bold 10px monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.textAlign = 'center';
                ctx.fillText('── STATS ──', x + cardW / 2, y + 108);
            }

            for (let s = 0; s < stats.length && s < 6; s++) {
                const stat = stats[s];
                const labelX = x + 12;
                const valueX = x + cardW - 12;

                // 라벨
                ctx.fillStyle = '#b0bec5';
                ctx.font = '12px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(stat.label, labelX, statY);

                ctx.textAlign = 'right';

                if (stat.current !== undefined && stat.next !== undefined) {
                    // 업그레이드: 현재 → 다음
                    const arrow = ' → ';
                    const nextText = stat.next;
                    const arrowText = stat.current + arrow + nextText;

                    // 현재 수치 (회색)
                    ctx.fillStyle = '#9e9e9e';
                    const fullWidth = ctx.measureText(arrowText).width;
                    const nextWidth = ctx.measureText(nextText).width;
                    const arrowWidth = ctx.measureText(arrow).width;
                    const curText = stat.current;

                    // 위치 계산 (오른쪽 정렬)
                    const endX = valueX;
                    const nextStartX = endX - nextWidth;
                    const arrowStartX = nextStartX - arrowWidth;
                    const curStartX = arrowStartX - ctx.measureText(curText).width;

                    ctx.textAlign = 'left';
                    ctx.fillStyle = '#9e9e9e';
                    ctx.fillText(curText, curStartX, statY);

                    ctx.fillStyle = '#ffeb3b';
                    ctx.fillText(arrow, arrowStartX, statY);

                    ctx.fillStyle = '#69f0ae';
                    ctx.font = 'bold 12px monospace';
                    ctx.fillText(nextText, nextStartX, statY);
                    ctx.font = '12px monospace';
                } else if (stat.value !== undefined) {
                    // 새 아이템: 기본 수치
                    ctx.fillStyle = '#69f0ae';
                    ctx.font = 'bold 12px monospace';
                    ctx.fillText(stat.value, valueX, statY);
                    ctx.font = '12px monospace';
                }

                statY += statLineH;
            }
        }

        ctx.fillStyle = '#9e9e9e';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const instructText = isMobile ? '카드를 터치하여 선택' : '1, 2, 3 키로 선택';
        ctx.fillText(instructText, centerX, cardY + cardH + 30);
    }

    handleInput(input) {
        if (input === 'Digit1') return 0;
        if (input === 'Digit2') return 1;
        if (input === 'Digit3') return 2;
        return -1;
    }
}
