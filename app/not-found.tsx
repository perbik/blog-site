import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 py-24 text-white">
			<section className="w-full max-w-xl rounded-[32px] bg-blog-blue p-8 text-center text-black sm:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
					404 · Page not found
				</p>
				<h1 className="mt-4 text-balance font-heading text-5xl font-semibold leading-[0.9] sm:text-6xl">
					Nothing lives here yet.
				</h1>
				<p className="mx-auto mt-5 max-w-md leading-7 text-black/65">
					The page may have moved, or the address might be incorrect.
				</p>
				<div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Link
						href="/"
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 sm:w-auto"
					>
						<ArrowLeft className="size-4" aria-hidden="true" />
						Back home
					</Link>
					<Link
						href="/blog"
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-black px-5 text-sm font-medium text-black transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 sm:w-auto"
					>
						<BookOpen className="size-4" aria-hidden="true" />
						Browse stories
					</Link>
				</div>
			</section>
		</main>
	);
}
