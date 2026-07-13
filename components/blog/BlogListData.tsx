import { BlogBentoGrid } from "@/components/blog/BlogBentoGrid";
import { getCardColorClassForSlug } from "@/lib/blog-card-styles";
import { getPosts, getPostTags } from "@/lib/db/queries";

interface BlogListDataProps {
	activeTags: string[];
}

export async function BlogListData({ activeTags }: BlogListDataProps) {
	const [posts, allPosts, tags] = await Promise.all([
		getPosts(activeTags),
		getPosts(),
		getPostTags(),
	]);

	const decoratedPosts = posts.map((post) => ({
		...post,
		colorClassName: getCardColorClassForSlug(allPosts, post.slug),
	}));

	return (
		<BlogBentoGrid posts={decoratedPosts} tags={tags} activeTags={activeTags} />
	);
}
