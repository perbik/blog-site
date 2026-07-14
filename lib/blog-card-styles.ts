const cardColorClasses = [
	"bg-[#699DF4]",
	"bg-[#EA4D30]",
	"bg-[#F8E8CE]",
	"bg-[#8495AD]",
	"bg-[#C389BA]",
	"bg-[#848C41]",
	"bg-[#F5B22D]",
] as const;

const cardColorNames = [
	"blue",
	"red",
	"beige",
	"gray",
	"purple",
	"green",
	"yellow",
] as const;

function getPostColorIndex(posts: Array<{ slug: string }>, slug: string) {
	const index = posts.findIndex((post) => post.slug === slug);

	return (index >= 0 ? index : 0) % cardColorClasses.length;
}

export function getCardColorClassForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	return cardColorClasses[getPostColorIndex(posts, slug)];
}

export function getCardColorNameForSlug(
	posts: Array<{ slug: string }>,
	slug: string,
) {
	return cardColorNames[getPostColorIndex(posts, slug)];
}

const titleCharactersPerLine = 24;
const maximumVisibleTitleLines = 3;

function getBlogCardTitleLineCount(title: string) {
	const words = title.trim().split(/\s+/).filter(Boolean);

	if (words.length === 0) return 1;

	let lineCount = 1;
	let currentLineLength = 0;

	for (const word of words) {
		if (currentLineLength === 0) {
			currentLineLength = word.length;
			continue;
		}

		if (currentLineLength + 1 + word.length <= titleCharactersPerLine) {
			currentLineLength += 1 + word.length;
			continue;
		}

		lineCount += 1;
		currentLineLength = word.length;

		if (lineCount >= maximumVisibleTitleLines) {
			return maximumVisibleTitleLines;
		}
	}

	return lineCount;
}

export function getBlogCardHeightClass(title: string) {
	const lineCount = getBlogCardTitleLineCount(title);

	if (lineCount === 1) return "min-h-[390px]";
	if (lineCount === 2) return "min-h-[420px]";

	return "min-h-[450px]";
}
