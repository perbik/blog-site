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
	const isAdminPage = pathname.startsWith("/admin");
	const isLightPage = isPostPage;
	const navLinkClassName = (isActive: boolean) =>
		cn(
			"relative cursor-pointer select-none font-mono text-xs font-semibold tracking-[0.12em] transition-opacity after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform hover:opacity-60",
			isActive ? "after:scale-x-100" : "after:scale-x-0",
		);

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
		<header
			className={cn(
				"site-header-glass fixed inset-x-0 top-0 z-50 flex h-24 items-start justify-center px-5 pt-5 sm:px-7",
				isLightPage && "site-header-light",
			)}
		>
			<div className="relative z-10 w-[min(390px,calc(100vw-40px))]">
				<nav
					className={cn(
						"site-glass-nav site-accent-nav site-frosted-nav flex h-12 items-center justify-center gap-5 rounded-full px-5 transition-all duration-300 ease-out",
						scrolled && "is-scrolled",
						isAdminPage
							? "bg-[rgba(10, 10, 10, 0.356)] text-white backdrop-blur-xl"
							: isLightPage
								? scrolled
									? "border-black/10 text-black"
									: "border-black/10 text-black"
								: scrolled
									? "border-white/25 text-white"
									: "border-white/20 text-white",
					)}
				>
					<Link
						href="/"
						className={navLinkClassName(pathname === "/")}
						aria-current={pathname === "/" ? "page" : undefined}
					>
						HOME
					</Link>
					<Link
						href="/blog"
						className={navLinkClassName(pathname.startsWith("/blog"))}
						aria-current={pathname.startsWith("/blog") ? "page" : undefined}
					>
						BLOGS
					</Link>
					<Link
						href="/admin"
						className={navLinkClassName(isAdminPage)}
						aria-current={isAdminPage ? "page" : undefined}
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
