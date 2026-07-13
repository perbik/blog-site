"use client";

import { MenuIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";

interface SidebarShellProps {
	tags: string[];
}

export function SideBar({ tags }: SidebarShellProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetTrigger
					render={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="fixed left-3 top-3 z-50 border border-zinc-200 bg-background md:hidden"
						/>
					}
				>
					<MenuIcon />
					<span className="sr-only">Open navigation</span>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="w-72 max-w-[85vw] gap-0 border-zinc-200 bg-background px-4 py-3 text-foreground"
				>
					<SheetTitle className="sr-only">Navigation</SheetTitle>
					<Suspense fallback={null}>
						<SidebarContent
							tags={tags}
							onNavigate={() => setMobileOpen(false)}
						/>
					</Suspense>
				</SheetContent>
			</Sheet>

			<aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-zinc-200 bg-background px-6 py-4 text-foreground md:block">
				<Suspense fallback={null}>
					<SidebarContent tags={tags} />
				</Suspense>
			</aside>
		</>
	);
}
