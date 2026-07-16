"use client";

import {
	ChevronDown,
	FilePlus2,
	LayoutDashboard,
	ListTree,
	LogOut,
	MessagesSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

export function AdminNavMenu({
	triggerClassName,
}: {
	triggerClassName: string;
}) {
	const router = useRouter();
	const items = [
		{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
		{ label: "Create post", href: "/admin?tab=compose", icon: FilePlus2 },
		{ label: "Posts", href: "/admin?tab=posts", icon: ListTree },
		{
			label: "Moderation",
			href: "/admin?tab=moderation",
			icon: MessagesSquare,
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					triggerClassName,
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
				{items.map((item) => (
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
	);
}
