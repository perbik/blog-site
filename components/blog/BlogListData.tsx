import { BlogBentoGrid } from "@/components/blog/BlogBentoGrid";
import { BlogCard } from "@/components/cards/BlogCard";
import {
	getBlogCardHeightClass,
	getCardColorClassForIndex,
} from "@/lib/blog-card-styles";
import {
	getApprovedCommentCounts,
	getPostColorOrder,
	getPostSummaries,
	getPostTags,
} from "@/lib/db/queries";

interface BlogListDataProps {
	activeTags: string[];
}

export async function BlogListData({ activeTags }: BlogListDataProps) {
	const [posts, commentCounts, tags, colorOrder] = await Promise.all([
		getPostSummaries(activeTags),
		getApprovedCommentCounts(),
		getPostTags(),
		getPostColorOrder(),
	]);
	const colorIndexBySlug = new Map(
		colorOrder.map((slug, index) => [slug, index]),
	);
	const commentCountByPostId = new Map(
		commentCounts.map((row) => [row.postId, row.count]),
	);

	const decoratedPosts = posts.map((post) => ({
		...post,
		colorClassName: getCardColorClassForIndex(
			colorIndexBySlug.get(post.slug) ?? 0,
		),
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
