"use client";

import { Button } from "@/components/ui/button";

interface HomeErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function HomeError({ reset }: HomeErrorProps) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 py-24 text-white">
			<section className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/6 p-8 text-center backdrop-blur-xl sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
					Something went wrong
				</p>
				<h1 className="mt-4 font-heading text-5xl font-semibold leading-[0.9] sm:text-6xl">
					echo hit a quiet patch.
				</h1>
				<p className="mx-auto mt-5 max-w-md leading-7 text-white/60">
					We couldn't load this page right now. Please try again in a moment.
				</p>
				<Button
					type="button"
					onClick={reset}
					className="mt-8 h-11 rounded-full bg-white px-6 text-black hover:bg-white/80"
				>
					Try again
				</Button>
			</section>
		</main>
	);
}
