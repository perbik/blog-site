import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { Suspense } from "react";
import { PostActionToast } from "@/components/layout/PostActionToast";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
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
	weight: ["400", "500", "600", "700", "800"],
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
				<SiteNavbar />

				<main className="relative z-10 min-w-0">{children}</main>
				<Suspense>
					<PostActionToast />
				</Suspense>
				<Toaster position="top-right" duration={3000} />
			</body>
		</html>
	);
}
