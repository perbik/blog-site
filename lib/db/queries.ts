import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { comments, posts } from "./schema";

type CreateCommentInput = typeof comments.$inferInsert;
type CreatePostInput = typeof posts.$inferInsert;

export function createPost(input: CreatePostInput) {
	return db.insert(posts).values(input).returning();
}

export function createComment(input: CreateCommentInput) {
	return db.insert(comments).values(input).returning();
}

export function getPostBySlug(slug: string) {
	return db
		.select()
		.from(posts)
		.where(eq(posts.slug, slug))
		.orderBy(desc(posts.createdAt));
}

export async function getPostWithCommentsBySlug(slug: string) {
	const [post] = await getPostBySlug(slug);

	if (!post) {
		return undefined;
	}

	const postComments = await db
		.select()
		.from(comments)
		.where(and(eq(comments.postId, post.id), eq(comments.approved, true)))
		.orderBy(desc(comments.createdAt));

	return { ...post, comments: postComments };
}

export function getCommentsForModeration() {
	return db
		.select({
			id: comments.id,
			authorName: comments.authorName,
			body: comments.body,
			approved: comments.approved,
			createdAt: comments.createdAt,
			postTitle: posts.title,
			postSlug: posts.slug,
		})
		.from(comments)
		.innerJoin(posts, eq(comments.postId, posts.id))
		.orderBy(desc(comments.createdAt));
}

export function setCommentApproval(commentId: string, approved: boolean) {
	return db
		.update(comments)
		.set({ approved })
		.where(eq(comments.id, commentId))
		.returning({ id: comments.id });
}

export function getPosts(tags?: string | string[]) {
	const activeTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

	return db
		.select()
		.from(posts)
		.where(
			activeTags.length > 0
				? sql`${posts.tags} && ARRAY[${sql.join(
						activeTags.map((tag) => sql`${tag}`),
						sql`, `,
					)}]::text[]`
				: undefined,
		)
		.orderBy(desc(posts.createdAt));
}

export async function getPostTags(): Promise<string[]> {
	const rows = await db
		.select({ tag: sql<string>`unnest(${posts.tags})` })
		.from(posts);

	const tags = rows.flatMap((row) =>
		typeof row.tag === "string" && row.tag.length > 0 ? [row.tag] : [],
	);

	return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
}
