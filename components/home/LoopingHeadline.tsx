const headline = "personal notes, open thoughts, and conversations.";

const repeatedHeadlines = [
	{ id: "first", label: headline },
	{ id: "second", label: headline },
];

export function LoopingHeadline() {
	return (
		<h1
			className="overflow-hidden whitespace-nowrap font-inherit text-[1em] font-inherit leading-inherit tracking-inherit"
			aria-label={headline}
		>
			<span className="home-headline-track inline-flex" aria-hidden="true">
				{repeatedHeadlines.map((item) => (
					<span key={item.id} className="shrink-0 pr-[0.35em]">
						{item.label}
					</span>
				))}
			</span>
		</h1>
	);
}
