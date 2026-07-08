import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BlogCardProps {
	title: string;
	href: string;
	image?: string | null;
	badge?: string;
	layout?: "default" | "side-image";
	className?: string;
	imageClassName?: string;
	titleClassName?: string;
	tabIndex?: number;
}

export function BlogCard({
	title,
	href,
	image,
	badge,
	layout = "default",
	className,
	imageClassName,
	titleClassName,
	tabIndex,
}: BlogCardProps) {
	const isSideImage = layout === "side-image";

	return (
		<Link
			href={href}
			tabIndex={tabIndex}
			className={cn(
				"group flex h-92 w-[78vw] max-w-[20rem] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-yellow-400 p-4 text-black transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30 sm:h-96 sm:w-[20rem] sm:rounded-[2.35rem] sm:p-5",
				isSideImage &&
					"grid flex-none grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] grid-rows-1 gap-3 sm:gap-4",
				className,
			)}
		>
			<div
				className={cn(
					"h-[42%] w-full shrink-0 rounded-[1.35rem] bg-zinc-300 bg-cover bg-center brightness-105 saturate-90 contrast-105 sm:rounded-[1.55rem]",
					isSideImage && "col-start-1 row-start-1 h-full min-h-0 self-stretch",
					imageClassName,
				)}
				style={image ? { backgroundImage: `url(${image})` } : undefined}
				aria-hidden="true"
			/>

			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col pt-4",
					isSideImage && "col-start-2 row-start-1 pt-0",
				)}
			>
				{badge ? (
					<span className="mb-3 w-fit rounded-full bg-black px-3 py-1 font-heading text-xs font-bold uppercase leading-none text-white">
						{badge}
					</span>
				) : null}

				<h2
					className={cn(
						"line-clamp-4 max-w-full py-1 text-balance font-heading text-[2rem] font-black leading-[1.02] sm:text-4xl",
						isSideImage && "text-[1.75rem] sm:text-[2rem] leading-[1.02]",
						titleClassName,
					)}
				>
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
