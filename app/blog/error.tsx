"use client";

import { Button } from "@/components/ui/button";

interface BlogErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogError({ error, reset }: BlogErrorProps) {
	return (
		<div className="flex min-h-screen items-center px-5 py-20 sm:px-8 md:px-10 lg:px-14">
			<section className="max-w-2xl rounded-[2rem] bg-blog-red p-7 text-white sm:p-10">
				<p className="font-heading text-sm font-black uppercase leading-none text-white/80">
					Blog unavailable
				</p>
				<h1 className="mt-3 text-balance font-heading text-5xl font-black leading-[0.9] tracking-normal sm:text-6xl">
					The posts could not load.
				</h1>
				<p className="mt-5 max-w-xl text-base leading-7 text-white/85">
					{error.message || "Something went wrong while loading the blog."}
				</p>
				<Button
					type="button"
					onClick={reset}
					className="mt-7 h-12 rounded-full bg-black px-5 text-white hover:bg-black/85"
				>
					Try again
				</Button>
			</section>
		</div>
	);
}
