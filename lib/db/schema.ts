import { defineRelations, sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	image: text("image"),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
	body: text("body").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorName: text("author_name").notNull(),
	body: text("body").notNull(),
	approved: boolean("approved").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentSettings = pgTable("comment_settings", {
	id: text("id").primaryKey().default("default"),
	autoApprove: boolean("auto_approve").default(false).notNull(),
});

export const relations = defineRelations(
	{ posts, comments, commentSettings },
	(r) => ({
		posts: {
			comments: r.many.comments({
				from: r.posts.id,
				to: r.comments.postId,
			}),
		},
		comments: {
			post: r.one.posts({
				from: r.comments.postId,
				to: r.posts.id,
				optional: false,
			}),
		},
	}),
);
