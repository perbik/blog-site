"use client";

import { BadgeCheck, ChevronDown, EyeOff, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { toggleCommentApproval } from "@/app/admin/actions";
import { ModerationButton } from "@/components/admin/ModerationButton";
import { PaginationNav } from "@/components/layout/PaginationNav";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModerationComment {
	id: string;
	authorName: string;
	body: string;
	approved: boolean;
	createdAt: Date;
	postTitle: string;
	postSlug: string;
}

type CommentFilter = "all" | "hidden" | "approved";

const filterOptions = [
	{ value: "all", label: "All comments", icon: MessagesSquare },
	{ value: "hidden", label: "Hidden", icon: EyeOff },
	{ value: "approved", label: "Approved", icon: BadgeCheck },
] as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

export function CommentModeration({
	comments,
}: {
	comments: ModerationComment[];
}) {
	const [filter, setFilter] = useState<CommentFilter>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const visibleComments = comments.filter((comment) => {
		if (filter === "approved") return comment.approved;
		if (filter === "hidden") return !comment.approved;
		return true;
	});
	const activeFilter = filterOptions.find((option) => option.value === filter);
	const commentsPerPage = 10;
	const totalPages = Math.ceil(visibleComments.length / commentsPerPage);
	const paginatedComments = visibleComments.slice(
		(currentPage - 1) * commentsPerPage,
		currentPage * commentsPerPage,
	);

	return (
		<div className="space-y-4">
			<DropdownMenu>
				<DropdownMenuTrigger
					aria-label={`Filter comments: ${activeFilter?.label}`}
					className="group inline-flex h-11 min-w-48 cursor-pointer items-center gap-3 rounded-full border border-white/25 bg-[#171717] px-5 text-sm font-semibold text-white outline-none transition hover:border-white/60 hover:bg-[#222] focus-visible:ring-2 focus-visible:ring-[#F5B22D] data-popup-open:border-[#F5B22D]"
				>
					{activeFilter ? (
						<activeFilter.icon className="size-4 text-[#F5B22D]" />
					) : null}
					<span>{activeFilter?.label}</span>
					<span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
						{visibleComments.length}
					</span>
					<ChevronDown className="size-4 text-white/60 transition-transform group-data-popup-open:rotate-180" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					sideOffset={8}
					className="min-w-56 rounded-2xl border border-white/10 bg-[#171717] p-2 text-white shadow-2xl shadow-black/40 ring-0"
				>
					<DropdownMenuGroup>
						<DropdownMenuLabel className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
							Show comments
						</DropdownMenuLabel>
					</DropdownMenuGroup>
					<DropdownMenuSeparator className="mx-1 bg-white/10" />
					<DropdownMenuRadioGroup
						value={filter}
						onValueChange={(value) => {
							setFilter(value as CommentFilter);
							setCurrentPage(1);
						}}
					>
						{filterOptions.map((option) => {
							const Icon = option.icon;
							const count = comments.filter((comment) =>
								option.value === "all"
									? true
									: option.value === "approved"
										? comment.approved
										: !comment.approved,
							).length;

							return (
								<DropdownMenuRadioItem
									key={option.value}
									value={option.value}
									className="my-1 cursor-pointer gap-3 rounded-xl px-3 py-2.5 pr-9 text-white/70 focus:bg-white/10 focus:text-white data-checked:bg-white/10 data-checked:text-white"
								>
									<Icon
										className={
											filter === option.value
												? "text-[#F5B22D]"
												: "text-white/40"
										}
									/>
									<span>{option.label}</span>
									<span className="ml-auto text-xs tabular-nums text-white/35">
										{count}
									</span>
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{visibleComments.length === 0 ? (
				<div className="rounded-[28px] bg-white p-8 text-sm text-black/50">
					No {filter === "all" ? "" : `${filter} `}comments to show.
				</div>
			) : (
				<div className="space-y-3">
					{paginatedComments.map((comment) => (
						<article
							key={comment.id}
							className="rounded-[28px] bg-white p-6 sm:p-8"
						>
							<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
										<h3 className="font-heading text-2xl font-semibold">
											{comment.authorName}
										</h3>
										<time
											className="text-sm text-black/50"
											dateTime={comment.createdAt.toISOString()}
										>
											{dateFormatter.format(comment.createdAt)}
										</time>
										<span
											className={
												comment.approved
													? "rounded-full bg-[#848C41] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
													: "rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
											}
										>
											{comment.approved ? "Approved" : "Hidden"}
										</span>
									</div>
									<Link
										href={`/blog/${comment.postSlug}`}
										className="mt-1 block cursor-pointer text-sm text-black/55 transition hover:text-black"
									>
										on {comment.postTitle}
									</Link>
									<p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-black/75">
										{comment.body}
									</p>
								</div>

								<div className="flex shrink-0 flex-wrap gap-2">
									<form action={toggleCommentApproval}>
										<input type="hidden" name="commentId" value={comment.id} />
										<input
											type="hidden"
											name="approved"
											value={comment.approved ? "false" : "true"}
										/>
										<input
											type="hidden"
											name="postSlug"
											value={comment.postSlug}
										/>
										<ModerationButton approved={comment.approved} />
									</form>
								</div>
							</div>
						</article>
					))}
				</div>
			)}

			<PaginationNav
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				className="pt-4 text-white"
			/>
		</div>
	);
}
