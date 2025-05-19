function fortune(randomFn: () => number = Math.random) {
	return {
		pick(): string {
			const fortunes = ['ハイパー大吉', '大吉', '中吉', '小吉', '吉', '半吉', '末吉', '凶', 'もういちど'];
			const randomIndex = Math.floor(randomFn() * fortunes.length);
			return fortunes[randomIndex];
		},
	};
}

export default fortune();
export { fortune };
