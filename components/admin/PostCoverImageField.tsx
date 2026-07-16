"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef } from "react";

interface PostCoverImageFieldProps {
	image: string;
	error?: string;
	uploading: boolean;
	onUpload: (file?: File) => Promise<void>;
	onRemove: () => void;
}

export function PostCoverImageField({
	image,
	error,
	uploading,
	onUpload,
	onRemove,
}: PostCoverImageFieldProps) {
	const fileInput = useRef<HTMLInputElement>(null);

	function handleDrop(event: DragEvent<HTMLFieldSetElement>) {
		event.preventDefault();
		void onUpload(event.dataTransfer.files[0]);
	}

	return (
		<div className="md:col-span-2">
			<label htmlFor="post-cover" className="mb-2 block text-sm font-medium">
				Cover image
			</label>
			<input
				id="post-cover"
				ref={fileInput}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="sr-only"
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					void onUpload(event.target.files?.[0])
				}
			/>
			<input type="hidden" name="image" value={image} />
			<fieldset
				aria-label="Cover image drop zone"
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
							onClick={onRemove}
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
							{uploading ? "Uploading image…" : "Drop an image here"}
						</strong>
						<span>or click to browse · max 2 MB</span>
						<Upload className="mt-1 size-4" />
					</button>
				)}
			</fieldset>
			{error ? <p className="mt-2 text-xs text-[#b32f1b]">{error}</p> : null}
		</div>
	);
}
