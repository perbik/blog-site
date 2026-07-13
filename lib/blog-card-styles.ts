export const cardColors = [
	"yellow",
	"blue",
	"beige",
	"green",
	"purple",
	"red",
	"gray",
] as const;

export const cardSizes = ["standard", "wide", "standard", "tall"] as const;

export const cardColorClasses: Record<(typeof cardColors)[number], string> = {
	yellow: "bg-[#F5B22D]",
	blue: "bg-[#699DF4]",
	beige: "bg-[#F8E8CE]",
	green: "bg-[#848C41]",
	purple: "bg-[#C389BA]",
	red: "bg-[#EA4D30]",
	gray: "bg-[#8495AD]",
};

export const cardSizeClasses: Record<(typeof cardSizes)[number], string> = {
	standard: "h-[24rem] w-[78vw] max-w-80 sm:h-[27rem] sm:w-[23rem]",
	wide: "h-[23rem] w-[86vw] max-w-96 sm:h-[24rem] sm:w-[38rem]",
	tall: "h-[32rem] w-[78vw] max-w-80 sm:h-[35rem] sm:w-[23rem]",
};

export const imageSizeClasses: Record<(typeof cardSizes)[number], string> = {
	standard: "h-[42%]",
	wide: "h-[46%]",
	tall: "h-[42%]",
};

export function hashText(value: string) {
	return Array.from(value).reduce(
		(hash, character) => (hash * 31 + character.charCodeAt(0)) % 9973,
		7,
	);
}

export function getCardColor(
	hash: number,
	index: number,
	previousColor?: (typeof cardColors)[number],
) {
	const color = cardColors[(hash + index) % cardColors.length];

	if (color !== previousColor) {
		return color;
	}

	return cardColors[(hash + index + 1) % cardColors.length];
}

export function getBlogCardColorClassForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	let previousColor: (typeof cardColors)[number] | undefined;

	for (const [index, post] of posts.entries()) {
		const hash = hashText(post.slug);
		const color = getCardColor(hash, index, previousColor);
		previousColor = color;

		if (post.slug === slug) {
			return cardColorClasses[color];
		}
	}

	return cardColorClasses.yellow;
}
