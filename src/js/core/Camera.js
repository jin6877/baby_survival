import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/Constants.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
    }

    follow(target) {
        this.x = target.x - this.width / 2;
        this.y = target.y - this.height / 2;
        // 무한 월드 - 경계 클램프 없음
    }
}
