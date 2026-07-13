"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface FilterChipProps {
	label: string;
	active: boolean;
	onSelect?: () => void;
}

export function FilterChip({ label, active, onSelect }: FilterChipProps) {
	const params = new URLSearchParams(useSearchParams());

	if (active) {
		params.delete("tag");
	} else {
		params.set("tag", label);
	}

	const href = `/blog${params.size ? `?${params.toString()}` : ""}`;

	return (
		<Link
			href={href}
			onClick={onSelect}
			className={cn(
				"inline-flex h-6 min-w-12 items-center justify-center rounded-full border border-foreground px-3 text-sm font-semibold uppercase leading-none",
				active && "bg-foreground text-background",
			)}
		>
			{label}
		</Link>
	);
}
