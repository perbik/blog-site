"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationNavProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

function getPageItems(currentPage: number, totalPages: number) {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);

	if (start > 2) pages.push("ellipsis-start");
	for (let page = start; page <= end; page += 1) pages.push(page);
	if (end < totalPages - 1) pages.push("ellipsis-end");
	pages.push(totalPages);

	return pages;
}

export function PaginationNav({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: PaginationNavProps) {
	if (totalPages <= 1) return null;

	const changePage = (page: number) => {
		onPageChange(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Pagination className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						aria-disabled={currentPage === 1}
						className={
							currentPage === 1 ? "pointer-events-none opacity-40" : ""
						}
						onClick={(event) => {
							event.preventDefault();
							changePage(currentPage - 1);
						}}
					/>
				</PaginationItem>

				{getPageItems(currentPage, totalPages).map((item) => (
					<PaginationItem key={item}>
						{typeof item === "number" ? (
							<PaginationLink
								href="#"
								isActive={item === currentPage}
								onClick={(event) => {
									event.preventDefault();
									changePage(item);
								}}
							>
								{item}
							</PaginationLink>
						) : (
							<PaginationEllipsis />
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href="#"
						aria-disabled={currentPage === totalPages}
						className={
							currentPage === totalPages ? "pointer-events-none opacity-40" : ""
						}
						onClick={(event) => {
							event.preventDefault();
							changePage(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
