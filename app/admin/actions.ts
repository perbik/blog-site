"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminConfigured, requireAdmin } from "@/lib/admin-session";
import {
	createPost,
	restorePost,
	restorePosts,
	setAutoApproveComments,
	setCommentApproval,
	softDeletePost,
	softDeletePosts,
	updatePost,
} from "@/lib/db/queries";
import { auth } from "@/lib/utils/auth";

export interface AdminActionState {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
	values?: Record<string, string>;
}

const loginSchema = z.object({
	password: z.string().min(1, "Password is required."),
});

const postSchema = z.object({
	title: z.string().trim().min(1, "Title is required.").max(200),
	slug: z
		.string()
		.trim()
		.max(200)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/,
			"Use lowercase letters, numbers, and hyphens only.",
		),
	image: z.union([z.literal(""), z.string().url("Upload a valid image file.")]),
	tags: z.string().trim().max(500),
	body: z.string().trim().min(10, "Body must be at least 10 characters."),
});

const postIdSchema = z.string().uuid();

const moderationSchema = z.object({
	commentId: z.string().uuid(),
	approved: z.enum(["true", "false"]),
	postSlug: z.string().trim().min(1),
});

const autoApprovalSchema = z.object({
	autoApprove: z.enum(["true", "false"]),
});

function createSlug(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export async function authenticateAdmin(
	_prevState: AdminActionState,
	formData: FormData,
): Promise<AdminActionState> {
	if (!isAdminConfigured()) {
		return {
			success: false,
			message: "Configure Better Auth and the admin email first.",
		};
	}

	const parsed = loginSchema.safeParse({
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.flatten().fieldErrors,
		};
	}

	const email = process.env.ADMIN_EMAIL;
	if (!email)
		return { success: false, message: "Admin login is not configured." };

	try {
		await auth.api.signInEmail({
			body: { email, password: parsed.data.password },
		});
	} catch {
		return { success: false, message: "That password is not correct." };
	}

	revalidatePath("/admin");
	redirect("/admin");
}

export async function createPostAction(
	_prevState: AdminActionState,
	formData: FormData,
): Promise<AdminActionState> {
	await requireAdmin();

	const values = {
		title: String(formData.get("title") ?? ""),
		slug: String(formData.get("slug") ?? ""),
		image: String(formData.get("image") ?? ""),
		tags: String(formData.get("tags") ?? ""),
		body: String(formData.get("body") ?? ""),
	};
	const parsed = postSchema.safeParse(values);

	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.flatten().fieldErrors,
			values,
		};
	}

	const slug = parsed.data.slug || createSlug(parsed.data.title);
	if (!slug) {
		return {
			success: false,
			errors: { slug: ["A valid slug could not be generated."] },
			values,
		};
	}

	try {
		await createPost({
			title: parsed.data.title,
			slug,
			image: parsed.data.image || null,
			tags: parsed.data.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean),
			body: parsed.data.body,
		});
	} catch {
		return {
			success: false,
			message: "The post could not be created. Check that the slug is unique.",
			values,
		};
	}

	revalidatePath("/");
	revalidatePath("/blog");
	redirect(`/blog/${slug}?postAction=created`);
}

export async function updatePostAction(
	_prevState: AdminActionState,
	formData: FormData,
): Promise<AdminActionState> {
	await requireAdmin();

	const values = {
		title: String(formData.get("title") ?? ""),
		slug: String(formData.get("slug") ?? ""),
		image: String(formData.get("image") ?? ""),
		tags: String(formData.get("tags") ?? ""),
		body: String(formData.get("body") ?? ""),
	};
	const postId = postIdSchema.safeParse(formData.get("postId"));
	const parsed = postSchema.safeParse(values);

	if (!postId.success) return { success: false, message: "Invalid post." };
	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.flatten().fieldErrors,
			values,
		};
	}

	const slug = parsed.data.slug || createSlug(parsed.data.title);
	if (!slug) {
		return {
			success: false,
			errors: { slug: ["A valid slug could not be generated."] },
			values,
		};
	}

	try {
		const updated = await updatePost(postId.data, {
			title: parsed.data.title,
			slug,
			image: parsed.data.image || null,
			tags: parsed.data.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean),
			body: parsed.data.body,
		});
		if (updated.length === 0) {
			return { success: false, message: "This post no longer exists." };
		}
	} catch {
		return {
			success: false,
			message: "The post could not be updated. Check that the slug is unique.",
			values,
		};
	}

	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/admin");
	revalidatePath(`/blog/${slug}`);
	redirect("/admin?tab=posts&postAction=updated");
}

export async function deletePostAction(formData: FormData) {
	await requireAdmin();

	const postId = postIdSchema.safeParse(formData.get("postId"));
	if (!postId.success) throw new Error("Invalid post.");

	await softDeletePost(postId.data);
	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/admin");
	redirect("/admin?tab=posts&postAction=deleted");
}

export async function bulkDeletePostsAction(formData: FormData) {
	await requireAdmin();

	const postIds = z
		.array(z.string().uuid())
		.min(1)
		.safeParse(formData.getAll("postIds"));
	if (!postIds.success) throw new Error("Select at least one valid post.");

	await softDeletePosts(postIds.data);
	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/admin");
	redirect("/admin?tab=posts&postAction=bulkDeleted");
}

export async function restorePostAction(formData: FormData) {
	await requireAdmin();

	const postId = postIdSchema.safeParse(formData.get("postId"));
	if (!postId.success) throw new Error("Invalid post.");

	await restorePost(postId.data);
	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/admin");
	redirect("/admin?tab=posts&postAction=restored");
}

export async function bulkRestorePostsAction(formData: FormData) {
	await requireAdmin();

	const postIds = z
		.array(z.string().uuid())
		.min(1)
		.safeParse(formData.getAll("postIds"));
	if (!postIds.success) throw new Error("Select at least one valid post.");

	await restorePosts(postIds.data);
	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/admin");
	redirect("/admin?tab=posts&postAction=bulkRestored");
}

export async function toggleCommentApproval(formData: FormData) {
	await requireAdmin();

	const parsed = moderationSchema.safeParse({
		commentId: formData.get("commentId"),
		approved: formData.get("approved"),
		postSlug: formData.get("postSlug"),
	});

	if (!parsed.success) throw new Error("Invalid moderation request.");

	await setCommentApproval(
		parsed.data.commentId,
		parsed.data.approved === "true",
	);
	revalidatePath("/admin");
	revalidatePath(`/blog/${parsed.data.postSlug}`);
}

export async function toggleAutoApproval(formData: FormData) {
	await requireAdmin();

	const parsed = autoApprovalSchema.safeParse({
		autoApprove: formData.get("autoApprove"),
	});

	if (!parsed.success) throw new Error("Invalid auto-approval setting.");

	await setAutoApproveComments(parsed.data.autoApprove === "true");
	revalidatePath("/admin");
}

export async function logoutAdmin() {
	await auth.api.signOut({ headers: await headers() });
	revalidatePath("/admin");
	redirect("/admin");
}
