import { BlogBentoGrid } from "@/components/blog/BlogBentoGrid";
import { BlogCard } from "@/components/cards/BlogCard";
import {
	getBlogCardHeightClass,
	getCardColorClassForSlug,
} from "@/lib/blog-card-styles";
import {
	getApprovedCommentCounts,
	getPostSummaries,
	getPostTags,
} from "@/lib/db/queries";

interface BlogListDataProps {
	activeTags: string[];
}

export async function BlogListData({ activeTags }: BlogListDataProps) {
	const [posts, commentCounts, tags] = await Promise.all([
		getPostSummaries(activeTags),
		getApprovedCommentCounts(),
		getPostTags(),
	]);
	const commentCountByPostId = new Map(
		commentCounts.map((row) => [row.postId, row.count]),
	);

	const decoratedPosts = posts.map((post) => ({
		...post,
		colorClassName: getCardColorClassForSlug(post.slug),
		commentCount: commentCountByPostId.get(post.id) ?? 0,
	}));
	const cards = decoratedPosts.map((post) => (
		<BlogCard
			key={post.slug}
			title={post.title}
			href={`/blog/${post.slug}`}
			image={post.image}
			tags={post.tags}
			colorClassName={post.colorClassName}
			createdAt={post.createdAt}
			commentCount={post.commentCount}
			heightClassName={getBlogCardHeightClass(post.title)}
		/>
	));

	return (
		<BlogBentoGrid
			posts={decoratedPosts}
			cards={cards}
			tags={tags}
			activeTags={activeTags}
		/>
	);
}
