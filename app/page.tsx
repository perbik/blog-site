import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogHeroCarousel } from "@/components/blog/BlogHeroCarousel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/lib/db/queries";

export const metadata: Metadata = {
	title: "echo",
	description:
		"A personal blog for creators, social media marketers, and the creator economy.",
};

async function HomeHero() {
	const posts = await getPosts();

	return <BlogHeroCarousel posts={posts} />;
}

function HomeHeroSkeleton() {
	return (
		<section className="relative h-svh min-h-152 overflow-hidden bg-black">
			<Skeleton className="absolute inset-0 rounded-none bg-white/8" />
			<div className="absolute inset-x-5 bottom-24 flex flex-col items-center sm:bottom-20">
				<Skeleton className="mb-4 h-3 w-28 rounded-full bg-white/15" />
				<Skeleton className="h-14 w-full max-w-3xl rounded-2xl bg-white/15 sm:h-20" />
				<Skeleton className="mt-4 h-14 w-3/5 max-w-xl rounded-2xl bg-white/15 sm:h-20" />
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			<Suspense fallback={<HomeHeroSkeleton />}>
				<HomeHero />
			</Suspense>
			<SiteFooter dark />
		</div>
	);
}
