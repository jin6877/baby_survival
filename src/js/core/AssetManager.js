// AssetManager: 스프라이트 이미지를 중앙에서 관리
// 디자이너가 이미지를 교체할 때 이 파일의 SPRITE_CONFIG만 수정하면 됩니다.

const SPRITE_CONFIG = {
    // === 플레이어 ===
    player: { src: null, fallbackColor: '#4fc3f7', fallbackShape: 'circle' },

    // === 적 ===
    zombie: { src: null, fallbackColor: '#6a994e', fallbackShape: 'circle' },
    bat: { src: null, fallbackColor: '#9b59b6', fallbackShape: 'triangle' },
    skeleton: { src: null, fallbackColor: '#e0e0e0', fallbackShape: 'circle' },
    ghost: { src: null, fallbackColor: '#80cbc4', fallbackShape: 'diamond' },
    knight: { src: null, fallbackColor: '#78909c', fallbackShape: 'rect' },
    slime: { src: null, fallbackColor: '#66bb6a', fallbackShape: 'circle' },

    // === 보스 ===
    giantSkeleton: { src: null, fallbackColor: '#fafafa', fallbackShape: 'circle' },
    necromancer: { src: null, fallbackColor: '#7b1fa2', fallbackShape: 'diamond' },
    darkKnight: { src: null, fallbackColor: '#37474f', fallbackShape: 'rect' },
    lich: { src: null, fallbackColor: '#00bcd4', fallbackShape: 'diamond' },
    vampireLord: { src: null, fallbackColor: '#b71c1c', fallbackShape: 'diamond' },

    // === 투사체 ===
    daggerProjectile: { src: null, fallbackColor: '#cfd8dc', fallbackShape: 'rect' },
    axeProjectile: { src: null, fallbackColor: '#8d6e63', fallbackShape: 'triangle' },
    magicProjectile: { src: null, fallbackColor: '#e040fb', fallbackShape: 'circle' },
    crossProjectile: { src: null, fallbackColor: '#ffd600', fallbackShape: 'cross' },
    ghostBullet: { src: null, fallbackColor: '#80cbc4', fallbackShape: 'circle' },

    // === 무기 픽업 ===
    weaponPickup: { src: null, fallbackColor: '#76ff03', fallbackShape: 'rect' },

    // === 장비 픽업 ===
    equipmentPickup: { src: null, fallbackColor: '#ffd740', fallbackShape: 'diamond' },

    // === 아이템 ===
    expGemSmall: { src: null, fallbackColor: '#7c4dff', fallbackShape: 'diamond' },
    expGemLarge: { src: null, fallbackColor: '#e040fb', fallbackShape: 'diamond' },
    meat: { src: null, fallbackColor: '#ff5252', fallbackShape: 'rect' },
    magnet: { src: null, fallbackColor: '#ffff00', fallbackShape: 'triangle' },
    bomb: { src: null, fallbackColor: '#ff6d00', fallbackShape: 'circle' },
};

export class AssetManager {
    constructor() {
        this.images = {};
        this.loaded = false;
    }

    // 스프라이트 이미지 일괄 로드
    async loadAll() {
        const promises = [];
        for (const [key, config] of Object.entries(SPRITE_CONFIG)) {
            if (config.src) {
                promises.push(this._loadImage(key, config.src));
            }
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
        this.loaded = true;
    }

    _loadImage(key, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${key} (${src}), using fallback`);
                resolve();
            };
            img.src = src;
        });
    }

    // 스프라이트가 있으면 이미지, 없으면 폴백 도형을 그림
    drawSprite(ctx, key, x, y, width, height, rotation = 0) {
        const img = this.images[key];
        if (img) {
            ctx.save();
            ctx.translate(x, y);
            if (rotation) ctx.rotate(rotation);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
            return;
        }

        // 폴백 도형 렌더링
        const config = SPRITE_CONFIG[key];
        if (!config) {
            // 등록되지 않은 키 → 기본 원
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(x, y, width / 2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        ctx.save();
        ctx.translate(x, y);
        if (rotation) ctx.rotate(rotation);
        ctx.fillStyle = config.fallbackColor;

        const w = width;
        const h = height;
        const r = w / 2;

        switch (config.fallbackShape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rect':
                ctx.fillRect(-w / 2, -h / 2, w, h);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -r);
                ctx.lineTo(r, r);
                ctx.lineTo(-r, r);
                ctx.closePath();
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -r);
                ctx.lineTo(r, 0);
                ctx.lineTo(0, r);
                ctx.lineTo(-r, 0);
                ctx.closePath();
                ctx.fill();
                break;
            case 'cross':
                const t = w * 0.2;
                ctx.fillRect(-t, -r, t * 2, h);
                ctx.fillRect(-r, -t, w, t * 2);
                break;
        }

        ctx.restore();
    }

    // 스프라이트 존재 여부
    hasSprite(key) {
        return !!this.images[key];
    }

    // 런타임에 스프라이트 교체 (핫스왑 지원)
    async replaceSprite(key, newSrc) {
        await this._loadImage(key, newSrc);
    }

    // 디자이너용: 새 스프라이트 키 등록
    static registerSprite(key, config) {
        SPRITE_CONFIG[key] = config;
    }
}

// 싱글톤 인스턴스
export const assets = new AssetManager();
