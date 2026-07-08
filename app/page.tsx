import { LoopingHeadline } from "@/components/home/LoopingHeadline";
import { RecentPostsCarousel } from "@/components/home/RecentPostsCarousel";
import { getRecentPosts } from "@/lib/db/queries";

export default async function Home() {
	const posts = await getRecentPosts(5);

	return (
		<div className="relative min-h-screen overflow-x-hidden p-8 lg:px-14">
			<section className="relative mx-auto max-w-6xl">
				<div className="relative pl-7 sm:pl-10 lg:pr-10">
					<div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 whitespace-nowrap font-heading text-[clamp(3.25rem,10vw,5.5rem)] font-black leading-none tracking-[-0.03em] sm:gap-x-4">
						<span className="relative z-10 bg-background leading-none">[</span>

						<div className="min-w-0 overflow-hidden leading-none">
							<LoopingHeadline />
						</div>

						<span className="relative z-10 bg-background leading-none">]</span>
					</div>

					<p className="mt-5 max-w-4xl font-mono font-medium leading-snug text-black text-2xl lg:text-xl">
						A personal blog for essays, build notes, and open conversations in
						the comments.
					</p>
				</div>
			</section>

			<div className="-mx-8 lg:-mx-14">
				<RecentPostsCarousel posts={posts} />
			</div>
		</div>
	);
}
