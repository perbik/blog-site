import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
	return (
		<main className="min-h-screen bg-[#f5f5f5] px-4 pb-16 pt-28 sm:px-6">
			<div className="mx-auto max-w-[1280px] space-y-4">
				<Skeleton className="h-40 rounded-[28px] bg-black/12" />
				<div className="grid grid-cols-3 gap-3">
					{["posts", "comments", "pending"].map((item) => (
						<Skeleton key={item} className="h-28 rounded-[24px] bg-black/8" />
					))}
				</div>
				<div className="flex gap-2 py-2">
					<Skeleton className="h-10 w-24 rounded-full bg-black/8" />
					<Skeleton className="h-10 w-32 rounded-full bg-black/8" />
				</div>
				<Skeleton className="h-[620px] rounded-[28px] bg-black/8" />
			</div>
		</main>
	);
}
