function dice(randomFn: () => number = Math.random) {
	return {
		randomFn,
		roll(count: number, sides: number): number[] {
			const results = [];
			for (let i = 0; i < count; i++) {
				results.push(Math.floor(randomFn() * sides) + 1);
			}
			return results;
		},

		toEmoji(dice: number[]): string {
			const emoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
			return dice
				.map((die) => {
					if (die < 1 || die > 6) {
						return `[${die}]`;
					}
					return emoji[die - 1];
				})
				.join(' ');
		},

		replaceDice(input: string): string {
			const dicePattern = /サイコロ|[dD][iI][cC][eE]/g;
			const match = input.match(dicePattern);
			if (!match) {
				return input;
			}

			const dice = input.replace(dicePattern, () => {
				const result = this.roll(1, 6);
				return this.toEmoji(result);
			});

			return dice;
		},

		rollDice(input?: string): string {
			let count = 1,
				sides = 6;

			if (input && input !== '') {
				const match = input.match(/(\d+)d(\d+)/i);
				if (!match) {
					throw new Error('Invalid input format');
				}

				count = parseInt(match[1], 10);
				sides = parseInt(match[2], 10);
			}

			const result = this.roll(count, sides);
			if (sides > 6) {
				return result.map((die) => `[${die}]`).join(' ');
			}

			return this.toEmoji(result);
		},
	};
}

export default dice();
export { dice };
