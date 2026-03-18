import { CANVAS_WIDTH, CANVAS_HEIGHT, WORLD_SIZE } from '../data/Constants.js';
import { assets } from './AssetManager.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { Player } from '../entities/Player.js';
import { Stage } from '../stages/Stage.js';
import { STAGES } from '../stages/StageData.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { LevelUpSystem } from '../systems/LevelUpSystem.js';
import { DropSystem } from '../systems/DropSystem.js';
import { WeaponRegistry } from '../data/WeaponRegistry.js';
import { Dagger } from '../weapons/Dagger.js';
import HUD from '../ui/HUD.js';
import StartScreen from '../ui/StartScreen.js';
import GameOverScreen from '../ui/GameOverScreen.js';
import LevelUpUI from '../ui/LevelUpUI.js';
import WeaponSwapUI from '../ui/WeaponSwapUI.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        this.input = new InputManager();
        this.camera = new Camera();

        // Game state
        this.state = 'start'; // start, playing, levelup, weaponswap, gameover, stageclear, victory
        this.paused = false;
        this.lastTime = 0;

        // Game objects
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.enemyBullets = [];
        this.items = [];
        this.effects = []; // visual-only effects

        // Stage
        this.stageIndex = 0;
        this.currentStage = null;
        this.totalElapsed = 0;

        // Boss
        this.activeBoss = null;

        // Magnet
        this.magnetActive = false;
        this.magnetTimer = 0;

        // Systems
        this.spawnSystem = new SpawnSystem(this);
        this.collisionSystem = new CollisionSystem(this);
        this.levelUpSystem = new LevelUpSystem(this);
        this.dropSystem = new DropSystem(this);

        // UI
        this.hud = new HUD(this);
        this.startScreen = new StartScreen(this);
        this.gameOverScreen = new GameOverScreen(this);
        this.levelUpUI = new LevelUpUI(this);
        this.weaponSwapUI = new WeaponSwapUI(this);

        // Mouse tracking for UI
        this.mouseX = 0;
        this.mouseY = 0;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        canvas.addEventListener('click', () => {
            this._handleClick();
        });

        // Key events for UI
        this._onKeyDown = (e) => this._handleKeyPress(e.code);
        window.addEventListener('keydown', this._onKeyDown);

        // Stage clear transition
        this.stageClearTimer = 0;
    }

    // HUD에서 참조하는 getter들
    get stage() { return this.currentStage ? this.currentStage.stageNumber : 1; }
    get remainingTime() {
        if (!this.currentStage) return 0;
        return Math.max(0, (this.currentStage.duration - this.currentStage.elapsed) * 1000);
    }
    get killCount() { return this.player ? this.player.killCount : 0; }
    get elapsedTime() { return this.totalElapsed * 1000; }
    get boss() { return this.activeBoss && this.activeBoss.alive ? this.activeBoss : null; }

    startGame() {
        this.state = 'playing';
        this.player = new Player(WORLD_SIZE / 2, WORLD_SIZE / 2);
        this.enemies = [];
        this.projectiles = [];
        this.enemyBullets = [];
        this.items = [];
        this.effects = [];
        this.stageIndex = 0;
        this.totalElapsed = 0;
        this.activeBoss = null;
        this.magnetActive = false;
        this.paused = false;

        // 기본 무기 지급
        const dagger = new Dagger();
        this.player.addWeapon(dagger);

        // 첫 스테이지 시작
        this._loadStage(0);

        // 시스템 리셋
        this.spawnSystem = new SpawnSystem(this);
        this.collisionSystem = new CollisionSystem(this);
        this.levelUpSystem = new LevelUpSystem(this);
        this.dropSystem = new DropSystem(this);
    }

    _loadStage(index) {
        if (index >= STAGES.length) {
            this.state = 'victory';
            return;
        }
        this.stageIndex = index;
        this.currentStage = new Stage(STAGES[index]);
        this.spawnSystem.spawnTimer = 0;
        this.spawnSystem.weaponSpawnTimer = 3000; // 첫 무기 3초 후 (이전 5초)
        this.spawnSystem.equipmentSpawnTimer = 8000; // 첫 장비 8초 후
    }

    update(timestamp) {
        if (this.lastTime === 0) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // cap at 50ms
        this.lastTime = timestamp;

        if (this.state === 'start' || this.state === 'gameover' || this.state === 'victory') {
            return;
        }

        if (this.paused) return;

        if (this.state === 'stageclear') {
            this.stageClearTimer -= dt;
            if (this.stageClearTimer <= 0) {
                this._loadStage(this.stageIndex + 1);
                this.state = 'playing';
            }
            return;
        }

        if (this.state !== 'playing') return;

        this.totalElapsed += dt;

        // Update stage timer
        this.currentStage.update(dt);

        // Stage clear check
        if (this.currentStage.cleared) {
            this.state = 'stageclear';
            this.stageClearTimer = 3;
            // 적 전부 제거
            this.enemies = [];
            this.projectiles = [];
            this.enemyBullets = [];
            return;
        }

        // Magnet timer
        if (this.magnetActive) {
            this.magnetTimer -= dt * 1000;
            if (this.magnetTimer <= 0) {
                this.magnetActive = false;
            }
        }

        // Update player
        this.player.update(dt, this);

        // Check player level up
        this.player.onLevelUp(this);

        // Update systems
        this.spawnSystem.update(dt);

        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.alive) enemy.update(dt, this);
        }

        // Update projectiles
        for (const proj of this.projectiles) {
            if (proj.alive) proj.update(dt, this);
        }

        // Update enemy bullets
        for (const bullet of this.enemyBullets) {
            if (bullet.alive) bullet.update(dt, this);
        }

        // Update items
        for (const item of this.items) {
            if (item.alive) item.update(dt, this);
        }

        // Update effects
        for (const effect of this.effects) {
            if (effect.alive) effect.update(dt, this);
        }

        // Collision detection
        this.collisionSystem.update();

        // Screen flash (bomb effect)
        if (this.screenFlash) {
            this.screenFlash.timer -= dt * 1000;
            if (this.screenFlash.timer <= 0) {
                this.screenFlash = null;
            }
        }

        // Clean up dead boss reference
        if (this.activeBoss && !this.activeBoss.alive) {
            this.activeBoss = null;
        }

        // Clean up dead entities
        this.enemies = this.enemies.filter(e => e.alive);
        this.projectiles = this.projectiles.filter(p => p.alive);
        this.enemyBullets = this.enemyBullets.filter(b => b.alive);
        this.items = this.items.filter(i => i.alive);
        this.effects = this.effects.filter(e => e.alive);

        // Check game over
        if (this.player.hp <= 0) {
            this.state = 'gameover';
            this.gameOverScreen.show();
        }
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (this.state === 'start') {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.startScreen.render(ctx);
            return;
        }

        // Camera follow player
        if (this.player) {
            this.camera.follow(this.player);
        }

        // Background
        const bgColor = this.currentStage ? this.currentStage.bgColor : '#1a1a2e';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid (background detail)
        this._renderGrid(ctx);

        // Render effects (below entities)
        for (const effect of this.effects) {
            if (effect.alive) effect.render(ctx, this.camera);
        }

        // Render items
        for (const item of this.items) {
            if (item.alive) item.render(ctx, this.camera);
        }

        // Render enemies
        for (const enemy of this.enemies) {
            if (enemy.alive) enemy.render(ctx, this.camera);
        }

        // Render player
        if (this.player) {
            this.player.render(ctx, this.camera);

            // Render weapon visual effects (garlic ring, etc)
            for (const weapon of this.player.weapons) {
                if (weapon.render) weapon.render(ctx, this.camera, this.player);
            }
        }

        // Render projectiles
        for (const proj of this.projectiles) {
            if (proj.alive) proj.render(ctx, this.camera);
        }

        // Render enemy bullets
        for (const bullet of this.enemyBullets) {
            if (bullet.alive) bullet.render(ctx, this.camera);
        }

        // Screen flash (bomb)
        if (this.screenFlash) {
            const alpha = this.screenFlash.timer / this.screenFlash.duration;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // HUD
        this.hud.render(ctx);

        // Stage clear overlay
        if (this.state === 'stageclear') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 36px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('STAGE CLEAR!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
            ctx.fillStyle = '#fff';
            ctx.font = '18px monospace';
            const nextStage = this.stageIndex + 2;
            if (nextStage <= STAGES.length) {
                ctx.fillText(`다음 스테이지: ${nextStage}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
            }
        }

        // Victory overlay
        if (this.state === 'victory') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 42px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('VICTORY!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
            ctx.restore();
            ctx.fillStyle = '#fff';
            ctx.font = '18px monospace';
            ctx.fillText('모든 스테이지를 클리어했습니다!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
            ctx.fillText(`처치 수: ${this.killCount}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '16px monospace';
            ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
        }

        // Level up UI
        if (this.levelUpSystem.active) {
            this.levelUpUI.render(ctx, this.levelUpSystem.choices);
        }

        // Weapon swap UI
        if (this.weaponSwapUI.active) {
            this.weaponSwapUI.render(ctx);
        }

        // Game over screen
        if (this.state === 'gameover') {
            this.gameOverScreen.render(ctx);
        }
    }

    _renderGrid(ctx) {
        const gridSize = 100;
        const offsetX = -(this.camera.x % gridSize);
        const offsetY = -(this.camera.y % gridSize);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let x = offsetX; x < CANVAS_WIDTH; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = offsetY; y < CANVAS_HEIGHT; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
    }

    _handleKeyPress(code) {
        if (this.state === 'start') {
            if (code === 'Space' || code === 'Enter') {
                this.startGame();
            }
            return;
        }

        if (this.state === 'gameover' || this.state === 'victory') {
            if (code === 'Enter') {
                this.state = 'start';
                this.startScreen.active = true;
                this.gameOverScreen.active = false;
            }
            return;
        }

        // Level up selection
        if (this.levelUpSystem.active) {
            const idx = this.levelUpUI.handleInput(code);
            if (idx >= 0) {
                this.levelUpSystem.selectChoice(idx);
            }
            return;
        }

        // Weapon swap selection (버그 수정: 확실한 일시정지 처리)
        if (this.weaponSwapUI.active) {
            if (code === 'Escape') {
                this.weaponSwapUI.dismiss();
                this.paused = false;
                this._pendingWeaponKey = null;
                return;
            }

            const result = this.weaponSwapUI.handleInput(code);
            if (result >= 0 && result < 4 && this._pendingWeaponKey) {
                const newWeapon = WeaponRegistry.create(this._pendingWeaponKey);
                if (newWeapon) {
                    this.player.weapons[result] = newWeapon;
                    newWeapon.owner = this.player;
                }
                this._pendingWeaponKey = null;
                this.paused = false;
            }
            return;
        }
    }

    _handleClick() {
        // Level up selection by click
        if (this.levelUpSystem.active) {
            const choices = this.levelUpSystem.choices;
            const cardW = 200;
            const cardH = 120;
            const cardPadding = 20;
            const totalW = choices.length * cardW + (choices.length - 1) * cardPadding;
            const startX = CANVAS_WIDTH / 2 - totalW / 2;
            const cardY = CANVAS_HEIGHT / 2 - cardH / 2;

            for (let i = 0; i < choices.length; i++) {
                const x = startX + i * (cardW + cardPadding);
                if (this.mouseX >= x && this.mouseX <= x + cardW &&
                    this.mouseY >= cardY && this.mouseY <= cardY + cardH) {
                    this.levelUpSystem.selectChoice(i);
                    return;
                }
            }
        }

        // Weapon swap selection by click
        if (this.weaponSwapUI.active) {
            const centerX = CANVAS_WIDTH / 2;
            const cardW = 140;
            const cardPadding = 15;
            const totalW = 4 * cardW + 3 * cardPadding;
            const startX = centerX - totalW / 2;
            const cardY = 180;
            const cardH = 90;

            for (let i = 0; i < 4; i++) {
                const x = startX + i * (cardW + cardPadding);
                if (this.mouseX >= x && this.mouseX <= x + cardW &&
                    this.mouseY >= cardY && this.mouseY <= cardY + cardH) {
                    if (this._pendingWeaponKey) {
                        const newWeapon = WeaponRegistry.create(this._pendingWeaponKey);
                        if (newWeapon) {
                            this.player.weapons[i] = newWeapon;
                            newWeapon.owner = this.player;
                        }
                        this._pendingWeaponKey = null;
                        this.weaponSwapUI.dismiss();
                        this.paused = false;
                    }
                    return;
                }
            }
        }
    }

    showWeaponSwapUI(weaponKey) {
        this._pendingWeaponKey = weaponKey;
        this.paused = true; // 확실하게 일시정지!
        this.weaponSwapUI.show(weaponKey);
    }

    activateMagnet() {
        this.magnetActive = true;
        this.magnetTimer = 500; // 0.5초
    }
}
