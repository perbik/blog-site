"use client";

import { Button } from "@/components/ui/button";

interface BlogErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogError({ reset }: BlogErrorProps) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 py-24 text-white">
			<section className="w-full max-w-xl rounded-[32px] bg-blog-red p-8 text-center sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
					Blog unavailable
				</p>
				<h1 className="mt-4 text-balance font-heading text-5xl font-semibold leading-[0.9] sm:text-6xl">
					The stories took a detour.
				</h1>
				<p className="mx-auto mt-5 max-w-md leading-7 text-white/80">
					We couldn&apos;t load the blog right now. Give it another try.
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
