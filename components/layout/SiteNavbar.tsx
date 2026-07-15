"use client";

import {
	ChevronDown,
	FilePlus2,
	LayoutDashboard,
	ListTree,
	LogOut,
	MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logoutAdmin } from "@/app/admin/actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
	const [scrolled, setScrolled] = useState(false);
	const [progress, setProgress] = useState(0);
	const pathname = usePathname();
	const router = useRouter();
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
					{isAdminPage ? (
						<DropdownMenu>
							<DropdownMenuTrigger
								className={cn(
									navLinkClassName(true),
									"group flex items-center gap-1 outline-none",
								)}
								aria-label="Open admin menu"
							>
								ADMIN
								<ChevronDown className="size-3 transition-transform group-data-popup-open:rotate-180" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								sideOffset={12}
								className="w-44 rounded-xl border border-white/10 bg-[#171717] p-1.5 text-white shadow-2xl shadow-black/40 ring-0"
							>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
										Admin menu
									</DropdownMenuLabel>
								</DropdownMenuGroup>
								<DropdownMenuSeparator className="mx-1 bg-white/10" />
								{[
									{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
									{
										label: "Create post",
										href: "/admin?tab=compose",
										icon: FilePlus2,
									},
									{ label: "Posts", href: "/admin?tab=posts", icon: ListTree },
									{
										label: "Moderation",
										href: "/admin?tab=moderation",
										icon: MessagesSquare,
									},
								].map((item) => (
									<DropdownMenuItem
										key={item.href}
										onClick={() => router.push(item.href)}
										className="my-0.5 cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs text-white/70 focus:bg-white/10 focus:text-white"
									>
										<item.icon className="size-3.5 text-[#F5B22D]" />
										{item.label}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator className="mx-1 bg-white/10" />
								<form action={logoutAdmin}>
									<DropdownMenuItem
										render={<button type="submit" className="w-full" />}
										nativeButton
										variant="destructive"
										className="my-0.5 cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs"
									>
										<LogOut className="size-3.5" />
										Log out
									</DropdownMenuItem>
								</form>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link href="/admin" className={navLinkClassName(false)}>
							ADMIN
						</Link>
					)}
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
