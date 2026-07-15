import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { NewPostForm } from "@/components/admin/NewPostForm";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getPostById } from "@/lib/db/queries";

export const metadata: Metadata = {
	title: "Edit post",
};

export default async function EditPostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	if (!(await isAdminAuthenticated())) redirect("/admin");

	const { id } = await params;
	const post = await getPostById(id);
	if (!post) notFound();

	return (
		<main className="min-h-screen bg-[#0a0a0a] px-4 pb-20 pt-30 text-black sm:px-6">
			<div className="mx-auto max-w-5xl space-y-4">
				<header className="rounded-[28px] bg-[#F5B22D] px-7 py-8 sm:px-10">
					<Link
						href="/admin?tab=posts"
						className="text-xs font-semibold uppercase tracking-widest hover:underline"
					>
						← Back to posts
					</Link>
					<h1 className="mt-5 font-heading text-5xl font-bold uppercase leading-none sm:text-7xl">
						Edit post
					</h1>
				</header>
				<NewPostForm post={post} />
			</div>
		</main>
	);
}
