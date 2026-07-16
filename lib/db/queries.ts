import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./index";
import { commentSettings, comments, posts } from "./schema";

type CreateCommentInput = typeof comments.$inferInsert;
type CreatePostInput = typeof posts.$inferInsert;

export function createPost(input: CreatePostInput) {
	return db.insert(posts).values(input).returning();
}

export function createComment(input: CreateCommentInput) {
	return db.insert(comments).values(input).returning();
}

export async function getAutoApproveComments() {
	const [settings] = await db
		.select({ autoApprove: commentSettings.autoApprove })
		.from(commentSettings)
		.where(eq(commentSettings.id, "default"));

	return settings?.autoApprove ?? false;
}

export function setAutoApproveComments(autoApprove: boolean) {
	return db
		.insert(commentSettings)
		.values({ id: "default", autoApprove })
		.onConflictDoUpdate({
			target: commentSettings.id,
			set: { autoApprove },
		});
}

export function getPostBySlug(slug: string) {
	return db
		.select()
		.from(posts)
		.where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
		.orderBy(desc(posts.createdAt), desc(posts.id));
}

export async function getPostMetadataBySlug(slug: string) {
	"use cache";
	cacheLife("max");
	cacheTag("posts", `post:${slug}`);

	const [post] = await db
		.select({ title: posts.title, body: posts.body, image: posts.image })
		.from(posts)
		.where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
		.limit(1);

	return post;
}

export async function getPostWithCommentsBySlug(slug: string) {
	"use cache";
	cacheLife("max");
	cacheTag("posts", `post:${slug}`, `post-comments:${slug}`);

	const [post] = await db
		.select()
		.from(posts)
		.where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
		.limit(1);

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
		.where(isNull(posts.deletedAt))
		.orderBy(desc(comments.createdAt));
}

export async function getPostById(postId: string) {
	const [post] = await db
		.select()
		.from(posts)
		.where(and(eq(posts.id, postId), isNull(posts.deletedAt)))
		.limit(1);

	return post;
}

export function updatePost(
	postId: string,
	input: Pick<CreatePostInput, "title" | "slug" | "image" | "tags" | "body">,
) {
	return db
		.update(posts)
		.set(input)
		.where(and(eq(posts.id, postId), isNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function softDeletePost(postId: string) {
	return db
		.update(posts)
		.set({ deletedAt: new Date() })
		.where(and(eq(posts.id, postId), isNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function softDeletePosts(postIds: string[]) {
	return db
		.update(posts)
		.set({ deletedAt: new Date() })
		.where(and(inArray(posts.id, postIds), isNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function getDeletedPosts() {
	return db
		.select()
		.from(posts)
		.where(isNotNull(posts.deletedAt))
		.orderBy(desc(posts.deletedAt), desc(posts.id));
}

export function restorePost(postId: string) {
	return db
		.update(posts)
		.set({ deletedAt: null })
		.where(and(eq(posts.id, postId), isNotNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function restorePosts(postIds: string[]) {
	return db
		.update(posts)
		.set({ deletedAt: null })
		.where(and(inArray(posts.id, postIds), isNotNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function permanentlyDeletePost(postId: string) {
	return db
		.delete(posts)
		.where(and(eq(posts.id, postId), isNotNull(posts.deletedAt)))
		.returning({ id: posts.id });
}

export function permanentlyDeletePosts(postIds: string[]) {
	return db
		.delete(posts)
		.where(and(inArray(posts.id, postIds), isNotNull(posts.deletedAt)))
		.returning({ id: posts.id });
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
				? and(
						isNull(posts.deletedAt),
						sql`${posts.tags} && ARRAY[${sql.join(
							activeTags.map((tag) => sql`${tag}`),
							sql`, `,
						)}]::text[]`,
					)
				: isNull(posts.deletedAt),
		)
		.orderBy(desc(posts.createdAt), desc(posts.id));
}

const postSummarySelection = {
	id: posts.id,
	title: posts.title,
	slug: posts.slug,
	image: posts.image,
	tags: posts.tags,
	createdAt: posts.createdAt,
};

export async function getPostSummaries(tags: string[] = []) {
	"use cache";
	cacheLife("max");
	cacheTag("posts", "post-tags");

	return db
		.select(postSummarySelection)
		.from(posts)
		.where(
			tags.length > 0
				? and(
						isNull(posts.deletedAt),
						sql`${posts.tags} && ARRAY[${sql.join(
							tags.map((tag) => sql`${tag}`),
							sql`, `,
						)}]::text[]`,
					)
				: isNull(posts.deletedAt),
		)
		.orderBy(desc(posts.createdAt), desc(posts.id));
}

export async function getPostColorOrder() {
	"use cache";
	cacheLife("max");
	cacheTag("posts");

	const orderedPosts = await db
		.select({ slug: posts.slug })
		.from(posts)
		.orderBy(posts.createdAt, posts.id);

	return orderedPosts.map((post) => post.slug);
}

export async function getHeroPosts() {
	"use cache";
	cacheLife("max");
	cacheTag("posts", "hero-posts");

	return db
		.select(postSummarySelection)
		.from(posts)
		.where(and(isNull(posts.deletedAt), isNotNull(posts.image)))
		.orderBy(desc(posts.createdAt), desc(posts.id))
		.limit(5);
}

export async function getApprovedCommentCounts() {
	"use cache";
	cacheLife("max");
	cacheTag("comment-counts");

	return db
		.select({
			postId: comments.postId,
			count: sql<number>`count(*)::int`,
		})
		.from(comments)
		.innerJoin(posts, eq(comments.postId, posts.id))
		.where(and(eq(comments.approved, true), isNull(posts.deletedAt)))
		.groupBy(comments.postId);
}

export async function getPostTags(): Promise<string[]> {
	"use cache";
	cacheLife("max");
	cacheTag("posts", "post-tags");
	const rows = await db
		.select({ tag: sql<string>`unnest(${posts.tags})` })
		.from(posts)
		.where(isNull(posts.deletedAt));

	const tags = rows.flatMap((row) =>
		typeof row.tag === "string" && row.tag.length > 0 ? [row.tag] : [],
	);

	return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
}
