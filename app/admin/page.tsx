import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminTabLoading } from "@/components/admin/AdminTabLoading";
import { PostActionToast } from "@/components/layout/PostActionToast";
import { Toaster } from "@/components/ui/sonner";
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

// Fetch only the data required by the currently selected admin tab.
async function AdminContent({ activeTab }: { activeTab: AdminTab }) {
	if (activeTab === "compose") {
		return <AdminDashboard activeTab={activeTab} />;
	}

	if (activeTab === "posts") {
		// Active and trashed posts are independent, so load them concurrently.
		const [posts, deletedPosts] = await Promise.all([
			getPosts(),
			getDeletedPosts(),
		]);
		return (
			<AdminDashboard
				activeTab={activeTab}
				posts={posts}
				deletedPosts={deletedPosts}
			/>
		);
	}

	if (activeTab === "moderation") {
		const [comments, autoApproveComments] = await Promise.all([
			getCommentsForModeration(),
			getAutoApproveComments(),
		]);
		return (
			<AdminDashboard
				activeTab={activeTab}
				comments={comments}
				autoApproveComments={autoApproveComments}
			/>
		);
	}

	const [posts, comments] = await Promise.all([
		getPosts(),
		getCommentsForModeration(),
	]);

	return (
		<AdminDashboard activeTab={activeTab} posts={posts} comments={comments} />
	);
}

async function AuthenticatedAdmin({ searchParams }: AdminPageProps) {
	// Keep all dashboard content behind the server-side session check.
	if (!(await isAdminAuthenticated())) return <AdminLoginForm />;

	const params = await searchParams;
	// Normalize unknown or missing tab values to the dashboard.
	const activeTab: AdminTab =
		params?.tab === "moderation"
			? "moderation"
			: params?.tab === "posts"
				? "posts"
				: params?.tab === "compose"
					? "compose"
					: "dashboard";

	if (activeTab === "compose") {
		return <AdminContent activeTab={activeTab} />;
	}

	return (
		// Reset the loading boundary whenever navigation selects a different tab.
		<Suspense
			key={activeTab}
			fallback={<AdminTabLoading activeTab={activeTab} />}
		>
			<AdminContent activeTab={activeTab} />
		</Suspense>
	);
}

export default function AdminPage(props: AdminPageProps) {
	return (
		<>
			{/* Stream the login or dashboard after the session check completes. */}
			<Suspense fallback={<AdminLoading />}>
				<AuthenticatedAdmin {...props} />
			</Suspense>
			{/* Toast parsing should not delay the protected admin content. */}
			<Suspense fallback={null}>
				<PostActionToast />
			</Suspense>
			<Toaster position="top-right" duration={3000} />
		</>
	);
}
