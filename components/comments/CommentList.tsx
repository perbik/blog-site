import { CommentCard } from "@/components/cards/CommentCard";
import { CommentListExpansion } from "./CommentListExpansion";

interface CommentListComment {
	id: string;
	authorName: string;
	body: string;
	createdAt: Date;
}

export function CommentList({ comments }: { comments: CommentListComment[] }) {
	const initialComments = comments.slice(0, 5);
	const remainingComments = comments.slice(5);

	return (
		<>
			<div className="flex flex-col gap-4">
				{initialComments.map((comment) => (
					<CommentCard
						key={comment.id}
						authorName={comment.authorName}
						body={comment.body}
						createdAt={comment.createdAt}
					/>
				))}
			</div>

			<CommentListExpansion comments={remainingComments} />
		</>
	);
}
