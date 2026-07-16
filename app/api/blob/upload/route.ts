import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";

import { requireAdmin } from "@/lib/admin-session";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
	const body = (await request.json()) as HandleUploadBody;

	try {
		const response = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async () => {
				// Validate authorization and upload constraints before issuing a token.
				await requireAdmin();

				return {
					allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
					maximumSizeInBytes: MAX_IMAGE_BYTES,
					addRandomSuffix: true,
				};
			},
			onUploadCompleted: async () => {},
		});

		return Response.json(response);
	} catch (error) {
		return Response.json(
			{
				error:
					error instanceof Error ? error.message : "The image upload failed.",
			},
			{ status: 400 },
		);
	}
}
