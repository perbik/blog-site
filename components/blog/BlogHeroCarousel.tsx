"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface BlogHeroPost {
	title: string;
	slug: string;
	image?: string | null;
	authorName?: string | null;
}

interface BlogHeroCarouselProps {
	posts: BlogHeroPost[];
}

export function BlogHeroCarousel({ posts }: BlogHeroCarouselProps) {
	const slides = useMemo(
		() => posts.filter((post) => Boolean(post.image)).slice(0, 5),
		[posts],
	);

	const [activeIndex, setActiveIndex] = useState(0);
	const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
	const [controlsHovered, setControlsHovered] = useState(false);

	if (slides.length === 0) return null;

	const activePost = slides[activeIndex];

	const goToPrevious = () => {
		setActiveIndex((current) =>
			current === 0 ? slides.length - 1 : current - 1,
		);
	};

	const goToNext = () => {
		setActiveIndex((current) => (current + 1) % slides.length);
	};

	return (
		<section
			className="relative h-svh min-h-152 overflow-hidden bg-black text-white"
			onPointerMove={(event) => {
				if (event.pointerType !== "mouse") {
					return;
				}

				const bounds = event.currentTarget.getBoundingClientRect();

				setCursor({
					x: event.clientX - bounds.left,
					y: event.clientY - bounds.top,
					visible: !controlsHovered,
				});
			}}
			onPointerEnter={(event) => {
				if (event.pointerType !== "mouse") {
					return;
				}

				setCursor((current) => ({ ...current, visible: true }));
			}}
			onPointerLeave={() =>
				setCursor((current) => ({ ...current, visible: false }))
			}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={activePost.slug}
					initial={{ opacity: 0, scale: 1.04 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1.02 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className="absolute inset-0"
				>
					<Image
						src={activePost.image ?? ""}
						alt={activePost.title}
						fill
						priority={activeIndex === 0}
						sizes="100vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/10 to-black/65" />
				</motion.div>
			</AnimatePresence>

			<Link
				href={`/blog/${activePost.slug}`}
				className="absolute inset-0 z-10"
				aria-label={`Read ${activePost.title}`}
			/>

			<div className="absolute left-5 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
				<button
					type="button"
					onClick={goToPrevious}
					onPointerEnter={() => {
						setControlsHovered(true);
						setCursor((current) => ({ ...current, visible: false }));
					}}
					onPointerLeave={() => setControlsHovered(false)}
					className="flex cursor-pointer items-center gap-2 rounded-full bg-black/25 px-4 py-3 font-mono text-sm font-bold uppercase backdrop-blur transition hover:bg-black/40"
				>
					<ChevronLeft className="size-4" />
					Prev
				</button>
			</div>

			<div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
				<button
					type="button"
					onClick={goToNext}
					onPointerEnter={() => {
						setControlsHovered(true);
						setCursor((current) => ({ ...current, visible: false }));
					}}
					onPointerLeave={() => setControlsHovered(false)}
					className="flex cursor-pointer items-center gap-2 rounded-full bg-black/25 px-4 py-3 font-mono text-sm font-bold uppercase backdrop-blur transition hover:bg-black/40"
				>
					Next
					<ChevronRight className="size-4" />
				</button>
			</div>

			<div className="relative z-20 flex h-full pointer-events-none flex-col items-center justify-end px-5 pb-24 text-center sm:pb-20">
				<AnimatePresence mode="wait">
					<motion.div
						key={activePost.slug}
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -18 }}
						transition={{ duration: 0.45 }}
					>
						<p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
							Recent blog
						</p>
						<h1 className="max-w-5xl font-heading text-5xl font-semibold leading-[0.86] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
							{activePost.title}
						</h1>

						{activePost.authorName ? (
							<p className="mt-5 font-mono text-sm font-bold uppercase sm:text-base">
								{activePost.authorName}
							</p>
						) : null}
					</motion.div>
				</AnimatePresence>
			</div>

			<motion.div
				className="pointer-events-none absolute left-0 top-0 z-50 hidden rounded-full bg-white px-4 py-1.5 font-mono text-sm font-bold uppercase leading-none text-black shadow-[0_10px_28px_rgba(0,0,0,0.28)] sm:block"
				animate={{
					x: cursor.x + 22,
					y: cursor.y - 18,
					opacity: cursor.visible && !controlsHovered ? 1 : 0,
					scale: cursor.visible && !controlsHovered ? 1 : 0.96,
				}}
				transition={{ type: "spring", stiffness: 520, damping: 36 }}
			>
				Read now
			</motion.div>

			<div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
				{slides.map((post, index) => (
					<button
						key={post.slug}
						type="button"
						aria-label={`Go to ${post.title}`}
						onClick={() => setActiveIndex(index)}
						className="size-2 cursor-pointer rounded-full border border-white/70"
					>
						<span
							className={
								index === activeIndex
									? "block size-full rounded-full bg-white"
									: "block size-full rounded-full bg-white/20"
							}
						/>
					</button>
				))}
			</div>
		</section>
	);
}
