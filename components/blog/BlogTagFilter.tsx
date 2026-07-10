"use client";

import { Check, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface BlogTagFilterProps {
	tags: string[];
	activeTags?: string[];
}

function getBlogHref(tags: string[]) {
	const params = new URLSearchParams();

	for (const tag of tags) {
		params.append("tag", tag);
	}

	return `/blog${params.size ? `?${params.toString()}` : ""}`;
}

export function BlogTagFilter({ tags, activeTags = [] }: BlogTagFilterProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState(activeTags);
	const activeLabel = activeTags.length > 0 ? activeTags.join(", ") : "All";
	const applyHref = useMemo(() => getBlogHref(selectedTags), [selectedTags]);

	useEffect(() => {
		setSelectedTags(activeTags);
	}, [activeTags]);

	const toggleTag = (tag: string) => {
		setSelectedTags((current) =>
			current.includes(tag)
				? current.filter((selectedTag) => selectedTag !== tag)
				: [...current, tag],
		);
	};

	const applyFilters = () => {
		router.push(applyHref);
		setOpen(false);
	};

	const getRemoveHref = (tag: string) =>
		getBlogHref(activeTags.filter((activeTag) => activeTag !== tag));

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<div className="flex flex-wrap items-center gap-3">
				<SheetTrigger
					render={
						<Button
							type="button"
							variant="outline"
							className="h-11 rounded-full border-white/15 bg-white/10 px-5 font-mono text-sm text-white hover:bg-white hover:text-black"
						/>
					}
				>
					<SlidersHorizontal className="size-4" aria-hidden="true" />
					<span>Filter</span>
				</SheetTrigger>

				<Link
					href="/blog"
					className={cn(
						"inline-flex h-11 items-center rounded-full border px-5 font-mono text-sm transition-colors",
						activeTags.length === 0
							? "border-white bg-white text-black"
							: "border-white/10 bg-white/10 text-white/65 hover:bg-white/15 hover:text-white",
					)}
				>
					All
				</Link>

				{activeTags.map((tag) => (
					<Link
						key={tag}
						href={getRemoveHref(tag)}
						aria-label={`Remove ${tag} filter`}
						className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 font-mono text-sm text-white/75 transition-colors hover:bg-white hover:text-black"
					>
						{tag}
						<X className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
					</Link>
				))}
			</div>

			<SheetContent
				side="right"
				className="w-[360px] max-w-[calc(100vw-24px)] gap-0 border-white/10 bg-[#111] px-5 py-5 text-white"
			>
				<SheetTitle className="font-heading text-4xl font-black leading-none text-white">
					Filter blogs
				</SheetTitle>
				<p className="mt-2 font-mono text-sm text-white/45">
					{tags.length} tags available
				</p>

				<div className="mt-7 grid gap-2 overflow-y-auto pr-1">
					{tags.map((tag) => {
						const selected = selectedTags.includes(tag);

						return (
							<button
								key={tag}
								type="button"
								onClick={() => toggleTag(tag)}
								className={cn(
									"flex min-h-12 cursor-pointer items-center justify-between rounded-[16px] border px-4 text-left font-mono text-sm transition-colors",
									selected
										? "border-white bg-white text-black"
										: "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white",
								)}
								aria-pressed={selected}
							>
								<span>{tag}</span>
								{selected ? (
									<Check
										className="size-4"
										strokeWidth={2.3}
										aria-hidden="true"
									/>
								) : null}
							</button>
						);
					})}
				</div>

				<div className="mt-auto flex gap-2 pt-6">
					<Button
						type="button"
						variant="outline"
						className="h-11 flex-1 rounded-full border-white/15 bg-transparent font-mono text-sm text-white hover:bg-white/10 hover:text-white"
						onClick={() => setSelectedTags([])}
					>
						Clear
					</Button>
					<Button
						type="button"
						className="h-11 flex-1 rounded-full bg-white font-mono text-sm text-black hover:bg-white/80"
						onClick={applyFilters}
					>
						Apply
					</Button>
				</div>

				<p className="mt-4 font-mono text-xs leading-relaxed text-white/35">
					Current filter: {activeLabel}
				</p>
			</SheetContent>
		</Sheet>
	);
}
