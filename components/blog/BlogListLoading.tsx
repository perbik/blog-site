import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const skeletonCards = [
	{
		id: "story-a",
		height: "min-h-[470px]",
		image: true,
		titleWidth: "w-[88%]",
	},
	{
		id: "story-b",
		height: "min-h-[390px]",
		image: false,
		titleWidth: "w-[72%]",
	},
	{
		id: "story-c",
		height: "min-h-[430px]",
		image: true,
		titleWidth: "w-[82%]",
	},
	{
		id: "story-d",
		height: "min-h-[410px]",
		image: false,
		titleWidth: "w-[92%]",
	},
	{
		id: "story-e",
		height: "min-h-[470px]",
		image: true,
		titleWidth: "w-[76%]",
	},
	{
		id: "story-f",
		height: "min-h-[390px]",
		image: false,
		titleWidth: "w-[84%]",
	},
] as const;

function BlogCardSkeleton({
	height,
	image,
	titleWidth,
}: (typeof skeletonCards)[number]) {
	return (
		<div
			className={cn(
				"mb-3.75 flex break-inside-avoid-column flex-col rounded-[40px] bg-white/8 p-5 sm:p-6",
				height,
			)}
		>
			{image ? (
				<Skeleton className="mb-5 h-40 w-full shrink-0 rounded-[24px] bg-white/12 sm:h-44" />
			) : null}

			<div className="space-y-3 py-3">
				<Skeleton className={cn("h-10 rounded-xl bg-white/15", titleWidth)} />
				<Skeleton className="h-10 w-[65%] rounded-xl bg-white/15" />
			</div>

			<div className="mt-auto flex items-end justify-between gap-4 pt-4">
				<div className="flex gap-1.5">
					<Skeleton className="h-9 w-20 rounded-full bg-white/15" />
					<Skeleton className="h-9 w-16 rounded-full bg-white/15" />
				</div>
				<Skeleton className="size-14 shrink-0 rounded-full bg-white/15" />
			</div>
		</div>
	);
}

export default function BlogLoading() {
	return (
		<section
			className="min-h-screen bg-[#0a0a0a]"
			aria-label="Loading blog posts"
			aria-busy="true"
		>
			<span className="sr-only">Loading blog posts…</span>

			<div className="mx-auto flex w-full max-w-7xl flex-col px-5 pb-20 pt-25 sm:px-6">
				<div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<Skeleton className="mb-3 h-3 w-24 rounded-full bg-white/12" />
						<Skeleton className="h-16 w-64 rounded-2xl bg-white/12 sm:h-20 sm:w-96" />
					</div>

					<div className="flex gap-3">
						<Skeleton className="h-11 w-24 rounded-full bg-white/12" />
						<Skeleton className="h-11 w-20 rounded-full bg-white/12" />
					</div>
				</div>

				<div className="columns-1 gap-3.75 sm:columns-2 lg:columns-3">
					{skeletonCards.map((card) => (
						<BlogCardSkeleton key={card.id} {...card} />
					))}
				</div>
			</div>
		</section>
	);
}
