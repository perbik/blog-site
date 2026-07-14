"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
	createAdminSession,
	deleteAdminSession,
	isAdminConfigured,
	isCorrectAdminPassword,
	requireAdmin,
} from "@/lib/admin-auth";
import {
	createPost,
	setAutoApproveComments,
	setCommentApproval,
} from "@/lib/db/queries";

export interface AdminActionState {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
	values?: Record<string, string>;
}

const passwordSchema = z.object({
	password: z.string().trim().min(1, "Password is required."),
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
	image: z.union([
		z.literal(""),
		z
			.string()
			.startsWith("data:image/", "Upload a valid image file.")
			.max(2_800_000, "Image is too large."),
	]),
	tags: z.string().trim().max(500),
	body: z.string().trim().min(10, "Body must be at least 10 characters."),
});

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
			message: "Set ADMIN_PASSWORD first.",
		};
	}

	const parsed = passwordSchema.safeParse({
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.flatten().fieldErrors,
		};
	}

	if (!isCorrectAdminPassword(parsed.data.password)) {
		return { success: false, message: "That password is not correct." };
	}

	await createAdminSession();

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
	redirect(`/blog/${slug}`);
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
	await deleteAdminSession();
	revalidatePath("/admin");
	redirect("/admin");
}
