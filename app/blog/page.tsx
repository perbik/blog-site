import type { Metadata } from "next";
import { BlogBentoGrid } from "@/components/blog/BlogBentoGrid";
import { getPosts } from "@/lib/db/queries";

export const metadata: Metadata = {
	title: "Blogs",
	description: "Browse blog posts by topic.",
};

interface BlogPageProps {
	searchParams?: Promise<{
		tag?: string | string[];
	}>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const params = await searchParams;
	const tag = Array.isArray(params?.tag) ? params.tag[0] : params?.tag;
	const posts = await getPosts(tag);

	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<BlogBentoGrid key={tag ?? "all"} posts={posts} activeTag={tag} />
		</div>
	);
}
