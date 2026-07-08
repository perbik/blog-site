import { cn } from "@/lib/utils";

interface BracketCheckProps {
	checked: boolean;
}

export function BracketCheck({ checked }: BracketCheckProps) {
	return (
		<span
			className={cn(
				"relative flex h-6 w-6 shrink-0 items-center justify-center text-foreground bg-zinc-200",
				"before:absolute before:left-0 before:top-0 before:h-full before:w-1.25 before:border-y-2 before:border-l-2 before:border-foreground",
				"after:absolute after:right-0 after:top-0 after:h-full after:w-1.25 after:border-y-2 after:border-r-2 after:border-foreground",
			)}
			aria-hidden="true"
		>
			<span
				className={cn(
					"h-2 w-2 rounded-full bg-foreground transition-opacity",
					checked ? "opacity-100" : "opacity-0",
				)}
			/>
		</span>
	);
}
