"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import {
	createComment,
	getAutoApproveComments,
	getPostBySlug,
} from "@/lib/db/queries";

// Validate and normalize public comment input on the server
const commentSchema = z.object({
	authorName: z
		.string()
		.trim()
		.min(1, "Your name is required.")
		.max(80, "Your name must be 80 characters or fewer."),
	body: z
		.string()
		.trim()
		.min(10, "Comment must be at least 10 characters.")
		.max(2000, "Comment must be 2000 characters or fewer."),
});

export interface AddCommentState {
	success: boolean;
	autoApproved?: boolean;
	message?: string;
	errors?: {
		authorName?: string[];
		body?: string[];
	};
	values?: {
		authorName?: string;
		body?: string;
	};
}

// Validate the submission, save it with the current approval setting, and refresh affected views
export async function addComment(
	slug: string,
	_prevState: AddCommentState,
	formData: FormData,
): Promise<AddCommentState> {
	const values = {
		authorName: String(formData.get("authorName") ?? ""),
		body: String(formData.get("body") ?? ""),
	};

	const parsed = commentSchema.safeParse(values);

	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.flatten().fieldErrors,
			values,
		};
	}

	const [post] = await getPostBySlug(slug);

	if (!post) {
		return {
			success: false,
			message: "This post could not be found.",
			values,
		};
	}

	const autoApproved = await getAutoApproveComments();

	// New comments are immediately visible only when auto-approval is enabled.
	await createComment({
		postId: post.id,
		authorName: parsed.data.authorName,
		body: parsed.data.body,
		approved: autoApproved,
	});

	revalidatePath("/blog/[slug]", "page");
	updateTag(`post-comments:${slug}`);
	updateTag("comment-counts");

	return {
		success: true,
		autoApproved,
		message: "Comment posted.",
	};
}
