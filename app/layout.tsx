import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const body = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const display = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	weight: ["500", "600", "700", "800"],
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "echo",
		template: "%s — echo",
	},
	description:
		"A personal blog for creators, social media marketers, and the creator economy.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				body.variable,
				display.variable,
				"h-full font-mono antialiased",
			)}
		>
			<body className="min-h-full bg-background text-foreground">
				<Suspense
					fallback={
						<header className="site-header-glass fixed inset-x-0 top-0 z-50 flex h-24 items-start justify-center px-5 pt-5 sm:px-7">
							<nav className="site-glass-nav site-frosted-nav flex h-12 w-[min(390px,calc(100vw-40px))] items-center justify-center gap-5 rounded-full px-5 text-white">
								<Link
									href="/"
									className="font-mono text-xs font-semibold tracking-[0.12em]"
								>
									HOME
								</Link>
								<Link
									href="/blog"
									className="font-mono text-xs font-semibold tracking-[0.12em]"
								>
									BLOGS
								</Link>
								<Link
									href="/admin"
									className="font-mono text-xs font-semibold tracking-[0.12em]"
								>
									ADMIN
								</Link>
							</nav>
						</header>
					}
				>
					<Navbar />
				</Suspense>

				<main className="relative z-10 min-w-0">{children}</main>
				<Toaster position="top-right" duration={3000} />
			</body>
		</html>
	);
}
