interface CommentCardProps {
	authorName: string;
	body: string;
	createdAt: Date;
}

const commentDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

export function CommentCard({ authorName, body, createdAt }: CommentCardProps) {
	return (
		<article className="w-full max-w-3xl rounded-[1.2rem] bg-comment px-5 py-5 text-black sm:rounded-[1.5rem] sm:px-7 sm:py-6">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
				<h2 className="font-heading text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
					{authorName}
				</h2>

				<time
					className="font-mono text-xs leading-none text-black/70"
					dateTime={createdAt.toISOString()}
				>
					{commentDateFormatter.format(createdAt)}
				</time>
			</header>

			<p className="mt-4 max-w-4xl whitespace-pre-wrap font-mono text-sm leading-relaxed sm:mt-5 sm:text-base">
				{body}
			</p>
		</article>
	);
}
