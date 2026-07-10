import { desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { comments, posts } from "./schema";

type CreateCommentInput = typeof comments.$inferInsert;

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
		.where(eq(comments.postId, post.id))
		.orderBy(desc(comments.createdAt));

	return { ...post, comments: postComments };
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
