"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 6000;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function getImageDimensions(file: File) {
	// Object URLs inspect local image dimensions without uploading or base64-encoding the file
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

export function usePostImageUpload(initialImage = "") {
	const [image, setImage] = useState(initialImage);
	const [imageError, setImageError] = useState("");
	const [imageUploading, setImageUploading] = useState(false);

	async function uploadImage(file?: File) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setImageError("Choose an image file.");
			return;
		}
		if (file.size > MAX_IMAGE_BYTES) {
			setImageError("Image must be 2 MB or smaller.");
			return;
		}
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			setImageError("Use a JPEG, PNG, or WebP image.");
			return;
		}

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

	function removeImage() {
		setImage("");
		setImageError("");
	}

	return {
		image,
		imageError,
		imageUploading,
		uploadImage,
		removeImage,
	};
}
