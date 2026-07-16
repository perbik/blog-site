"use client";

import { useActionState, useState } from "react";

import {
	type AdminActionState,
	createPostAction,
	updatePostAction,
} from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { PostCoverImageField } from "@/components/admin/PostCoverImageField";
import { usePostImageUpload } from "@/hooks/usePostImageUpload";
import { slugify } from "@/lib/utils/post-utils";

const initialState: AdminActionState = { success: false };

interface PostFormProps {
	post?: {
		id: string;
		title: string;
		slug: string;
		image: string | null;
		tags: string[];
		body: string;
	};
}

export function NewPostForm({ post }: PostFormProps = {}) {
	const action = post ? updatePostAction : createPostAction;
	const startingState: AdminActionState = post
		? {
				success: false,
				values: {
					title: post.title,
					slug: post.slug,
					image: post.image ?? "",
					tags: post.tags.join(", "),
					body: post.body,
				},
			}
		: initialState;
	const [state, formAction] = useActionState(action, startingState);
	const [title, setTitle] = useState(state.values?.title ?? "");
	const [slug, setSlug] = useState(state.values?.slug ?? "");
	const { image, imageError, imageUploading, uploadImage, removeImage } =
		usePostImageUpload(state.values?.image ?? "");

	return (
		<form
			action={formAction}
			className="rounded-[30px] bg-white p-6 sm:p-10"
			noValidate
		>
			{post ? <input type="hidden" name="postId" value={post.id} /> : null}
			<input type="hidden" name="slug" value={slug} />
			<div>
				<div className="mb-2 flex justify-between">
					<label htmlFor="post-title" className="text-sm font-medium">
						Title
					</label>
					<span className="text-xs text-black/40" aria-live="polite">
						{title.length} / 80 characters
					</span>
				</div>
				<input
					id="post-title"
					name="title"
					required
					maxLength={80}
					value={title}
					onChange={(event) => {
						setTitle(event.target.value);
						setSlug(slugify(event.target.value));
					}}
					placeholder="A clear, memorable headline"
					className="h-14 w-full rounded-2xl bg-[#ededed] px-5 text-sm outline-none focus:ring-2 focus:ring-black/20"
				/>
				{state.errors?.title?.[0] ? (
					<p className="mt-2 text-xs text-[#b32f1b]">{state.errors.title[0]}</p>
				) : null}
			</div>

			<div className="mt-6 grid gap-6 md:grid-cols-2">
				<div>
					<label htmlFor="post-slug" className="mb-2 block text-sm font-medium">
						Slug
					</label>
					<input
						id="post-slug"
						value={slug}
						disabled
						placeholder="generated-from-the-title"
						className="h-14 w-full cursor-not-allowed rounded-2xl bg-[#e4e4e4] px-5 text-sm text-black/55"
					/>
				</div>
				<div>
					<label htmlFor="post-tags" className="mb-2 block text-sm font-medium">
						Tags
					</label>
					<input
						id="post-tags"
						name="tags"
						defaultValue={state.values?.tags}
						placeholder="design, systems, culture"
						className="h-14 w-full rounded-2xl bg-[#ededed] px-5 text-sm outline-none focus:ring-2 focus:ring-black/20"
					/>
				</div>

				<PostCoverImageField
					image={image}
					error={imageError || state.errors?.image?.[0]}
					uploading={imageUploading}
					onUpload={uploadImage}
					onRemove={removeImage}
				/>
			</div>

			<div className="mt-6">
				<div className="mb-2 flex justify-between">
					<label htmlFor="post-body" className="text-sm font-medium">
						Body
					</label>
					<span className="text-xs text-black/40">Markdown supported</span>
				</div>
				<textarea
					id="post-body"
					name="body"
					required
					rows={16}
					defaultValue={state.values?.body}
					placeholder={"## Start with a section\n\nWrite your story here…"}
					className="w-full resize-y rounded-2xl bg-[#ededed] px-5 py-4 text-sm leading-7 outline-none focus:ring-2 focus:ring-black/20"
				/>
				{state.errors?.body?.[0] ? (
					<p className="mt-2 text-xs text-[#b32f1b]">{state.errors.body[0]}</p>
				) : null}
			</div>
			{state.message ? (
				<p
					className="mt-4 rounded-xl bg-[#EA4D30]/10 px-4 py-3 text-sm text-[#8c2515]"
					role="alert"
				>
					{state.message}
				</p>
			) : null}
			<div className="flex justify-center">
				<AdminSubmitButton
					idleLabel={post ? "Save changes" : "Publish post"}
					disabled={imageUploading}
					pendingLabel="Publishing…"
				/>
			</div>
		</form>
	);
}
