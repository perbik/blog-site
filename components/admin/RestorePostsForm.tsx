"use client";

import { RotateCcw } from "lucide-react";
import { useFormStatus } from "react-dom";

import { bulkRestorePostsAction, restorePostAction } from "@/app/admin/actions";

function RestoreButton({
	bulk,
	count = 1,
}: {
	bulk?: boolean;
	count?: number;
}) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending || (bulk && count === 0)}
			className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#848C41] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6f7637] disabled:cursor-not-allowed disabled:opacity-40"
		>
			<RotateCcw className="size-3.5" />
			{pending
				? "Restoring…"
				: bulk
					? `Restore selected (${count})`
					: "Restore"}
		</button>
	);
}

export function RestorePostForm({ postId }: { postId: string }) {
	return (
		<form action={restorePostAction}>
			<input type="hidden" name="postId" value={postId} />
			<RestoreButton />
		</form>
	);
}

export function BulkRestorePostsForm({ postIds }: { postIds: string[] }) {
	return (
		<form action={bulkRestorePostsAction}>
			{postIds.map((postId) => (
				<input key={postId} type="hidden" name="postIds" value={postId} />
			))}
			<RestoreButton bulk count={postIds.length} />
		</form>
	);
}
