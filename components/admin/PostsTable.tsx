"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowSelectionState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronDown,
	Pencil,
	Tags,
} from "lucide-react";
import Link from "next/link";
import {
	type ComponentProps,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { BulkDeletePostsDialog } from "@/components/admin/BulkDeletePostsDialog";
import { PermanentDeletePostsDialog } from "@/components/admin/PermanentDeletePostsDialog";
import { PostDeleteForm } from "@/components/admin/PostDeleteForm";
import {
	BulkRestorePostsForm,
	RestorePostForm,
} from "@/components/admin/RestorePostsForm";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AdminPost {
	id: string;
	title: string;
	slug: string;
	tags: string[];
	createdAt: Date;
	deletedAt: Date | null;
}

type PostsView = "active" | "trash";

const POSTS_PER_PAGE = 10;
const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function SelectionCheckbox({
	indeterminate,
	className,
	...props
}: ComponentProps<"input"> & { indeterminate?: boolean }) {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
	}, [indeterminate]);

	return (
		<input
			ref={ref}
			type="checkbox"
			className={cn(
				"size-4 cursor-pointer accent-[#171717] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function SortButton({
	label,
	sorted,
	onClick,
}: {
	label: string;
	sorted: false | "asc" | "desc";
	onClick: () => void;
}) {
	const Icon =
		sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex cursor-pointer items-center gap-2 font-semibold transition hover:text-black"
		>
			{label}
			<Icon className="size-3.5" />
		</button>
	);
}

export function PostsTable({
	posts,
	deletedPosts,
}: {
	posts: AdminPost[];
	deletedPosts: AdminPost[];
}) {
	const [view, setView] = useState<PostsView>("active");
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "date", desc: true },
	]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const visiblePosts = view === "active" ? posts : deletedPosts;
	const tags = useMemo(
		() => Array.from(new Set(visiblePosts.flatMap((post) => post.tags))).sort(),
		[visiblePosts],
	);

	const columns = useMemo<ColumnDef<AdminPost>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<SelectionCheckbox
						aria-label="Select all posts on this page"
						checked={table.getIsAllPageRowsSelected()}
						indeterminate={table.getIsSomePageRowsSelected()}
						onChange={table.getToggleAllPageRowsSelectedHandler()}
					/>
				),
				cell: ({ row }) => (
					<SelectionCheckbox
						aria-label={`Select ${row.original.title}`}
						checked={row.getIsSelected()}
						onChange={row.getToggleSelectedHandler()}
					/>
				),
				enableSorting: false,
			},
			{
				accessorKey: "title",
				header: "Post",
				cell: ({ row }) => (
					<div>
						<Link
							href={`/blog/${row.original.slug}`}
							className="font-heading text-lg font-semibold hover:underline"
						>
							{row.original.title}
						</Link>
						<p className="mt-1 text-xs text-black/40">/{row.original.slug}</p>
					</div>
				),
				enableSorting: false,
			},
			{
				accessorKey: "tags",
				header: "Tags",
				filterFn: (row, columnId, value) =>
					!value || (row.getValue(columnId) as string[]).includes(value),
				cell: ({ row }) => (
					<span className="text-sm text-black/55">
						{row.original.tags.length > 0 ? row.original.tags.join(", ") : "—"}
					</span>
				),
			},
			{
				id: "date",
				accessorFn: (post) =>
					view === "active" ? post.createdAt : post.deletedAt,
				header: ({ column }) => (
					<SortButton
						label={view === "active" ? "Published" : "Deleted"}
						sorted={column.getIsSorted()}
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					/>
				),
				cell: ({ row }) => (
					<span className="whitespace-nowrap text-sm text-black/55">
						{dateFormatter.format(
							view === "active"
								? row.original.createdAt
								: (row.original.deletedAt ?? row.original.createdAt),
						)}
					</span>
				),
			},
			{
				id: "actions",
				header: () => <span className="block text-right">Actions</span>,
				cell: ({ row }) =>
					view === "active" ? (
						<div className="flex justify-end gap-2">
							<Link
								href={`/admin/posts/${row.original.id}/edit`}
								className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/75"
							>
								<Pencil className="size-3.5" /> Edit
							</Link>
							<PostDeleteForm
								postId={row.original.id}
								postTitle={row.original.title}
							/>
						</div>
					) : (
						<div className="flex justify-end gap-2">
							<RestorePostForm postId={row.original.id} />
							<PermanentDeletePostsDialog
								postIds={[row.original.id]}
								postTitle={row.original.title}
							/>
						</div>
					),
				enableSorting: false,
			},
		],
		[view],
	);

	// TanStack composes filtering, sorting, selection, and pagination into derived row models
	const table = useReactTable({
		data: visiblePosts,
		columns,
		state: { sorting, columnFilters, rowSelection },
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: POSTS_PER_PAGE } },
	});

	const selectedPostIds = table
		.getSelectedRowModel()
		.rows.map((row) => row.original.id);
	const tagFilter = (table.getColumn("tags")?.getFilterValue() as string) ?? "";
	const setTagFilter = (value: string) => {
		table.getColumn("tags")?.setFilterValue(value || undefined);
		setRowSelection({});
		table.setPageIndex(0);
	};

	return (
		<section className="space-y-4">
			<fieldset
				className="inline-flex rounded-full bg-white/10 p-1"
				aria-label="Post status"
			>
				{(["active", "trash"] as const).map((option) => (
					<button
						key={option}
						type="button"
						onClick={() => {
							setView(option);
							setColumnFilters([]);
							setRowSelection({});
							setSorting([{ id: "date", desc: true }]);
							table.setPageIndex(0);
						}}
						className={cn(
							"cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold capitalize transition",
							view === option
								? "bg-[#F5B22D] text-black"
								: "text-white/60 hover:text-white",
						)}
					>
						{option === "active" ? "Active" : "Deleted"} (
						{option === "active" ? posts.length : deletedPosts.length})
					</button>
				))}
			</fieldset>
			<div className="flex flex-col gap-3 rounded-[24px] bg-[#171717] p-3 sm:flex-row sm:items-center sm:justify-between">
				<DropdownMenu>
					<DropdownMenuTrigger
						aria-label={`Filter posts by tag: ${tagFilter || "All tags"}`}
						className="group inline-flex h-11 min-w-52 cursor-pointer items-center gap-3 rounded-full border border-white/15 bg-[#262626] px-5 text-sm font-semibold text-white outline-none transition hover:border-white/35 hover:bg-[#303030] focus-visible:ring-2 focus-visible:ring-[#F5B22D] data-popup-open:border-[#F5B22D]"
					>
						<Tags className="size-4 text-[#F5B22D]" />
						<span>{tagFilter || "All tags"}</span>
						<ChevronDown className="ml-auto size-4 text-white/50 transition-transform group-data-popup-open:rotate-180" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						sideOffset={8}
						className="min-w-56 rounded-2xl border border-white/10 bg-[#171717] p-2 text-white shadow-2xl shadow-black/40 ring-0"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
								Filter by tag
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="mx-1 bg-white/10" />
						<DropdownMenuRadioGroup
							value={tagFilter}
							onValueChange={setTagFilter}
						>
							<DropdownMenuRadioItem
								value=""
								className="my-1 cursor-pointer rounded-xl px-3 py-2.5 pr-9 text-white/70 focus:bg-white/10 focus:text-white data-checked:bg-white/10 data-checked:text-white"
							>
								All tags
							</DropdownMenuRadioItem>
							{tags.map((tag) => (
								<DropdownMenuRadioItem
									key={tag}
									value={tag}
									className="my-1 cursor-pointer rounded-xl px-3 py-2.5 pr-9 text-white/70 focus:bg-white/10 focus:text-white data-checked:bg-white/10 data-checked:text-white"
								>
									{tag}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				{view === "active" ? (
					<BulkDeletePostsDialog postIds={selectedPostIds} />
				) : (
					<div className="flex flex-wrap gap-2">
						<BulkRestorePostsForm postIds={selectedPostIds} />
						<PermanentDeletePostsDialog postIds={selectedPostIds} bulk />
					</div>
				)}
			</div>

			<div className="overflow-hidden rounded-[28px] bg-white">
				<Table className="min-w-205 text-left">
					<TableHeader className="border-b border-black/10 bg-[#F8E8CE] text-xs uppercase tracking-wider text-black/55">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="h-auto px-6 py-4">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() ? "selected" : undefined}
									className="border-black/8 data-[state=selected]:bg-[#F5B22D]/10"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-6 py-5">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 text-center text-black/50"
								>
									{tagFilter
										? "No posts match this tag."
										: view === "active"
											? "No active posts to manage."
											: "No deleted posts to manage."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-white/55">
					{selectedPostIds.length} of {table.getFilteredRowModel().rows.length}{" "}
					selected
				</p>
				<PaginationNav
					currentPage={table.getState().pagination.pageIndex + 1}
					totalPages={table.getPageCount()}
					onPageChange={(page) => table.setPageIndex(page - 1)}
					className="text-white"
				/>
			</div>
		</section>
	);
}
