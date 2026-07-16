"use client";

import { Button } from "@/components/ui/button";

interface BlogPostErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogPostError({ reset }: BlogPostErrorProps) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-24 text-black">
			<section className="w-full max-w-xl rounded-[32px] bg-blog-purple p-8 text-center sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
					Post unavailable
				</p>
				<h1 className="mt-4 text-balance font-heading text-5xl font-semibold leading-[0.9] sm:text-6xl">
					This story went offline.
				</h1>
				<p className="mx-auto mt-5 max-w-md leading-7 text-black/65">
					We couldn't load this post right now. Please try it again.
				</p>
				<Button
					type="button"
					onClick={reset}
					className="mt-7 h-12 rounded-full bg-black px-5 text-white hover:bg-black/85"
				>
					Try again
				</Button>
			</section>
		</main>
	);
}
