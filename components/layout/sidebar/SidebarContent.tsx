"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BracketCheck } from "./BracketCheck";
import { FilterChip } from "./FilterChip";

interface SidebarContentProps {
	tags: string[];
	onNavigate?: () => void;
}

export function SidebarContent({ tags, onNavigate }: SidebarContentProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isHomeActive = pathname === "/";
	const isBlogsActive = pathname.startsWith("/blog");
	const activeTag = searchParams.get("tag");

	return (
		<div className="flex w-full flex-col">
			<Link
				href="/"
				onClick={onNavigate}
				className="font-heading text-5xl lg:text-6xl font-black leading-none tracking-tight"
			>
				website
			</Link>

			<nav aria-label="Primary" className="flex flex-col gap-3 mt-4">
				<Link
					href="/"
					onClick={onNavigate}
					className="flex h-5 items-center gap-3 font-heading text-xl md:text-2xl font-bold uppercase leading-none"
					aria-current={isHomeActive ? "page" : undefined}
				>
					<BracketCheck checked={isHomeActive} />
					<span>Home</span>
				</Link>
				<Link
					href="/blog"
					onClick={onNavigate}
					className="mt-1 flex h-5 items-center gap-3 font-heading text-xl md:text-2xl font-bold uppercase leading-none"
					aria-current={isBlogsActive ? "page" : undefined}
				>
					<BracketCheck checked={isBlogsActive} />
					<span>Blogs</span>
				</Link>
			</nav>

			{isBlogsActive ? (
				<section className="mt-28 border-t border-zinc-300 pt-4">
					<h2 className="font-heading text-2xl md:text-3xl font-medium leading-none">
						Filters
					</h2>
					<div className="mt-3 flex flex-wrap gap-x-1 gap-y-2">
						{tags.map((tag) => (
							<FilterChip
								key={tag}
								label={tag}
								active={activeTag === tag}
								onSelect={onNavigate}
							/>
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}
