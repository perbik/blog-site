"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholders";

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
	const cursorRef = useRef<HTMLDivElement>(null);
	const touchStartX = useRef<number | null>(null);
	const didSwipe = useRef(false);
	const reduceMotion = useReducedMotion();

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
			onTouchStart={(event) => {
				touchStartX.current = event.touches[0]?.clientX ?? null;
				didSwipe.current = false;
			}}
			onTouchEnd={(event) => {
				if (touchStartX.current === null) return;

				const distance = event.changedTouches[0].clientX - touchStartX.current;
				touchStartX.current = null;

				if (Math.abs(distance) < 50) return;

				didSwipe.current = true;
				if (distance > 0) goToPrevious();
				else goToNext();
			}}
			onPointerMove={(event) => {
				if (event.pointerType !== "mouse") {
					return;
				}

				const bounds = event.currentTarget.getBoundingClientRect();

				if (cursorRef.current) {
					cursorRef.current.style.transform = `translate3d(${event.clientX - bounds.left + 22}px, ${event.clientY - bounds.top - 18}px, 0)`;
					cursorRef.current.style.opacity = "1";
				}
			}}
			onPointerEnter={(event) => {
				if (event.pointerType !== "mouse") {
					return;
				}

				if (cursorRef.current) cursorRef.current.style.opacity = "1";
			}}
			onPointerLeave={() => {
				if (cursorRef.current) cursorRef.current.style.opacity = "0";
			}}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={activePost.slug}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
					className="absolute inset-0"
				>
					<Image
						src={activePost.image ?? ""}
						alt={activePost.title}
						fill
						priority={activeIndex === 0}
						placeholder="blur"
						blurDataURL={IMAGE_BLUR_DATA_URL}
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
				onClick={(event) => {
					if (didSwipe.current) {
						event.preventDefault();
						didSwipe.current = false;
					}
				}}
			/>

			<div className="absolute left-3 top-1/2 z-30 -translate-y-1/2 sm:left-5">
				<button
					type="button"
					onClick={goToPrevious}
					onPointerEnter={() => {
						if (cursorRef.current) cursorRef.current.style.opacity = "0";
					}}
					aria-label="Previous slide"
					className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/35 font-mono text-sm font-bold uppercase backdrop-blur transition hover:bg-black/50 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
				>
					<ChevronLeft className="size-4" />
					<span className="hidden sm:inline">Prev</span>
				</button>
			</div>

			<div className="absolute right-3 top-1/2 z-30 -translate-y-1/2 sm:right-5">
				<button
					type="button"
					onClick={goToNext}
					onPointerEnter={() => {
						if (cursorRef.current) cursorRef.current.style.opacity = "0";
					}}
					aria-label="Next slide"
					className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/35 font-mono text-sm font-bold uppercase backdrop-blur transition hover:bg-black/50 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
				>
					<span className="hidden sm:inline">Next</span>
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
						transition={{ duration: reduceMotion ? 0 : 0.45 }}
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

			<div
				ref={cursorRef}
				className="pointer-events-none absolute left-0 top-0 z-50 hidden rounded-full bg-white px-4 py-1.5 font-mono text-sm font-bold uppercase leading-none text-black opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-opacity sm:block"
			>
				Read now
			</div>

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
