"use client";

import { useFormStatus } from "react-dom";

export function SubmitCommentButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="cursor-pointer rounded-[16px] bg-black px-8 py-4 font-mono text-base font-medium text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{pending ? "Sending..." : "Send Comment"}
		</button>
	);
}
