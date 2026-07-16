import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPostNotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-24 text-black">
			<section className="w-full max-w-xl rounded-[32px] bg-blog-yellow p-8 text-center sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
					Post not found
				</p>
				<h1 className="mt-4 text-balance font-heading text-5xl font-semibold leading-[0.9] sm:text-6xl">
					This story isn't here.
				</h1>
				<p className="mx-auto mt-5 max-w-md leading-7 text-black/65">
					It may have been removed, or the address might be incorrect.
				</p>
				<Link
					href="/blog"
					className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					Back to all stories
				</Link>
			</section>
		</main>
	);
}
