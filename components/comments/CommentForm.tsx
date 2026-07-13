"use client";

import { useActionState, useEffect, useRef } from "react";

import { type AddCommentState, addComment } from "@/app/blog/[slug]/actions";
import { cn } from "@/lib/utils";
import { SubmitCommentButton } from "./SubmitCommentButton";

interface CommentFormProps {
	slug: string;
	className?: string;
}

const initialState: AddCommentState = {
	success: false,
};

export function CommentForm({ slug, className }: CommentFormProps) {
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
				"w-full max-w-3xl rounded-[2rem] bg-[#F5B22D] p-5 text-black sm:rounded-[2.8rem] sm:p-10",
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
					className="min-h-20 w-full rounded-[1.6rem] border-0 bg-comment px-7 py-5 font-mono text-lg font-semibold text-black outline-none placeholder:text-black focus-visible:ring-4 focus-visible:ring-black/20 sm:min-h-25 sm:rounded-[1.9rem] sm:px-8 sm:text-xl"
				/>
				{authorNameError ? (
					<p
						id="comment-author-name-error"
						className="mt-2 px-4 font-mono text-sm font-semibold text-black"
					>
						{authorNameError}
					</p>
				) : null}
			</div>

			<div className="mt-5 sm:mt-6">
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
					className="min-h-72 w-full resize-y rounded-[1.6rem] border-0 bg-comment px-7 py-8 font-mono text-lg font-semibold text-black outline-none placeholder:text-black focus-visible:ring-4 focus-visible:ring-black/20 sm:min-h-93 sm:rounded-[1.9rem] sm:px-8 sm:text-xl"
				/>
				{bodyError ? (
					<p
						id="comment-body-error"
						className="mt-2 px-4 font-mono text-sm font-semibold text-black"
					>
						{bodyError}
					</p>
				) : null}
			</div>

			{state.message ? (
				<p className="mt-4 px-4 font-mono text-sm font-semibold text-black">
					{state.message}
				</p>
			) : null}

			<div className="mt-5 flex justify-end sm:mt-6">
				<SubmitCommentButton />
			</div>
		</form>
	);
}
