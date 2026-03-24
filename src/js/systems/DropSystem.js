// DropSystem: 적 사망 시 아이템 드롭 처리
import { ExpGem, rollGemTier } from '../items/ExpGem.js';
import { Meat } from '../items/Meat.js';
import { Magnet } from '../items/Magnet.js';
import { Bomb } from '../items/Bomb.js';
import { StatGem } from '../items/StatGem.js';
import { GrowthGem } from '../items/GrowthGem.js';

export class DropSystem {
	constructor(game) {
		this.game = game;
	}

	handleDrop(enemy) {
		const game = this.game;
		if (!game.items) return;

		const x = enemy.x;
		const y = enemy.y;
		const player = game.player;
		const dropBonus = player ? player.dropRateBonus : 0;

		// 100% 확률: ExpGem 드롭 (5단계 등급)
		{
			const tierIndex = rollGemTier();
			const gem = new ExpGem(x, y, tierIndex);
			game.items.push(gem);
		}

		// ~3% 확률: 스탯 젬 드롭 (바닥 드롭 = 소량 영구 스탯 증가)
		if (Math.random() < 0.03 + dropBonus * 0.01) {
			const statGem = new StatGem(
				x + (Math.random() - 0.5) * 20,
				y + (Math.random() - 0.5) * 20,
			);
			game.items.push(statGem);
		}

		// ~0.5% 확률: 성장경험치젬 드롭 (아기 성장 포인트)
		if (Math.random() < 0.005 + dropBonus * 0.01) {
			const growthGem = new GrowthGem(
				x + (Math.random() - 0.5) * 20,
				y + (Math.random() - 0.5) * 20,
			);
			game.items.push(growthGem);
		}

		// 0.5% 확률: 고기 드롭 (체력 회복)
		if (Math.random() < 0.005 + dropBonus * 0.03) {
			const meat = new Meat(
				x + (Math.random() - 0.5) * 20,
				y + (Math.random() - 0.5) * 20,
			);
			game.items.push(meat);
		}

		// 0.1% 확률: 자석 드롭 (모든 아이템 흡수) — 스테이지당 약 2~3회
		if (Math.random() < 0.001 + dropBonus * 0.0005) {
			const magnet = new Magnet(
				x + (Math.random() - 0.5) * 20,
				y + (Math.random() - 0.5) * 20,
			);
			game.items.push(magnet);
		}

		// 0.1% 확률: 폭탄 드롭 — 스테이지당 약 2~3회
		if (Math.random() < 0.001 + dropBonus * 0.0005) {
			const bomb = new Bomb(
				x + (Math.random() - 0.5) * 20,
				y + (Math.random() - 0.5) * 20,
			);
			game.items.push(bomb);
		}
	}
}
