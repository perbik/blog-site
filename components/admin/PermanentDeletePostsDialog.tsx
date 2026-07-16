"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
	bulkPermanentlyDeletePostsAction,
	permanentlyDeletePostAction,
} from "@/app/admin/actions";
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

function ConfirmPermanentDeleteButton({ bulk }: { bulk: boolean }) {
	const { pending } = useFormStatus();

	return (
		<AlertDialogAction
			type="submit"
			disabled={pending}
			className="cursor-pointer bg-[#EA4D30] font-semibold text-white hover:bg-[#c93b22] disabled:cursor-wait disabled:opacity-60"
		>
			{pending
				? "Deleting…"
				: bulk
					? "Permanently delete selected"
					: "Permanently delete"}
		</AlertDialogAction>
	);
}

interface PermanentDeletePostsDialogProps {
	postIds: string[];
	postTitle?: string;
	bulk?: boolean;
}

export function PermanentDeletePostsDialog({
	postIds,
	postTitle,
	bulk = false,
}: PermanentDeletePostsDialogProps) {
	const count = postIds.length;
	const action = bulk
		? bulkPermanentlyDeletePostsAction
		: permanentlyDeletePostAction;

	return (
		<AlertDialog>
			<AlertDialogTrigger
				disabled={count === 0}
				className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#EA4D30] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#c93b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA4D30] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<Trash2 className="size-3.5" />
				{bulk ? `Permanently delete (${count})` : "Permanently delete"}
			</AlertDialogTrigger>
			<AlertDialogContent className="max-w-md gap-5 rounded-[24px] border-0 bg-white p-6 text-black shadow-2xl ring-0 sm:max-w-md">
				<AlertDialogHeader className="gap-3 sm:grid-cols-[auto_1fr]">
					<AlertDialogMedia className="mb-0 size-12 rounded-full bg-[#EA4D30]/12 text-[#EA4D30]">
						<Trash2 className="size-5" />
					</AlertDialogMedia>
					<div>
						<AlertDialogTitle className="font-heading text-xl font-semibold">
							{bulk
								? `Permanently delete ${count} selected posts?`
								: "Permanently delete this post?"}
						</AlertDialogTitle>
						<AlertDialogDescription className="mt-2 text-sm leading-6 text-black/60">
							{postTitle ? (
								<span className="font-semibold text-black">“{postTitle}” </span>
							) : null}
							This cannot be undone. The {bulk ? "posts" : "post"} and all
							associated comments will be permanently removed.
						</AlertDialogDescription>
					</div>
				</AlertDialogHeader>
				<form action={action}>
					{postIds.map((postId) => (
						<input
							key={postId}
							type="hidden"
							name={bulk ? "postIds" : "postId"}
							value={postId}
						/>
					))}
					<AlertDialogFooter className="-mx-6 -mb-6 mt-1 rounded-b-[24px] border-black/8 bg-[#f5f5f5] p-5">
						<AlertDialogCancel className="cursor-pointer border-black/15 bg-white font-semibold text-black hover:bg-black/5">
							Cancel
						</AlertDialogCancel>
						<ConfirmPermanentDeleteButton bulk={bulk} />
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
