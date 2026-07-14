import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogCardProps {
	title: string;
	href: string;
	image?: string | null;
	tags?: string[];
	authorName?: string | null;
	createdAt?: Date;
	colorClassName?: string;
	heightClassName?: string;
	className?: string;
}

export function BlogCard({
	title,
	href,
	image,
	tags = [],
	colorClassName = "bg-[#F5B22D]",
	heightClassName = "min-h-[380px]",
	className,
}: BlogCardProps) {
	const visibleTags = tags.slice(0, 2);
	const hiddenTagCount = Math.max(tags.length - visibleTags.length, 0);

	return (
		<Link
			href={href}
			className={cn(
				"group relative flex w-full flex-col rounded-[40px] p-5 text-black transition-transform hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35 sm:p-6",
				heightClassName,
				colorClassName,
				className,
			)}
		>
			{image ? (
				<div className="relative mb-5 h-40 w-full shrink-0 overflow-hidden rounded-[24px] bg-black/10 sm:h-44">
					<Image
						src={image}
						alt=""
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover brightness-105 saturate-90 transition-transform duration-500 ease-out group-hover:scale-105"
					/>
				</div>
			) : null}

			<h2 className="py-3 font-heading text-5xl font-semibold tracking-[-0.055em] lg:py-2 lg:text-4xl">
				<span
					className={cn("leading-[1.05]", title.length > 50 && "line-clamp-3")}
				>
					{title}
				</span>
			</h2>

			<div className="mt-auto flex shrink-0 items-end justify-between pt-4">
				{tags.length > 0 ? (
					<div className="flex shrink-0 flex-wrap items-end gap-1">
						{visibleTags.map((tag) => (
							<Badge
								key={tag}
								variant="outline"
								className="h-auto rounded-full border-black bg-transparent px-4 py-1.5 font-mono text-lg font-medium leading-none tracking-tight text-black"
							>
								{tag}
							</Badge>
						))}
						{hiddenTagCount > 0 ? (
							<Badge
								variant="outline"
								className="h-auto rounded-full border-black bg-black px-4 py-1.5 font-mono text-sm font-medium leading-none tracking-tight text-white"
							>
								+{hiddenTagCount}
							</Badge>
						) : null}
					</div>
				) : null}
				<span className="flex size-14 items-center justify-center rounded-full border-[3px] border-black transition-transform duration-200 group-hover:rotate-45 sm:size-15">
					<ArrowUpRight
						className="size-7 stroke-[2.6] sm:size-8"
						aria-hidden="true"
					/>
					<span className="sr-only">Read {title}</span>
				</span>
			</div>
		</Link>
	);
}
