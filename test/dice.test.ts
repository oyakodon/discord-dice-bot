import { describe, it, expect } from 'vitest';
import dice, { dice as createDice } from '../src/dice';

describe('dice.roll', () => {
	it('指定した個数・面数でサイコロを振る', () => {
		const d = createDice(() => 0.5);
		expect(d.roll(3, 6)).toEqual([4, 4, 4]); // 常に4の目が出る
	});

	it('1以上sides以下の値を返す', () => {
		const d = createDice(() => Math.random());
		const result = d.roll(10, 6);
		expect(result.every((v) => v >= 1 && v <= 6)).toBe(true);
	});
});

describe('dice.toEmoji', () => {
	it('1~6をサイコロ絵文字に変換する', () => {
		expect(dice.toEmoji([1, 2, 3, 4, 5, 6])).toBe('⚀ ⚁ ⚂ ⚃ ⚄ ⚅');
	});
	it('範囲外の値は[n]で表示する', () => {
		expect(dice.toEmoji([0, 7])).toBe('[0] [7]');
	});
});

describe('dice.replaceDice', () => {
	it('サイコロという文字をサイコロ絵文字に置換する', () => {
		const d = createDice(() => 0); // 常に1
		expect(d.replaceDice('サイコロ')).toBe('⚀');
	});
	it('dice(大文字小文字区別なし)をサイコロ絵文字に置換する', () => {
		const d = createDice(() => 0.8); // 常に5
		expect(d.replaceDice('roll dice!')).toBe('roll ⚄!');
		expect(d.replaceDice('roll DICE!')).toBe('roll ⚄!');
	});
	it('該当文字がなければ、置換せず文字列を返却する', () => {
		const d = createDice(() => 0); // 常に1
		expect(d.replaceDice('そのまま')).toBe('そのまま');
	});
});

describe('dice.rollDice', () => {
	it('デフォルトで1d6を振る', () => {
		const d = createDice(() => 0); // 常に1
		expect(d.rollDice()).toBe('⚀');
	});
	it('入力に従いNdMで振る', () => {
		const d = createDice(() => 0);
		expect(d.rollDice('2d4')).toBe('⚀ ⚀');

		const d2 = createDice(() => 0.99);
		expect(d2.rollDice('3d6')).toBe('⚅ ⚅ ⚅');

		const d3 = createDice(() => 0.5);
		expect(d3.rollDice('5d10')).toBe('[6] [6] [6] [6] [6]');
	});
	it('不正な入力ならエラーを投げる', () => {
		expect(() => dice.rollDice('bad input')).toThrow();
	});
});
