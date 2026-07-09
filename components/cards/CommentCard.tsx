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
		<article className="w-full max-w-3xl rounded-[1.15rem] border border-black bg-comment px-6 py-5 text-black sm:rounded-[1.35rem] sm:px-9 sm:py-6">
			<header className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
				<h2 className="font-heading text-2xl font-black leading-none tracking-normal sm:text-3xl">
					{authorName}
				</h2>

				<time
					className="font-mono text-[0.65rem] font-medium leading-none text-black/70"
					dateTime={createdAt.toISOString()}
				>
					{commentDateFormatter.format(createdAt)}
				</time>
			</header>

			<p className="mt-5 max-w-4xl whitespace-pre-wrap font-mono text-xs font-medium leading-relaxed sm:text-sm">
				{body}
			</p>
		</article>
	);
}
