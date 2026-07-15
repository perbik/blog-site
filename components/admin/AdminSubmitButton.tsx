"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

interface AdminSubmitButtonProps {
	idleLabel: string;
	pendingLabel: string;
	disabled?: boolean;
}

export function AdminSubmitButton({
	idleLabel,
	pendingLabel,
	disabled = false,
}: AdminSubmitButtonProps) {
	const { pending } = useFormStatus();
	const isDisabled = pending || disabled;

	return (
		<button
			type="submit"
			disabled={isDisabled}
			className="mt-5 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-45"
		>
			{pending ? (
				<LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
			) : (
				<ArrowRight className="size-4" aria-hidden="true" />
			)}
			{pending ? pendingLabel : idleLabel}
		</button>
	);
}
