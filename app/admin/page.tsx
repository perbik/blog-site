import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-session";
import {
	getAutoApproveComments,
	getCommentsForModeration,
	getDeletedPosts,
	getPosts,
} from "@/lib/db/queries";
import AdminLoading from "./loading";

export const metadata: Metadata = {
	title: "Admin",
	description: "Compose posts and moderate comments.",
};

interface AdminPageProps {
	searchParams?: Promise<{ tab?: string }>;
}

type AdminTab = "dashboard" | "compose" | "posts" | "moderation";

async function AdminContent({ activeTab }: { activeTab: AdminTab }) {
	const [posts, deletedPosts, comments, autoApproveComments] =
		await Promise.all([
			getPosts(),
			getDeletedPosts(),
			getCommentsForModeration(),
			getAutoApproveComments(),
		]);

	return (
		<AdminDashboard
			activeTab={activeTab}
			posts={posts}
			deletedPosts={deletedPosts}
			comments={comments}
			autoApproveComments={autoApproveComments}
		/>
	);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
	if (!(await isAdminAuthenticated())) return <AdminLoginForm />;

	const params = await searchParams;
	const activeTab: AdminTab =
		params?.tab === "moderation"
			? "moderation"
			: params?.tab === "posts"
				? "posts"
				: params?.tab === "compose"
					? "compose"
					: "dashboard";

	return (
		<Suspense key={activeTab} fallback={<AdminLoading />}>
			<AdminContent activeTab={activeTab} />
		</Suspense>
	);
}
