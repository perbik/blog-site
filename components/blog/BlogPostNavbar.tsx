"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface BlogPostNavbarProps {
	colorClassName: string;
}

export function BlogPostNavbar({ colorClassName }: BlogPostNavbarProps) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		function updateProgress() {
			const scrollableHeight =
				document.documentElement.scrollHeight - window.innerHeight;

			if (scrollableHeight <= 0) {
				setProgress(0);
				return;
			}

			setProgress(Math.min(window.scrollY / scrollableHeight, 1));
		}

		updateProgress();
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress);

		return () => {
			window.removeEventListener("scroll", updateProgress);
			window.removeEventListener("resize", updateProgress);
		};
	}, []);

	return (
		<nav
			aria-label="Blog post navigation"
			className="sticky top-4 z-30 mx-auto mb-8 w-full max-w-[27rem]"
		>
			<div
				className={cn(
					"grid h-12 grid-cols-[1fr_auto_1fr] items-center rounded-full px-6 text-white shadow-[0_0.55rem_1.2rem_rgba(0,0,0,0.14)] sm:h-14 sm:px-9",
					colorClassName,
				)}
			>
				<Link
					href="/blog"
					className="font-heading text-xl font-black uppercase leading-none transition-opacity hover:opacity-75 sm:text-2xl"
				>
					Blogs
				</Link>

				<span
					className="size-9 rounded-full bg-comment shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] sm:size-10"
					aria-hidden="true"
				/>

				<Link
					href="/admin"
					className="justify-self-end font-heading text-xl font-black uppercase leading-none transition-opacity hover:opacity-75 sm:text-2xl"
				>
					Admin
				</Link>
			</div>

			<div className="mx-auto mt-1 h-1 w-[94%] overflow-hidden rounded-full bg-transparent">
				<div
					className={cn(
						"h-full origin-left rounded-full transition-transform duration-150 ease-out",
						colorClassName,
					)}
					style={{ transform: `scaleX(${progress})` }}
				/>
			</div>
		</nav>
	);
}
