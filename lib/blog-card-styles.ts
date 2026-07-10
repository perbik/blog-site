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

export const cardColorValues = [
	"#699DF4",
	"#EA4D30",
	"#F8E8CE",
	"#8495AD",
	"#C389BA",
	"#848C41",
	"#F5B22D",
] as const;

export const cardColorValueClasses = [
	"bg-[#699DF4]",
	"bg-[#EA4D30]",
	"bg-[#F8E8CE]",
	"bg-[#8495AD]",
	"bg-[#C389BA]",
	"bg-[#848C41]",
	"bg-[#F5B22D]",
] as const;

export const cardColorValueNames = [
	"blue",
	"red",
	"beige",
	"gray",
	"purple",
	"green",
	"yellow",
] as const;

export const cardSizeClasses: Record<(typeof cardSizes)[number], string> = {
	standard: "h-[24rem] w-full max-w-80 sm:h-[27rem] sm:w-full sm:max-w-[23rem]",
	wide: "h-[23rem] w-full max-w-96 sm:h-[24rem] sm:w-full sm:max-w-[38rem]",
	tall: "h-[32rem] w-full max-w-80 sm:h-[35rem] sm:w-full sm:max-w-[23rem]",
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

export function getCardColorValue(index: number) {
	return cardColorValues[index % cardColorValues.length];
}

export function getCardColorValueForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	const index = posts.findIndex((post) => post.slug === slug);

	return getCardColorValue(index >= 0 ? index : 0);
}

export function getCardColorClass(index: number) {
	return cardColorValueClasses[index % cardColorValueClasses.length];
}

export function getCardColorClassForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	const index = posts.findIndex((post) => post.slug === slug);

	return getCardColorClass(index >= 0 ? index : 0);
}

export function getCardColorNameForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	const index = posts.findIndex((post) => post.slug === slug);

	return cardColorValueNames[
		(index >= 0 ? index : 0) % cardColorValueNames.length
	];
}

const blogCardTitleCharactersPerLine = 24;
const maximumVisibleBlogCardTitleLines = 3;

export function getBlogCardTitleLineCount(title: string) {
	const words = title.trim().split(/\s+/).filter(Boolean);

	if (words.length === 0) {
		return 1;
	}

	let lineCount = 1;
	let currentLineLength = 0;

	for (const word of words) {
		const wordLength = word.length;

		if (currentLineLength === 0) {
			currentLineLength = wordLength;
			continue;
		}

		if (currentLineLength + 1 + wordLength <= blogCardTitleCharactersPerLine) {
			currentLineLength += 1 + wordLength;
			continue;
		}

		lineCount += 1;
		currentLineLength = wordLength;

		if (lineCount >= maximumVisibleBlogCardTitleLines) {
			return maximumVisibleBlogCardTitleLines;
		}
	}

	return lineCount;
}

export function getBlogCardHeightClass(title: string) {
	const lineCount = getBlogCardTitleLineCount(title);

	if (lineCount === 1) {
		return "min-h-[390px]";
	}

	if (lineCount === 2) {
		return "min-h-[430px]";
	}

	return "min-h-[470px]";
}
