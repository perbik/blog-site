"use client";

import { useFormStatus } from "react-dom";

export function SubmitCommentButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="min-h-14 w-full rounded-full bg-black px-8 py-4 font-mono text-lg font-semibold leading-none text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-54"
		>
			{pending ? "Sending..." : "Send Comment"}
		</button>
	);
}
