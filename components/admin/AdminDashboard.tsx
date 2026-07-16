import Link from "next/link";

import { AutoApprovalToggle } from "@/components/admin/AutoApprovalToggle";
import { CommentModeration } from "@/components/admin/CommentModeration";
import { NewPostForm } from "@/components/admin/NewPostForm";
import { PostsTable } from "@/components/admin/PostsTable";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
	activeTab: "dashboard" | "compose" | "posts" | "moderation";
	posts?: React.ComponentProps<typeof PostsTable>["posts"];
	deletedPosts?: React.ComponentProps<typeof PostsTable>["deletedPosts"];
	comments?: React.ComponentProps<typeof CommentModeration>["comments"];
	autoApproveComments?: boolean;
}

export function AdminDashboard({
	activeTab,
	posts,
	deletedPosts,
	comments,
	autoApproveComments,
}: AdminDashboardProps) {
	const safePosts = posts ?? [];
	const safeDeletedPosts = deletedPosts ?? [];
	const safeComments = comments ?? [];
	const hiddenCount = safeComments.filter(
		(comment) => !comment.approved,
	).length;
	const approvedCount = safeComments.length - hiddenCount;
	const stats = [
		{ label: "Posts", value: safePosts.length, color: "bg-[#F8E8CE]" },
		{ label: "Approved comments", value: approvedCount, color: "bg-[#848C41]" },
		{ label: "Hidden comments", value: hiddenCount, color: "bg-[#EA4D30]" },
	];
	return (
		<main className="min-h-screen bg-[#0a0a0a] px-4 pb-20 pt-30 text-black sm:px-6">
			<div className="mx-auto max-w-7xl space-y-4">
				<nav className="flex flex-wrap gap-2" aria-label="Admin sections">
					<Link
						href="/admin"
						className={cn(
							"cursor-pointer rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-widest transition",
							activeTab === "dashboard"
								? "bg-white text-black"
								: "border border-white/45 text-white hover:bg-white hover:text-black",
						)}
					>
						Dashboard
					</Link>
					<Link
						href="/admin?tab=compose"
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
						href="/admin?tab=posts"
						className={cn(
							"cursor-pointer rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-widest transition",
							activeTab === "posts"
								? "bg-white text-black"
								: "border border-white/45 text-white hover:bg-white hover:text-black",
						)}
					>
						Posts
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

				{activeTab === "dashboard" ? (
					<header className="rounded-[28px] bg-[#F5B22D] px-7 py-8 sm:px-10 sm:py-10">
						<p className="text-sm font-semibold">Admin panel</p>
						<h1 className="mt-2 font-heading text-5xl font-bold uppercase leading-none sm:text-7xl">
							Dashboard
						</h1>
					</header>
				) : null}

				{activeTab === "dashboard" ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className={cn("rounded-[24px] p-5 sm:p-7", stat.color)}
							>
								<p className="font-heading text-lg font-semibold sm:text-2xl">
									{stat.label}
								</p>
								<p className="mt-2 text-right font-heading text-5xl font-semibold sm:text-7xl">
									{stat.value}
								</p>
							</div>
						))}
					</div>
				) : activeTab === "compose" ? (
					<NewPostForm />
				) : activeTab === "posts" ? (
					<PostsTable posts={safePosts} deletedPosts={safeDeletedPosts} />
				) : (
					<section className="space-y-4">
						<AutoApprovalToggle enabled={autoApproveComments ?? false} />
						<CommentModeration comments={safeComments} />
					</section>
				)}
			</div>
		</main>
	);
}
