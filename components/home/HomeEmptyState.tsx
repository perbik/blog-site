import { FileText } from "lucide-react";

export function HomeEmptyState() {
	return (
		<section className="flex min-h-svh items-center justify-center bg-[#0a0a0a] px-5 py-28 text-white">
			<div className="flex max-w-xl flex-col items-center text-center">
				<div className="mb-6 flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
					<FileText className="size-6 text-white/70" aria-hidden="true" />
				</div>

				<p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
					The story starts here
				</p>
				<h1 className="font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">
					No posts yet
				</h1>
				<p className="mt-5 max-w-md font-mono text-sm leading-relaxed text-white/55 sm:text-base">
					New stories are on the way. Check back soon for the first post.
				</p>
			</div>
		</section>
	);
}
