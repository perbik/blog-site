import Link from "next/link";

import { logoutAdmin } from "@/app/admin/actions";
import { CommentModeration } from "@/components/admin/CommentModeration";
import { NewPostForm } from "@/components/admin/NewPostForm";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
	activeTab: "compose" | "moderation";
	postCount: number;
	comments: React.ComponentProps<typeof CommentModeration>["comments"];
}

export function AdminDashboard({
	activeTab,
	postCount,
	comments,
}: AdminDashboardProps) {
	const hiddenCount = comments.filter((comment) => !comment.approved).length;
	const approvedCount = comments.length - hiddenCount;
	const stats = [
		{ label: "Posts", value: postCount, color: "bg-[#F8E8CE]" },
		{ label: "Approved comments", value: approvedCount, color: "bg-[#848C41]" },
		{ label: "Hidden comments", value: hiddenCount, color: "bg-[#EA4D30]" },
	];

	return (
		<main className="min-h-screen bg-black px-4 pb-20 pt-28 text-black sm:px-6">
			<div className="mx-auto max-w-7xl space-y-4">
				<header className="flex flex-col gap-8 rounded-[28px] bg-[#F5B22D] px-7 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-10">
					<div>
						<p className="text-sm font-semibold">Admin panel</p>
						<h1 className="mt-2 font-heading text-5xl font-bold uppercase leading-none sm:text-7xl">
							Dashboard
						</h1>
					</div>
					<div className="flex items-center gap-3">
						<span className="rounded-full bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white">
							Authenticated
						</span>
						<form action={logoutAdmin}>
							<button
								type="submit"
								className="cursor-pointer rounded-full border border-black/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition hover:bg-black hover:text-white"
							>
								Log out
							</button>
						</form>
					</div>
				</header>

				<div className="grid grid-cols-3 gap-3">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className={cn("rounded-[24px] p-5 sm:p-7", stat.color)}
						>
							<p className="font-heading text-lg font-semibold sm:text-2xl">
								{stat.label}
							</p>
							<p
								className={cn(
									"mt-2 font-heading text-4xl font-semibold",
									"text-right text-5xl sm:text-7xl",
								)}
							>
								{stat.value}
							</p>
						</div>
					))}
				</div>

				<nav className="flex gap-2" aria-label="Admin sections">
					<Link
						href="/admin"
						className={cn(
							"cursor-pointer rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-widest transition",
							activeTab === "compose"
								? "bg-white text-black"
								: "border border-white/45 text-white hover:bg-white hover:text-black",
						)}
					>
						Create post
					</Link>
					<Link
						href="/admin?tab=moderation"
						className={cn(
							"cursor-pointer rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-widest transition",
							activeTab === "moderation"
								? "bg-white text-black"
								: "border border-white/45 text-white hover:bg-white hover:text-black",
						)}
					>
						Moderation
						{hiddenCount > 0 ? (
							<span className="ml-2 rounded-full bg-blog-blue px-2 py-0.5 text-[9px] text-white">
								{hiddenCount}
							</span>
						) : null}
					</Link>
				</nav>

				{activeTab === "compose" ? (
					<NewPostForm />
				) : (
					<section className="space-y-4">
						<CommentModeration comments={comments} />
					</section>
				)}
			</div>
		</main>
	);
}
