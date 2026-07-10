import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CommentCard } from "@/components/cards/CommentCard";
import { CommentForm } from "@/components/comments/CommentForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
	getCardColorClassForSlug,
	getCardColorNameForSlug,
} from "@/lib/blog-card-styles";
import { getPosts, getPostWithCommentsBySlug } from "@/lib/db/queries";
import BlogPostLoading from "./loading";

interface BlogPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

const postDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

function getPostParagraphs(body: string) {
	return body
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostWithCommentsBySlug(slug);

	if (!post) {
		return {
			title: "Post not found",
		};
	}

	return {
		title: post.title,
		description: post.body.slice(0, 150),
	};
}

async function BlogPostContent({ slug }: { slug: string }) {
	const [post, posts] = await Promise.all([
		getPostWithCommentsBySlug(slug),
		getPosts(),
	]);

	if (!post) {
		notFound();
	}

	const accentClassName = getCardColorClassForSlug(posts, post.slug);
	const accentName = getCardColorNameForSlug(posts, post.slug);
	const paragraphs = getPostParagraphs(post.body);
	const commentCount = post.comments.length;
	return (
		<div
			data-post-accent={accentName}
			className="flex min-h-screen flex-col bg-[#f5f5f5] text-black"
		>
			<div
				className="relative mt-0 h-[clamp(220px,38vw,400px)] w-full overflow-hidden bg-gradient-to-br from-[#C389BA] via-[#699DF4] to-[#F5B22D]"
				aria-hidden="true"
			>
				{post.image ? (
					<Image
						src={post.image}
						alt=""
						fill
						priority
						sizes="100vw"
						className="object-cover object-center"
					/>
				) : null}
			</div>

			<div className="mx-auto w-full max-w-4xl flex-1 px-6 pb-20 pt-10">
				<Link
					href="/blog"
					className="mb-8 inline-flex items-center gap-2 font-heading text-2xl font-medium leading-none transition-opacity hover:opacity-60"
				>
					<ArrowLeft className="size-7" strokeWidth={2.2} aria-hidden="true" />
					<span>BACK</span>
				</Link>

				<article>
					<header>
						<div className="mb-4 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<Link
									key={tag}
									href={`/blog?tag=${encodeURIComponent(tag)}`}
									className="rounded-full border border-black/30 px-3 py-1 font-mono text-xs leading-none transition-colors hover:bg-black hover:text-white"
								>
									{tag}
								</Link>
							))}
						</div>

						<h1 className="mb-3 font-heading text-[clamp(48px,8vw,100px)] font-bold leading-none text-black">
							{post.title}
						</h1>

						<time
							className="mb-10 block font-mono text-sm text-black/50"
							dateTime={post.createdAt.toISOString()}
						>
							{postDateFormatter.format(post.createdAt)}
						</time>
					</header>

					<div className="mb-10 border-t border-black/10" />

					<div className="mb-16 space-y-8 font-mono text-lg leading-[1.8] text-black">
						{paragraphs.map((paragraph) => (
							<p key={paragraph} className="text-justify">
								{paragraph}
							</p>
						))}
					</div>
				</article>

				<section className="mb-8">
					<h2 className="mb-6 font-heading text-3xl font-medium leading-none">
						{commentCount} {commentCount === 1 ? "Comment" : "Comments"}
					</h2>

					<div className="mb-10 flex flex-col gap-4">
						{post.comments.length > 0 ? (
							post.comments.map((comment) => (
								<CommentCard
									key={comment.id}
									authorName={comment.authorName}
									body={comment.body}
									createdAt={comment.createdAt}
								/>
							))
						) : (
							<p className="font-mono text-sm text-black/40">
								No comments yet. Be the first!
							</p>
						)}
					</div>
				</section>

				<section>
					<h2 className="mb-6 text-center font-heading text-3xl font-medium leading-none">
						Leave a comment
					</h2>
					<CommentForm slug={post.slug} accentClassName={accentClassName} />
				</section>
			</div>

			<SiteFooter />
		</div>
	);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<Suspense key={slug} fallback={<BlogPostLoading />}>
			<BlogPostContent slug={slug} />
		</Suspense>
	);
}
