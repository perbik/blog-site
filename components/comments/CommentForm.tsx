"use client";

import { AlertCircle, Check } from "lucide-react";
import { useActionState, useState } from "react";

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
	const [state, formAction] = useActionState(
		addComment.bind(null, slug),
		initialState,
	);
	const [bodyLength, setBodyLength] = useState(state.values?.body?.length ?? 0);

	const authorNameError = state.errors?.authorName?.[0];
	const bodyError = state.errors?.body?.[0];
	const bodyDescription = [
		bodyError ? "comment-body-error" : undefined,
		"comment-body-count",
	]
		.filter(Boolean)
		.join(" ");

	if (state.success) {
		return (
			<div
				className={cn(
					"w-full rounded-[22px] p-6 text-black",
					accentClassName,
					className,
				)}
			>
				<div
					className="flex items-center gap-4 rounded-[18px] border border-black/15 bg-white/35 p-5"
					role="status"
					aria-live="polite"
				>
					<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/70 text-white">
						<Check className="size-5" strokeWidth={2.2} aria-hidden="true" />
					</span>
					<div>
						<p className="font-heading text-xl font-semibold leading-tight">
							Comment submitted!
						</p>
						<p className="mt-1 text-sm text-black/60">
							It&apos;ll appear here once approved.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form
			action={formAction}
			className={cn(
				"w-full rounded-[22px] p-6 text-black",
				accentClassName,
				className,
			)}
			noValidate
		>
			<div>
				<label
					htmlFor="comment-author-name"
					className="mb-2 block text-sm font-medium"
				>
					Name
				</label>
				<input
					id="comment-author-name"
					name="authorName"
					type="text"
					maxLength={80}
					placeholder="Your name"
					defaultValue={state.values?.authorName}
					aria-invalid={authorNameError ? "true" : undefined}
					aria-describedby={
						authorNameError ? "comment-author-name-error" : undefined
					}
					className="w-full rounded-[16px] border-2 border-transparent bg-white px-5 py-5 font-mono text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-4 focus-visible:ring-black/15 aria-invalid:border-[#EA4D30]"
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
				<label
					htmlFor="comment-body"
					className="mb-2 block text-sm font-medium"
				>
					Comment
				</label>
				<textarea
					id="comment-body"
					name="body"
					minLength={10}
					maxLength={2000}
					placeholder="Share your thoughts..."
					defaultValue={state.values?.body}
					onChange={(event) => setBodyLength(event.currentTarget.value.length)}
					aria-invalid={bodyError ? "true" : undefined}
					aria-describedby={bodyDescription}
					className="min-h-55 w-full resize-none rounded-[16px] border-2 border-transparent bg-[#fcfcfc] px-5 py-5 font-mono text-base text-black outline-none placeholder:text-black/40 focus-visible:ring-4 focus-visible:ring-black/15 aria-invalid:border-[#EA4D30]"
				/>
				<div className="mt-2 flex items-start justify-between gap-4 px-2">
					{bodyError ? (
						<p
							id="comment-body-error"
							className="font-mono text-xs text-[#9f2013]"
						>
							{bodyError}
						</p>
					) : (
						<span />
					)}
					<output
						id="comment-body-count"
						className={cn(
							"shrink-0 font-mono text-xs text-black/55",
							bodyLength >= 1900 && "font-semibold text-[#9f2013]",
						)}
						aria-live="polite"
					>
						{bodyLength}/2000
					</output>
				</div>
			</div>

			{state.message ? (
				<div
					className="mt-4 flex items-center gap-3 rounded-[16px] border border-[#9f2013]/25 bg-white/35 px-4 py-3 text-[#75170d]"
					role="alert"
				>
					<AlertCircle className="size-5 shrink-0" aria-hidden="true" />
					<p className="text-sm font-medium">{state.message}</p>
				</div>
			) : null}

			<div className="mt-5 flex justify-start">
				<SubmitCommentButton />
			</div>
		</form>
	);
}
