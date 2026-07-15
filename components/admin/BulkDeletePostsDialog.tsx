"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { bulkDeletePostsAction } from "@/app/admin/actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ConfirmBulkDeleteButton() {
	const { pending } = useFormStatus();

	return (
		<AlertDialogAction
			type="submit"
			disabled={pending}
			className="cursor-pointer bg-[#EA4D30] font-semibold text-white hover:bg-[#c93b22] disabled:cursor-wait disabled:opacity-60"
		>
			{pending ? "Deleting…" : "Delete selected"}
		</AlertDialogAction>
	);
}

export function BulkDeletePostsDialog({ postIds }: { postIds: string[] }) {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				disabled={postIds.length === 0}
				className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#EA4D30] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#c93b22] disabled:cursor-not-allowed disabled:opacity-40"
			>
				<Trash2 className="size-4" />
				Delete selected ({postIds.length})
			</AlertDialogTrigger>
			<AlertDialogContent className="max-w-md gap-5 rounded-[24px] border-0 bg-white p-6 text-black shadow-2xl ring-0 sm:max-w-md">
				<AlertDialogHeader className="gap-3 sm:grid-cols-[auto_1fr]">
					<AlertDialogMedia className="mb-0 size-12 rounded-full bg-[#EA4D30]/12 text-[#EA4D30]">
						<Trash2 className="size-5" />
					</AlertDialogMedia>
					<div>
						<AlertDialogTitle className="font-heading text-xl font-semibold">
							Delete {postIds.length} selected posts?
						</AlertDialogTitle>
						<AlertDialogDescription className="mt-2 text-sm leading-6 text-black/60">
							The selected posts will disappear from the blog. Their data and
							comments will remain stored.
						</AlertDialogDescription>
					</div>
				</AlertDialogHeader>
				<form action={bulkDeletePostsAction}>
					{postIds.map((postId) => (
						<input key={postId} type="hidden" name="postIds" value={postId} />
					))}
					<AlertDialogFooter className="-mx-6 -mb-6 mt-1 rounded-b-[24px] border-black/8 bg-[#f5f5f5] p-5">
						<AlertDialogCancel className="cursor-pointer border-black/15 bg-white font-semibold text-black hover:bg-black/5">
							Cancel
						</AlertDialogCancel>
						<ConfirmBulkDeleteButton />
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
