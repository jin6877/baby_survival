export class InputManager {
    constructor() {
        this.keys = {};
        this.isMobile = this._detectMobile();

        // Keyboard events
        this._onKeyDown = (e) => {
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        };
        this._onKeyUp = (e) => {
            this.keys[e.code] = false;
        };
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);

        // Touch joystick state
        this.joystick = {
            active: false,
            touchId: null,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            dx: 0,
            dy: 0,
            baseRadius: 50,
            knobRadius: 22,
            opacity: 0
        };
    }

    _detectMobile() {
        return ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    isDown(code) {
        return !!this.keys[code];
    }

    getMovement() {
        // Check joystick first
        if (this.joystick.active && (this.joystick.dx !== 0 || this.joystick.dy !== 0)) {
            return { dx: this.joystick.dx, dy: this.joystick.dy };
        }

        // Keyboard fallback
        let dx = 0, dy = 0;
        if (this.isDown('KeyW') || this.isDown('ArrowUp')) dy = -1;
        if (this.isDown('KeyS') || this.isDown('ArrowDown')) dy = 1;
        if (this.isDown('KeyA') || this.isDown('ArrowLeft')) dx = -1;
        if (this.isDown('KeyD') || this.isDown('ArrowRight')) dx = 1;
        // 대각선 정규화
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }
        return { dx, dy };
    }

    // Called by Game.js to set up touch events on canvas
    setupTouch(canvas, game) {
        this._canvas = canvas;
        this._game = game;

        canvas.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this._onTouchEnd(e), { passive: false });
        canvas.addEventListener('touchcancel', (e) => this._onTouchEnd(e), { passive: false });
    }

    _getCanvasPos(touch) {
        const canvas = this._canvas;
        const rect = canvas.getBoundingClientRect();
        // Convert screen touch position to canvas logical coordinates
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
            screenX: touch.clientX,
            screenY: touch.clientY
        };
    }

    _onTouchStart(e) {
        e.preventDefault();
        const game = this._game;

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const pos = this._getCanvasPos(touch);

            // If game is in a menu state, treat as tap/click
            if (game.state === 'start' || game.state === 'gameover' || game.state === 'victory' ||
                game.levelUpSystem.active || game.weaponSwapUI.active) {
                game.mouseX = pos.x;
                game.mouseY = pos.y;
                game._handleTap(pos.x, pos.y);
                return;
            }

            // 게임 플레이 중: HUD 슬롯 터치 체크 (툴팁 열기/닫기)
            if (game.state === 'playing') {
                // 툴팁이 열려있으면 아무 곳이나 터치하면 닫기
                if (game.hud && game.hud.tooltip) {
                    game.mouseX = pos.x;
                    game.mouseY = pos.y;
                    game.hud.handleClick(pos.x, pos.y);
                    return;
                }
                // HUD 슬롯 클릭 체크
                if (game.hud && game.hud.handleClick(pos.x, pos.y)) {
                    game.mouseX = pos.x;
                    game.mouseY = pos.y;
                    return;
                }
            }

            // 조이스틱 활성화
            if (!this.joystick.active) {
                this.joystick.active = true;
                this.joystick.touchId = touch.identifier;
                this.joystick.startX = pos.x;
                this.joystick.startY = pos.y;
                this.joystick.currentX = pos.x;
                this.joystick.currentY = pos.y;
                this.joystick.dx = 0;
                this.joystick.dy = 0;
                this.joystick.opacity = 0.6;
            }
        }
    }

    _onTouchMove(e) {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            if (this.joystick.active && touch.identifier === this.joystick.touchId) {
                const pos = this._getCanvasPos(touch);
                this.joystick.currentX = pos.x;
                this.joystick.currentY = pos.y;

                const diffX = pos.x - this.joystick.startX;
                const diffY = pos.y - this.joystick.startY;
                const dist = Math.sqrt(diffX * diffX + diffY * diffY);
                const maxDist = this.joystick.baseRadius;

                if (dist > 5) { // dead zone
                    const clampedDist = Math.min(dist, maxDist);
                    this.joystick.dx = (diffX / dist) * (clampedDist / maxDist);
                    this.joystick.dy = (diffY / dist) * (clampedDist / maxDist);
                } else {
                    this.joystick.dx = 0;
                    this.joystick.dy = 0;
                }
            }
        }
    }

    _onTouchEnd(e) {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            if (this.joystick.active && touch.identifier === this.joystick.touchId) {
                this.joystick.active = false;
                this.joystick.touchId = null;
                this.joystick.dx = 0;
                this.joystick.dy = 0;
                this.joystick.opacity = 0;
            }
        }
    }

    renderJoystick(ctx) {
        if (!this.joystick.active) return;

        const j = this.joystick;

        // Base circle
        ctx.beginPath();
        ctx.arc(j.startX, j.startY, j.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${j.opacity * 0.15})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${j.opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Knob
        const diffX = j.currentX - j.startX;
        const diffY = j.currentY - j.startY;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);
        const maxDist = j.baseRadius;
        let knobX, knobY;

        if (dist > maxDist) {
            knobX = j.startX + (diffX / dist) * maxDist;
            knobY = j.startY + (diffY / dist) * maxDist;
        } else {
            knobX = j.currentX;
            knobY = j.currentY;
        }

        ctx.beginPath();
        ctx.arc(knobX, knobY, j.knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${j.opacity * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${j.opacity * 0.7})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
