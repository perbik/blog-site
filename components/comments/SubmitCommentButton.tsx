"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitCommentButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex min-w-44 cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-base font-semibold text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:bg-black/45"
		>
			{pending ? (
				<>
					<LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
					Posting…
				</>
			) : (
				<>
					Post comment
					<ArrowRight className="size-4" aria-hidden="true" />
				</>
			)}
		</button>
	);
}
