import { assets } from './core/AssetManager.js';
import { Game } from './core/Game.js';

// Registry들을 import하면 자동으로 등록됨
import './data/EnemyRegistry.js';
import './data/WeaponRegistry.js';
import './data/EquipmentRegistry.js';

async function init() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    // 스프라이트 로드 (이미지가 설정되어 있으면)
    await assets.loadAll();

    const game = new Game(canvas);
    window.game = game; // 디버깅용

    function gameLoop(timestamp) {
        game.update(timestamp);
        game.render();
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}

init();
