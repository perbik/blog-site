import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BlogCardProps {
	title: string;
	href: string;
	image?: string | null;
	badge?: string;
	className?: string;
	imageClassName?: string;
}

export function BlogCard({
	title,
	href,
	image,
	badge,
	className,
	imageClassName,
}: BlogCardProps) {
	return (
		<Link
			href={href}
			className={cn(
				"group flex h-96 w-[78vw] max-w-80 shrink-0 flex-col overflow-hidden rounded-[2rem] bg-yellow-400 p-4 text-black transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30 sm:h-92 sm:rounded-[2.35rem] sm:p-5",
				className,
			)}
		>
			<div
				className={cn(
					"h-[42%] w-full shrink-0 rounded-[1.35rem] bg-zinc-300 bg-cover bg-center brightness-105 saturate-90 contrast-105 sm:rounded-[1.55rem]",
					imageClassName,
				)}
				style={image ? { backgroundImage: `url(${image})` } : undefined}
				aria-hidden="true"
			/>

			<div className="flex min-h-0 flex-1 flex-col pt-4">
				{badge ? (
					<span className="mb-3 w-fit rounded-full bg-black px-3 py-1 font-heading text-xs font-bold uppercase leading-none text-white">
						{badge}
					</span>
				) : null}

				<h2 className="line-clamp-4 max-w-full text-balance font-heading text-3xl font-black leading-[0.95] sm:text-4xl">
					{title}
				</h2>

				<span className="mt-auto flex size-14 items-center justify-center self-end rounded-full border-[3px] border-black transition-transform duration-200 group-hover:rotate-45 sm:size-16">
					<ArrowUpRight
						className="size-8 stroke-3 sm:size-9"
						aria-hidden="true"
					/>
					<span className="sr-only">Read {title}</span>
				</span>
			</div>
		</Link>
	);
}
