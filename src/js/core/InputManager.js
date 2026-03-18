export class InputManager {
    constructor() {
        this.keys = {};
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
    }

    isDown(code) {
        return !!this.keys[code];
    }

    getMovement() {
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

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
