"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import {
	type ChangeEvent,
	type DragEvent,
	useActionState,
	useRef,
	useState,
} from "react";

import {
	type AdminActionState,
	createPostAction,
	updatePostAction,
} from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

const initialState: AdminActionState = { success: false };
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 6000;

async function getImageDimensions(file: File) {
	const url = URL.createObjectURL(file);

	try {
		const image = new window.Image();
		image.src = url;
		await image.decode();
		return { width: image.naturalWidth, height: image.naturalHeight };
	} finally {
		URL.revokeObjectURL(url);
	}
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

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
	const [image, setImage] = useState(state.values?.image ?? "");
	const [imageError, setImageError] = useState("");
	const [imageUploading, setImageUploading] = useState(false);
	const fileInput = useRef<HTMLInputElement>(null);

	async function uploadImage(file?: File) {
		if (!file) return;
		if (!file.type.startsWith("image/"))
			return setImageError("Choose an image file.");
		if (file.size > MAX_IMAGE_BYTES)
			return setImageError("Image must be 2 MB or smaller.");
		if (
			!(["image/jpeg", "image/png", "image/webp"] as const).includes(
				file.type as "image/jpeg" | "image/png" | "image/webp",
			)
		)
			return setImageError("Use a JPEG, PNG, or WebP image.");

		setImageUploading(true);
		setImageError("");

		try {
			const dimensions = await getImageDimensions(file);
			if (
				dimensions.width > MAX_IMAGE_DIMENSION ||
				dimensions.height > MAX_IMAGE_DIMENSION
			) {
				setImageError("Image dimensions must be 6000 pixels or smaller.");
				return;
			}

			const blob = await upload(`blog/${file.name}`, file, {
				access: "public",
				handleUploadUrl: "/api/blob/upload",
			});

			setImage(blob.url);
			setImageError("");
		} catch {
			setImageError("The image could not be uploaded. Please try again.");
		} finally {
			setImageUploading(false);
		}
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		void uploadImage(event.dataTransfer.files[0]);
	}

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

				<div className="md:col-span-2">
					<label
						htmlFor="post-cover"
						className="mb-2 block text-sm font-medium"
					>
						Cover image
					</label>
					<input
						id="post-cover"
						ref={fileInput}
						type="file"
						accept="image/*"
						className="sr-only"
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							void uploadImage(event.target.files?.[0])
						}
					/>
					<input type="hidden" name="image" value={image} />
					{/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop supplements the accessible file input and browse button. */}
					<div
						onDragOver={(event) => event.preventDefault()}
						onDrop={handleDrop}
						className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-[#ededed] p-5 text-center"
					>
						{image ? (
							<>
								<Image
									src={image}
									alt="Cover preview"
									fill
									className="object-cover"
								/>
								<button
									type="button"
									onClick={() => setImage("")}
									aria-label="Remove cover image"
									className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/80 p-0 text-white shadow-sm backdrop-blur-sm transition hover:bg-black"
								>
									<X className="size-4" />
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => fileInput.current?.click()}
								className="flex cursor-pointer flex-col items-center gap-2 text-sm text-black/55"
							>
								<span className="rounded-full bg-white p-3 text-black">
									<ImagePlus className="size-5" />
								</span>
								<strong className="text-black">
									{imageUploading ? "Uploading image…" : "Drop an image here"}
								</strong>
								<span>or click to browse · max 2 MB</span>
								<Upload className="mt-1 size-4" />
							</button>
						)}
					</div>
					{imageError || state.errors?.image?.[0] ? (
						<p className="mt-2 text-xs text-[#b32f1b]">
							{imageError || state.errors?.image?.[0]}
						</p>
					) : null}
				</div>
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
