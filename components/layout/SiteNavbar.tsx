"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function SiteNavbar() {
	const [scrolled, setScrolled] = useState(false);
	const [progress, setProgress] = useState(0);
	const pathname = usePathname();
	const isPostPage = pathname.startsWith("/blog/") && pathname !== "/blog";

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 30);

			const scrollableHeight =
				document.documentElement.scrollHeight - window.innerHeight;

			setProgress(
				scrollableHeight > 0
					? Math.min(window.scrollY / scrollableHeight, 1)
					: 0,
			);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<header className="site-header-glass fixed inset-x-0 top-0 z-50 flex h-24 items-start justify-center px-5 pt-5 sm:px-7">
			<div className="relative z-10 w-[min(390px,calc(100vw-40px))]">
				<nav
					className={cn(
						"site-glass-nav site-accent-nav flex h-12 items-center justify-center gap-5 rounded-full border px-5 shadow-[0_4px_32px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out",
						scrolled && "is-scrolled",
						isPostPage
							? scrolled
								? "border-black/10 bg-white/90 text-black"
								: "border-black/10 bg-white/80 text-black"
							: scrolled
								? "border-white/15 bg-white/10 text-white"
								: "border-white/12 bg-white/5 text-white",
					)}
				>
					<Link
						href="/blog"
						className="select-none font-mono text-xs font-semibold tracking-[0.12em] transition-opacity hover:opacity-60"
					>
						BLOGS
					</Link>
					<Link
						href="/"
						className="select-none font-heading text-lg font-bold lowercase tracking-tighter transition-transform hover:scale-105"
					>
						echo
					</Link>
					<Link
						href="/admin"
						className="select-none font-mono text-xs font-semibold tracking-[0.12em] transition-opacity hover:opacity-60"
					>
						ADMIN
					</Link>
				</nav>

				{isPostPage ? (
					<progress
						className="site-scroll-progress mx-auto mt-2 block h-1 w-[95%] overflow-hidden rounded-full"
						value={progress}
						max={1}
						aria-label="Reading progress"
					/>
				) : null}
			</div>
		</header>
	);
}
