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
		<article className="w-full rounded-[22px] border border-black/15 bg-[#f5f5f5] p-6 text-black">
			<header className="flex flex-wrap items-baseline gap-3">
				<h2 className="font-heading text-2xl font-medium leading-none">
					{authorName}
				</h2>

				<time
					className="font-mono text-xs leading-none text-black/50"
					dateTime={createdAt.toISOString()}
				>
					{commentDateFormatter.format(createdAt)}
				</time>
			</header>

			<p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-black/80">
				{body}
			</p>
		</article>
	);
}
