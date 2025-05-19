import { describe, it, expect } from 'vitest';
import { fortune as createFortune } from '../src/fortune';

describe('fortune.pick', () => {
	it('常に同じ乱数なら決まった結果を返す', () => {
		const f = createFortune(() => 0); // 先頭
		expect(f.pick()).toBe('ハイパー大吉');
		const f2 = createFortune(() => 0.999); // 最後
		expect(f2.pick()).toBe('もういちど');
	});

	it('全ての結果が出る可能性がある', () => {
		const results = new Set<string>();
		const f = createFortune();
		for (let i = 0; i < 1000; i++) {
			results.add(f.pick());
		}
		expect(Array.from(results)).toEqual(
			expect.arrayContaining(['ハイパー大吉', '大吉', '中吉', '小吉', '吉', '半吉', '末吉', '凶', 'もういちど'])
		);
	});
});
