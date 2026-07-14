import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogListData } from "@/components/blog/BlogListData";
import BlogLoading from "@/components/blog/BlogListLoading";
import { SiteFooter } from "@/components/layout/SiteFooter";

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
	const activeTags = Array.from(
		new Set(
			(Array.isArray(params?.tag) ? params.tag : [params?.tag])
				.filter((tag): tag is string => Boolean(tag))
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
	);

	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			<Suspense key={activeTags.join("|") || "all"} fallback={<BlogLoading />}>
				<BlogListData activeTags={activeTags} />
			</Suspense>

			<SiteFooter dark />
		</div>
	);
}
