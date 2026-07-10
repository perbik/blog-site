"use client";

import { useActionState, useEffect, useRef } from "react";

import { type AddCommentState, addComment } from "@/app/blog/[slug]/actions";
import { cn } from "@/lib/utils";
import { SubmitCommentButton } from "./SubmitCommentButton";

interface CommentFormProps {
	slug: string;
	accentClassName?: string;
	className?: string;
}

const initialState: AddCommentState = {
	success: false,
};

export function CommentForm({
	slug,
	accentClassName = "bg-[#F5B22D]",
	className,
}: CommentFormProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const [state, formAction] = useActionState(
		addComment.bind(null, slug),
		initialState,
	);

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
		}
	}, [state.success]);

	const authorNameError = state.errors?.authorName?.[0];
	const bodyError = state.errors?.body?.[0];

	return (
		<form
			ref={formRef}
			action={formAction}
			className={cn(
				"w-full rounded-[22px] p-6 text-black",
				accentClassName,
				className,
			)}
			noValidate
		>
			<div>
				<label htmlFor="comment-author-name" className="sr-only">
					Your name
				</label>
				<input
					id="comment-author-name"
					name="authorName"
					type="text"
					maxLength={80}
					placeholder="Your name"
					defaultValue={state.success ? "" : state.values?.authorName}
					aria-invalid={authorNameError ? "true" : undefined}
					aria-describedby={
						authorNameError ? "comment-author-name-error" : undefined
					}
					className="w-full rounded-[16px] border-2 border-transparent bg-white px-5 py-5 font-mono text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-4 focus-visible:ring-black/15 aria-[invalid=true]:border-[#EA4D30]"
				/>
				{authorNameError ? (
					<p
						id="comment-author-name-error"
						className="mt-1 px-2 font-mono text-xs text-[#EA4D30]"
					>
						{authorNameError}
					</p>
				) : null}
			</div>

			<div className="mt-3">
				<label htmlFor="comment-body" className="sr-only">
					Share your thoughts
				</label>
				<textarea
					id="comment-body"
					name="body"
					minLength={10}
					maxLength={2000}
					placeholder="Share your thoughts..."
					defaultValue={state.success ? "" : state.values?.body}
					aria-invalid={bodyError ? "true" : undefined}
					aria-describedby={bodyError ? "comment-body-error" : undefined}
					className="min-h-[220px] w-full resize-none rounded-[16px] border-2 border-transparent bg-[#fcfcfc] px-5 py-5 font-mono text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-4 focus-visible:ring-black/15 aria-[invalid=true]:border-[#EA4D30]"
				/>
				{bodyError ? (
					<p
						id="comment-body-error"
						className="mt-1 px-2 font-mono text-xs text-[#EA4D30]"
					>
						{bodyError}
					</p>
				) : null}
			</div>

			{state.message ? (
				<p className="mt-4 px-2 font-mono text-sm font-medium text-black">
					{state.message}
				</p>
			) : null}

			<div className="mt-4 flex justify-end">
				<SubmitCommentButton />
			</div>
		</form>
	);
}
