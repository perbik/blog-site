"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { reset: () => void }) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-24 text-black">
			<section className="w-full max-w-xl rounded-[32px] bg-blog-yellow p-8 text-center sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
					Admin unavailable
				</p>
				<h1 className="mt-4 font-heading text-5xl font-semibold leading-[0.9]">
					The dashboard couldn&apos;t load.
				</h1>
				<p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/60">
					Please try the request again.
				</p>
				<Button
					type="button"
					onClick={reset}
					className="mt-7 h-11 rounded-full bg-black px-6 text-white hover:bg-black/75"
				>
					Try again
				</Button>
			</section>
		</main>
	);
}
