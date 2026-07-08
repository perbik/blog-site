"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BlogCard } from "@/components/cards/BlogCard";
import {
	cardColorClasses,
	cardSizeClasses,
	getCardColor,
	hashText,
	imageSizeClasses,
} from "@/lib/blog-card-styles";

interface RecentPost {
	title: string;
	slug: string;
	image?: string | null;
}

interface RecentPostsCarouselProps {
	posts: RecentPost[];
}

const homeCardSizes = ["standard", "wide", "standard"] as const;

const IDLE_SPEED = 0.28;
const WHEEL_FORCE = 0.1;
const MAX_WHEEL_VELOCITY = 28;
const VELOCITY_DECAY = 0.92;
const FRAME_DURATION = 16.67;

export function RecentPostsCarousel({ posts }: RecentPostsCarouselProps) {
	const x = useMotionValue(0);
	const firstSetRef = useRef<HTMLDivElement>(null);
	const targetXRef = useRef(0);
	const velocityRef = useRef(0);
	const idleDirectionRef = useRef(-1);
	const [setWidth, setSetWidth] = useState(0);

	const decoratedPosts = useMemo(() => {
		let previousColor: keyof typeof cardColorClasses | undefined;

		return posts.map((post, index) => {
			const hash = hashText(post.slug);
			const color = getCardColor(hash, index, previousColor);
			const size = homeCardSizes[index % homeCardSizes.length];

			previousColor = color;

			return {
				...post,
				colorClassName: cardColorClasses[color],
				sizeClassName: cardSizeClasses[size],
				imageClassName: imageSizeClasses[size],
				layout: (size === "wide" ? "side-image" : "default") as
					| "side-image"
					| "default",
			};
		});
	}, [posts]);

	useEffect(() => {
		const setElement = firstSetRef.current;

		if (!setElement) return;

		const updateWidth = () => {
			const width = setElement.scrollWidth;

			setSetWidth(width);
			targetXRef.current = -width;
			x.set(-width);
		};

		updateWidth();

		const observer = new ResizeObserver(updateWidth);
		observer.observe(setElement);

		return () => observer.disconnect();
	}, [x]);

	useAnimationFrame((_, delta) => {
		if (!setWidth) return;

		const frameProgress = delta / FRAME_DURATION;
		const frameVelocity =
			idleDirectionRef.current * IDLE_SPEED + velocityRef.current;

		targetXRef.current += frameVelocity * frameProgress;
		velocityRef.current *= VELOCITY_DECAY ** frameProgress;

		if (Math.abs(velocityRef.current) < 0.01) {
			velocityRef.current = 0;
		}

		while (targetXRef.current <= -setWidth * 2) {
			targetXRef.current += setWidth;
			x.set(x.get() + setWidth);
		}

		while (targetXRef.current >= 0) {
			targetXRef.current -= setWidth;
			x.set(x.get() - setWidth);
		}

		const currentX = x.get();
		const distance = targetXRef.current - currentX;

		if (Math.abs(distance) < 0.1) {
			x.set(targetXRef.current);
			return;
		}

		x.set(currentX + distance * 0.1);
	});

	const moveTrack = useCallback(
		(delta: number) => {
			if (!setWidth) return;

			if (delta !== 0) {
				idleDirectionRef.current = delta > 0 ? -1 : 1;
			}

			const nextVelocity = velocityRef.current - delta * WHEEL_FORCE;
			velocityRef.current = Math.max(
				Math.min(nextVelocity, MAX_WHEEL_VELOCITY),
				-MAX_WHEEL_VELOCITY,
			);
		},
		[setWidth],
	);

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			const target = event.target;

			if (!(target instanceof Element) || !target.closest("main")) {
				return;
			}

			event.preventDefault();
			moveTrack(event.deltaY || event.deltaX);
		};

		window.addEventListener("wheel", handleWheel, { passive: false });

		return () => window.removeEventListener("wheel", handleWheel);
	}, [moveTrack]);

	if (decoratedPosts.length === 0) {
		return (
			<p className="mt-16 max-w-xl text-sm font-medium text-black/55">
				No posts yet.
			</p>
		);
	}

	return (
		<section
			aria-label="Most recent blog posts"
			className="cursor-grab overflow-hidden pb-2 pt-2 mt-14 lg:mt-8"
		>
			<motion.div className="flex w-max items-start" style={{ x }}>
				{[0, 1, 2].map((groupIndex) => (
					<div
						key={groupIndex}
						ref={groupIndex === 0 ? firstSetRef : undefined}
						className="flex shrink-0 items-start gap-4 pr-4 sm:gap-5 sm:pr-5"
						aria-hidden={groupIndex !== 1}
					>
						{decoratedPosts.map((post) => (
							<BlogCard
								key={`${groupIndex}-${post.slug}`}
								title={post.title}
								href={`/blog/${post.slug}`}
								image={post.image}
								layout={post.layout}
								className={`${post.colorClassName} ${post.sizeClassName}`}
								imageClassName={
									post.layout === "side-image" ? undefined : post.imageClassName
								}
								tabIndex={groupIndex === 1 ? undefined : -1}
							/>
						))}
					</div>
				))}
			</motion.div>
		</section>
	);
}
