import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
	getAutoApproveComments,
	getCommentsForModeration,
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

async function AdminContent({
	activeTab,
}: {
	activeTab: "compose" | "moderation";
}) {
	const [posts, comments, autoApproveComments] = await Promise.all([
		getPosts(),
		getCommentsForModeration(),
		getAutoApproveComments(),
	]);

	return (
		<AdminDashboard
			activeTab={activeTab}
			postCount={posts.length}
			comments={comments}
			autoApproveComments={autoApproveComments}
		/>
	);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
	if (!(await isAdminAuthenticated())) return <AdminLoginForm />;

	const params = await searchParams;
	const activeTab = params?.tab === "moderation" ? "moderation" : "compose";

	return (
		<Suspense key={activeTab} fallback={<AdminLoading />}>
			<AdminContent activeTab={activeTab} />
		</Suspense>
	);
}
