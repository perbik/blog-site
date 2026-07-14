"use client";

import { useState } from "react";

import { BlogTagFilter } from "@/components/blog/BlogTagFilter";
import { BlogCard } from "@/components/cards/BlogCard";
import { PaginationNav } from "@/components/layout/PaginationNav";
import { getBlogCardHeightClass } from "@/lib/blog-card-styles";

interface BlogListPost {
	title: string;
	slug: string;
	image?: string | null;
	tags: string[];
	colorClassName: string;
	authorName?: string | null;
	createdAt: Date;
}

interface BlogBentoGridProps {
	posts: BlogListPost[];
	tags: string[];
	activeTags?: string[];
}

export function BlogBentoGrid({
	posts,
	tags,
	activeTags = [],
}: BlogBentoGridProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 15;
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const visiblePosts = posts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<section className="min-h-screen bg-[#0a0a0a]" aria-label="Blog posts">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-20 pt-[100px] sm:px-6">
				<div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white/40">
							{activeTags.length > 0 ? "Filtered posts" : "Latest posts"}
						</p>
						<h1 className="font-heading text-6xl font-semibold leading-[0.84] tracking-[-0.07em] text-white sm:text-8xl">
							All stories
						</h1>
					</div>

					<BlogTagFilter tags={tags} activeTags={activeTags} />
				</div>

				{posts.length > 0 ? (
					<div className="columns-1 gap-[15px] sm:columns-2 lg:columns-3">
						{visiblePosts.map((post) => (
							<div
								key={post.slug}
								className="mb-[15px] break-inside-avoid-column"
							>
								<BlogCard
									title={post.title}
									href={`/blog/${post.slug}`}
									image={post.image}
									tags={post.tags}
									colorClassName={post.colorClassName}
									authorName={post.authorName}
									createdAt={post.createdAt}
									heightClassName={getBlogCardHeightClass(post.title)}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="rounded-[40px] bg-[#F8E8CE] p-8 font-heading text-3xl font-bold leading-tight text-black">
						{activeTags.length > 0
							? `No posts found for ${activeTags.join(", ")}.`
							: "No posts found."}
					</div>
				)}

				<PaginationNav
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					className="mt-10 text-white"
				/>
			</div>
		</section>
	);
}
