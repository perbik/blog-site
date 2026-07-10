import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
	return (
		<main
			className="min-h-screen bg-[#f5f5f5]"
			aria-label="Loading blog post"
			aria-busy="true"
		>
			<span className="sr-only">Loading blog post…</span>

			<Skeleton className="h-[clamp(220px,38vw,400px)] w-full rounded-none bg-black/10" />

			<div className="mx-auto w-full max-w-4xl px-6 pb-20 pt-10">
				<Skeleton className="mb-8 h-8 w-28 rounded-lg bg-black/10" />

				<div className="mb-4 flex gap-2">
					<Skeleton className="h-6 w-16 rounded-full bg-black/10" />
					<Skeleton className="h-6 w-20 rounded-full bg-black/10" />
				</div>

				<div className="space-y-3">
					<Skeleton className="h-16 w-[92%] rounded-xl bg-black/10 sm:h-20" />
					<Skeleton className="h-16 w-[68%] rounded-xl bg-black/10 sm:h-20" />
				</div>

				<Skeleton className="mb-10 mt-5 h-4 w-28 rounded-full bg-black/10" />
				<div className="mb-10 border-t border-black/10" />

				<div className="mb-16 space-y-4">
					<Skeleton className="h-5 w-full rounded-md bg-black/10" />
					<Skeleton className="h-5 w-full rounded-md bg-black/10" />
					<Skeleton className="h-5 w-[88%] rounded-md bg-black/10" />
					<Skeleton className="h-5 w-full rounded-md bg-black/10" />
					<Skeleton className="h-5 w-[72%] rounded-md bg-black/10" />
				</div>

				<Skeleton className="mb-6 h-9 w-40 rounded-lg bg-black/10" />
				<div className="space-y-4">
					<Skeleton className="h-28 w-full rounded-[22px] bg-black/10" />
					<Skeleton className="h-28 w-full rounded-[22px] bg-black/10" />
				</div>
			</div>
		</main>
	);
}
