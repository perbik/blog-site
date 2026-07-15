"use client";

import { Search, X } from "lucide-react";
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";

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

const mobileQuery = "(max-width: 639px)";

function subscribeToMobileQuery(callback: () => void) {
	const mediaQuery = window.matchMedia(mobileQuery);
	mediaQuery.addEventListener("change", callback);

	return () => mediaQuery.removeEventListener("change", callback);
}

function getMobileSnapshot() {
	return window.matchMedia(mobileQuery).matches;
}

function BlogGridCard({ post }: { post: BlogListPost }) {
	return (
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
	);
}

export function BlogBentoGrid({
	posts,
	tags,
	activeTags = [],
}: BlogBentoGridProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const isMobile = useSyncExternalStore(
		subscribeToMobileQuery,
		getMobileSnapshot,
		() => false,
	);
	const postsPerPage = isMobile ? 5 : 15;
	const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
	const filteredPosts = useMemo(() => {
		if (!normalizedQuery) return posts;

		return posts.filter((post) =>
			[post.title, post.authorName ?? "", ...post.tags]
				.join(" ")
				.toLocaleLowerCase()
				.includes(normalizedQuery),
		);
	}, [normalizedQuery, posts]);
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));
	const visiblePosts = filteredPosts.slice(
		(visiblePage - 1) * postsPerPage,
		visiblePage * postsPerPage,
	);

	useEffect(() => {
		if (searchOpen) searchInputRef.current?.focus();
	}, [searchOpen]);

	const closeSearch = () => {
		setSearchQuery("");
		setSearchOpen(false);
	};
	const getColumns = (columnCount: number) =>
		["first", "second", "third"]
			.slice(0, columnCount)
			.map((id, columnIndex) => ({
				id,
				posts: visiblePosts.filter(
					(_, index) => index % columnCount === columnIndex,
				),
			}));

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

					<div className="flex flex-wrap items-center gap-3">
						{searchOpen ? (
							<div className="flex h-11 w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-white sm:w-72">
								<Search
									className="size-4 shrink-0 text-white/55"
									aria-hidden="true"
								/>
								<input
									ref={searchInputRef}
									type="search"
									value={searchQuery}
									onChange={(event) => {
										setSearchQuery(event.target.value);
										setCurrentPage(1);
									}}
									onKeyDown={(event) => {
										if (event.key === "Escape") closeSearch();
									}}
									placeholder="Search stories..."
									aria-label="Search blog posts"
									className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-white/40 [&::-webkit-search-cancel-button]:hidden"
								/>
								<button
									type="button"
									onClick={closeSearch}
									aria-label="Close search"
									className="cursor-pointer rounded-full p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
								>
									<X className="size-4" aria-hidden="true" />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => setSearchOpen(true)}
								aria-label="Open blog search"
								className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
							>
								<Search className="size-4" aria-hidden="true" />
							</button>
						)}

						<BlogTagFilter tags={tags} activeTags={activeTags} />
					</div>
				</div>

				{filteredPosts.length > 0 ? (
					<>
						<div className="grid grid-cols-1 gap-[15px] sm:hidden">
							{visiblePosts.map((post) => (
								<BlogGridCard key={post.slug} post={post} />
							))}
						</div>

						<div className="hidden grid-cols-2 items-start gap-[15px] sm:grid lg:hidden">
							{getColumns(2).map((column) => (
								<div
									key={`tablet-${column.id}`}
									className="flex flex-col gap-[15px]"
								>
									{column.posts.map((post) => (
										<BlogGridCard key={post.slug} post={post} />
									))}
								</div>
							))}
						</div>

						<div className="hidden grid-cols-3 items-start gap-[15px] lg:grid">
							{getColumns(3).map((column) => (
								<div
									key={`desktop-${column.id}`}
									className="flex flex-col gap-[15px]"
								>
									{column.posts.map((post) => (
										<BlogGridCard key={post.slug} post={post} />
									))}
								</div>
							))}
						</div>
					</>
				) : (
					<div className="rounded-[40px] bg-[#F8E8CE] p-8 font-heading text-3xl font-bold leading-tight text-black">
						{normalizedQuery
							? `No posts match “${searchQuery.trim()}”${activeTags.length > 0 ? ` within ${activeTags.join(", ")}` : ""}.`
							: activeTags.length > 0
								? `No posts found for ${activeTags.join(", ")}.`
								: "No posts found."}
					</div>
				)}

				<PaginationNav
					currentPage={visiblePage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					className="mt-10 text-white"
				/>
			</div>
		</section>
	);
}
