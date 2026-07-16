const cardColorClasses = [
	"bg-[#EA4D30]",
	"bg-[#699DF4]",
	"bg-[#F8E8CE]",
	"bg-[#8495AD]",
	"bg-[#F5B22D]",
	"bg-[#848C41]",
	"bg-[#C389BA]",
] as const;

const cardColorNames = [
	"red",
	"blue",
	"beige",
	"gray",
	"yellow",
	"green",
	"purple",
] as const;

export function getCardColorClassForIndex(index: number) {
	return cardColorClasses[index % cardColorClasses.length];
}

export function getCardColorNameForIndex(index: number) {
	return cardColorNames[index % cardColorNames.length];
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
