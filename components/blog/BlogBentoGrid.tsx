import { BlogCard } from "@/components/cards/BlogCard";
import {
	cardColorClasses,
	cardSizeClasses,
	getCardColor,
	hashText,
	imageSizeClasses,
} from "@/lib/blog-card-styles";
import { cn } from "@/lib/utils";

interface BlogListPost {
	title: string;
	slug: string;
	image?: string | null;
}

interface BlogBentoGridProps {
	posts: BlogListPost[];
	activeTag?: string;
}

const listCardPatterns = [
	{
		item: "items-start",
		size: "standard",
		layout: "default",
	},
	{
		item: "items-start pt-2 sm:pt-4",
		size: "wide",
		layout: "default",
	},
	{
		item: "items-start pt-3 sm:pt-5",
		size: "tall",
		layout: "default",
	},
	{
		item: "items-start",
		size: "wide",
		layout: "side-image",
	},
	{
		item: "items-start",
		size: "standard",
		layout: "default",
	},
	{
		item: "items-start pt-2 sm:pt-5",
		size: "wide",
		layout: "default",
	},
	{
		item: "items-start pt-2 sm:pt-4",
		size: "tall",
		layout: "default",
	},
	{
		item: "items-start pt-4 sm:pt-7",
		size: "wide",
		layout: "side-image",
	},
] as const;

export function BlogBentoGrid({ posts, activeTag }: BlogBentoGridProps) {
	const decoratedPosts = (() => {
		let previousColor: keyof typeof cardColorClasses | undefined;

		return posts.map((post, index) => {
			const hash = hashText(post.slug);
			const color = getCardColor(hash, index, previousColor);
			const pattern = listCardPatterns[index % listCardPatterns.length];

			previousColor = color;

			return {
				...post,
				colorClassName: cardColorClasses[color],
				cardClassName: cardSizeClasses[pattern.size],
				imageClassName: imageSizeClasses[pattern.size],
				itemClassName: pattern.item,
				layout: pattern.layout,
			};
		});
	})();

	const rows: (typeof decoratedPosts)[] = [];

	for (let index = 0; index < decoratedPosts.length; index += 2) {
		rows.push(decoratedPosts.slice(index, index + 2));
	}

	if (posts.length === 0) {
		return (
			<div className="mt-12 max-w-xl rounded-[2rem] bg-blog-beige p-6 font-heading text-3xl font-black leading-none text-black sm:text-4xl">
				{activeTag ? `No posts found for ${activeTag}.` : "No posts found."}
			</div>
		);
	}

	return (
		<section data-blog-list aria-label="Blog posts" className="relative">
			<div className="-mt-8 pb-36 pt-10">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 sm:gap-7 sm:px-6 lg:gap-9 lg:px-8">
					{rows.map((rowPosts) => (
						<div
							key={rowPosts.map((post) => post.slug).join("-")}
							className="grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-[minmax(0,23rem)_minmax(0,38rem)] sm:justify-center sm:gap-8 lg:gap-12"
						>
							{rowPosts.map((post) => (
								<div
									key={post.slug}
									className={cn(
										"flex w-full min-w-0 justify-center",
										post.itemClassName,
									)}
								>
									<BlogCard
										title={post.title}
										href={`/blog/${post.slug}`}
										image={post.image}
										layout={post.layout}
										className={cn(
											post.colorClassName,
											post.cardClassName,
											"min-w-0 rounded-[0.95rem] p-2.5 sm:rounded-[1.15rem] sm:p-3.5 [&>div:last-child]:pt-2 sm:[&>div:last-child]:pt-3 [&>div:last-child>span]:size-8 sm:[&>div:last-child>span]:size-10 [&>div:last-child>span]:border-2 [&>div:last-child>span>svg]:size-5 sm:[&>div:last-child>span>svg]:size-6",
										)}
										imageClassName={cn(
											"rounded-[0.65rem] sm:rounded-[0.8rem]",
											post.imageClassName,
											post.layout === "side-image" && "h-full",
										)}
									/>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
