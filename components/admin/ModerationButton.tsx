"use client";

import { Check, EyeOff, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

interface ModerationButtonProps {
	approved: boolean;
}

export function ModerationButton({ approved }: ModerationButtonProps) {
	const { pending } = useFormStatus();
	const Icon = approved ? EyeOff : Check;

	return (
		<button
			type="submit"
			disabled={pending}
			className={
				approved
					? "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
					: "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#848C41] px-5 text-sm font-semibold text-white transition hover:bg-[#6f7637] disabled:cursor-not-allowed disabled:opacity-45"
			}
		>
			{pending ? (
				<LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
			) : (
				<Icon className="size-4" aria-hidden="true" />
			)}
			{pending ? "Updating…" : approved ? "Hide" : "Approve"}
		</button>
	);
}
