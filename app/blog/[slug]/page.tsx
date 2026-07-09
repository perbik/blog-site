import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostNavbar } from "@/components/blog/BlogPostNavbar";
import { CommentCard } from "@/components/cards/CommentCard";
import { CommentForm } from "@/components/comments/CommentForm";
import { LoopingHeadline } from "@/components/home/LoopingHeadline";
import { getBlogCardColorClassForSlug } from "@/lib/blog-card-styles";
import { getPosts, getPostWithCommentsBySlug } from "@/lib/db/queries";

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const [post, posts] = await Promise.all([
		getPostWithCommentsBySlug(slug),
		getPosts(),
	]);

	if (!post) {
		notFound();
	}

	const paragraphs = getPostParagraphs(post.body);
	const commentCount = post.comments.length;
	const postColorClassName = getBlogCardColorClassForSlug(posts, post.slug);
	const heroBackground = post.image
		? { backgroundImage: `url(${post.image})` }
		: {
				backgroundImage:
					"linear-gradient(145deg, #ffc25f 0%, #f6d4db 27%, #ca54d8 55%, #7110cb 100%)",
			};

	return (
		<div className="min-h-screen bg-comment px-5 pb-10 pt-6 text-black sm:px-8 lg:px-12 lg:pb-14">
			<div className="mx-auto flex w-full max-w-6xl flex-col">
				<BlogPostNavbar colorClassName={postColorClassName} />

				<Link
					href="/blog"
					className="mb-8 inline-flex w-fit items-center gap-2 font-heading text-2xl font-black uppercase leading-none tracking-normal transition-opacity hover:opacity-70 sm:text-3xl"
				>
					<span aria-hidden="true">{"<-"}</span>
					<span>Back</span>
				</Link>

				<article>
					<div
						className="h-52 w-full rounded-[2rem] bg-cover bg-center sm:h-72 sm:rounded-[2.4rem] lg:h-80"
						style={heroBackground}
						aria-hidden="true"
					/>

					<header className="-mt-1 sm:-mt-2">
						<h1 className="max-w-5xl font-heading text-[clamp(4.5rem,12vw,7.5rem)] font-black leading-[0.78] tracking-normal text-black">
							{post.title}
						</h1>

						<div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 pl-1">
							{post.tags.map((tag) => (
								<Link
									key={tag}
									href={`/blog?tag=${encodeURIComponent(tag)}`}
									className="rounded-full border border-black bg-comment px-2 py-1 font-mono text-[0.65rem] font-medium leading-none text-black transition-colors hover:bg-black hover:text-white"
								>
									{tag}
								</Link>
							))}
						</div>

						<time
							className="mt-2 block pl-1 font-mono text-sm font-medium leading-none text-black/75"
							dateTime={post.createdAt.toISOString()}
						>
							{postDateFormatter.format(post.createdAt)}
						</time>
					</header>

					<div className="mx-auto mt-7 max-w-2xl space-y-8 font-mono text-base font-medium leading-[1.85] text-black sm:mt-8 sm:text-lg">
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				</article>

				<section className="mx-auto mt-11 w-full max-w-4xl border-t border-black/10 pt-10">
					<h2 className="font-heading text-3xl font-black leading-none sm:text-4xl">
						{commentCount} {commentCount === 1 ? "Comment" : "Comments"}
					</h2>

					<div className="mx-auto mt-7 flex max-w-3xl flex-col gap-5">
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
							<p className="font-mono text-base font-medium text-black/70">
								No comments yet.
							</p>
						)}
					</div>
				</section>

				<section className="mx-auto mt-11 flex w-full max-w-3xl flex-col items-center">
					<h2 className="mb-7 text-center font-heading text-3xl font-black leading-none sm:text-4xl">
						Leave a comment
					</h2>
					<CommentForm slug={post.slug} colorClassName={postColorClassName} />
				</section>

				<footer className="mx-auto mt-44 w-full max-w-5xl pb-4">
					<div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-normal">
						<span className="bg-comment leading-none">[</span>
						<div className="min-w-0 overflow-hidden text-center leading-none">
							<LoopingHeadline />
						</div>
						<span className="bg-comment leading-none">]</span>
					</div>

					<div className="mt-7 flex flex-col items-center text-center">
						<div className="size-16 bg-black" aria-hidden="true" />
						<p className="mt-5 font-heading text-5xl font-black leading-none">
							blog
						</p>
						<p className="mt-3 max-w-xs font-mono text-base font-medium leading-snug">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
							efficitur.
						</p>
						<div className="mt-7 flex gap-8" aria-hidden="true">
							<span className="size-10 rounded-full bg-black" />
							<span className="size-10 rounded-full bg-black" />
							<span className="size-10 rounded-full bg-black" />
							<span className="size-10 rounded-full bg-black" />
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
