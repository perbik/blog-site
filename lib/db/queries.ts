import { arrayContains, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { comments, posts } from "./schema";

type CreatePostInput = typeof posts.$inferInsert;

export function createPost(input: CreatePostInput) {
	return db.insert(posts).values(input).returning();
}

export function getPostBySlug(slug: string) {
	return db
		.select()
		.from(posts)
		.where(eq(posts.slug, slug))
		.orderBy(desc(posts.createdAt));
}

export function getPosts(tag?: string) {
	return db
		.select()
		.from(posts)
		.where(tag ? arrayContains(posts.tags, [tag]) : undefined)
		.orderBy(desc(posts.createdAt));
}

export function getPostsWithComments() {
	return db.query.posts.findMany({
		with: { comments: true },
	});
}

export function updatePostTitle(postId: string, title: string) {
	return db
		.update(posts)
		.set({ title })
		.where(eq(posts.id, postId))
		.returning();
}

export function deleteComment(commentId: string) {
	return db.delete(comments).where(eq(comments.id, commentId)).returning();
}
