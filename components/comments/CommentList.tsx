"use client";

import { useState } from "react";

import { CommentCard } from "@/components/cards/CommentCard";
import { Button } from "@/components/ui/button";

interface CommentListComment {
	id: string;
	authorName: string;
	body: string;
	createdAt: Date;
}

export function CommentList({ comments }: { comments: CommentListComment[] }) {
	const [showAll, setShowAll] = useState(false);
	const visibleComments = showAll ? comments : comments.slice(0, 5);

	return (
		<>
			<div className="flex flex-col gap-4">
				{visibleComments.map((comment) => (
					<CommentCard
						key={comment.id}
						authorName={comment.authorName}
						body={comment.body}
						createdAt={comment.createdAt}
					/>
				))}
			</div>

			{comments.length > 5 && !showAll ? (
				<Button
					type="button"
					variant="outline"
					className="mt-6 cursor-pointer rounded-full border-black/25 bg-transparent px-6 text-black hover:bg-black hover:text-white"
					onClick={() => setShowAll(true)}
				>
					See More
				</Button>
			) : null}
		</>
	);
}
