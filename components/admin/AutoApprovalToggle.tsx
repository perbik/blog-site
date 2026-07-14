"use client";

import { useFormStatus } from "react-dom";

import { toggleAutoApproval } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

function ToggleButton({ enabled }: { enabled: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			role="switch"
			aria-checked={enabled}
			aria-label="Automatically approve new comments"
			disabled={pending}
			className={cn(
				"relative h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-black transition disabled:cursor-wait disabled:opacity-60",
				enabled ? "bg-[#848C41]" : "bg-white/50",
			)}
		>
			<span
				className={cn(
					"absolute left-1 top-1/2 size-5 -translate-y-1/2 rounded-full bg-black transition-transform",
					enabled ? "translate-x-6" : "translate-x-0",
				)}
			/>
		</button>
	);
}

export function AutoApprovalToggle({ enabled }: { enabled: boolean }) {
	return (
		<div className="flex items-center justify-between gap-5 rounded-[24px] bg-[#F5B22D] p-5 text-black sm:p-7">
			<div>
				<h2 className="font-heading text-xl font-semibold sm:text-2xl">
					Automatic comment approval
				</h2>
				<p className="mt-1 max-w-2xl text-sm text-black/65">
					{enabled
						? "New comments appear immediately. You can still hide them below."
						: "New comments stay hidden until you approve them below."}
				</p>
			</div>
			<form action={toggleAutoApproval}>
				<input
					type="hidden"
					name="autoApprove"
					value={enabled ? "false" : "true"}
				/>
				<ToggleButton enabled={enabled} />
			</form>
		</div>
	);
}
