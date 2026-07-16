"use client";

import { useState } from "react";

import { CommentCard } from "@/components/cards/CommentCard";
import { Button } from "@/components/ui/button";

interface CommentListExpansionProps {
	comments: Array<{
		id: string;
		authorName: string;
		body: string;
		createdAt: Date;
	}>;
}

export function CommentListExpansion({ comments }: CommentListExpansionProps) {
	const [expanded, setExpanded] = useState(false);

	if (comments.length === 0) return null;

	return (
		<>
			{expanded ? (
				<div className="mt-4 flex flex-col gap-4">
					{comments.map((comment) => (
						<CommentCard
							key={comment.id}
							authorName={comment.authorName}
							body={comment.body}
							createdAt={comment.createdAt}
						/>
					))}
				</div>
			) : null}

			{!expanded ? (
				<Button
					type="button"
					variant="outline"
					className="mt-6 cursor-pointer rounded-full border-black/25 bg-transparent px-6 text-black hover:bg-black hover:text-white"
					onClick={() => setExpanded(true)}
				>
					See More
				</Button>
			) : null}
		</>
	);
}
