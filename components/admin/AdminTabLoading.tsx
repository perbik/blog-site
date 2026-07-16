import { Skeleton } from "@/components/ui/skeleton";

type AdminTab = "dashboard" | "compose" | "posts" | "moderation";

function AdminTabNavSkeleton({ activeTab }: { activeTab: AdminTab }) {
	return (
		<div className="flex flex-wrap gap-2" aria-hidden="true">
			{["dashboard", "compose", "posts", "moderation"].map((tab) => (
				<Skeleton
					key={tab}
					className={`h-10 rounded-full ${tab === activeTab ? "w-28 bg-white/30" : "w-24 bg-white/12"}`}
				/>
			))}
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{["posts", "approved", "hidden"].map((item) => (
				<Skeleton key={item} className="h-40 rounded-[24px] bg-white/12" />
			))}
		</div>
	);
}

function ComposeSkeleton() {
	return (
		<div className="rounded-[30px] bg-white p-6 sm:p-10">
			<Skeleton className="h-14 w-full rounded-2xl bg-black/10" />
			<div className="mt-6 grid gap-6 md:grid-cols-2">
				<Skeleton className="h-20 rounded-2xl bg-black/10" />
				<Skeleton className="h-20 rounded-2xl bg-black/10" />
				<Skeleton className="aspect-video rounded-2xl bg-black/10 md:col-span-2" />
			</div>
			<Skeleton className="mt-6 h-80 rounded-2xl bg-black/10" />
			<Skeleton className="mx-auto mt-6 h-12 w-44 rounded-full bg-black/10" />
		</div>
	);
}

function PostsSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-11 w-52 rounded-full bg-white/12" />
			<div className="flex items-center justify-between rounded-[24px] bg-[#171717] p-3">
				<Skeleton className="h-11 w-52 rounded-full bg-white/12" />
				<Skeleton className="h-11 w-40 rounded-full bg-white/12" />
			</div>
			<div className="overflow-hidden rounded-[28px] bg-white p-6">
				<Skeleton className="h-12 rounded-xl bg-[#F8E8CE]" />
				{["first", "second", "third", "fourth", "fifth"].map((row) => (
					<Skeleton key={row} className="mt-4 h-16 rounded-xl bg-black/8" />
				))}
			</div>
			<div className="flex justify-between">
				<Skeleton className="h-5 w-32 rounded-full bg-white/12" />
				<Skeleton className="h-10 w-56 rounded-full bg-white/12" />
			</div>
		</div>
	);
}

function ModerationSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-28 rounded-[24px] bg-white/12" />
			<Skeleton className="h-11 w-52 rounded-full bg-white/12" />
			{["first", "second", "third"].map((comment) => (
				<div key={comment} className="rounded-[28px] bg-white p-6 sm:p-8">
					<Skeleton className="h-7 w-48 rounded-lg bg-black/10" />
					<Skeleton className="mt-3 h-4 w-36 rounded-full bg-black/8" />
					<Skeleton className="mt-6 h-4 w-full rounded-full bg-black/8" />
					<Skeleton className="mt-3 h-4 w-4/5 rounded-full bg-black/8" />
				</div>
			))}
		</div>
	);
}

export function AdminTabLoading({ activeTab }: { activeTab: AdminTab }) {
	return (
		<main
			className="min-h-screen bg-[#0a0a0a] px-4 pb-20 pt-30 text-black sm:px-6"
			aria-label={`Loading ${activeTab} tab`}
			aria-busy="true"
		>
			<span className="sr-only">Loading {activeTab} tab…</span>
			<div className="mx-auto max-w-7xl space-y-4">
				<AdminTabNavSkeleton activeTab={activeTab} />
				{activeTab === "dashboard" ? (
					<Skeleton className="h-44 rounded-[28px] bg-[#F5B22D]/35" />
				) : null}
				{activeTab === "dashboard" ? <DashboardSkeleton /> : null}
				{activeTab === "compose" ? <ComposeSkeleton /> : null}
				{activeTab === "posts" ? <PostsSkeleton /> : null}
				{activeTab === "moderation" ? <ModerationSkeleton /> : null}
			</div>
		</main>
	);
}
