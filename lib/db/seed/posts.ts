import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../index";
import { posts } from "../schema";

const seedPosts: (typeof posts.$inferInsert)[] = [
	{
		title: "Building a Calm Personal Blog",
		slug: "building-a-calm-personal-blog",
		image: "https://picsum.photos/id/200/1200/800",
		tags: ["Design", "Personal"],
		body: "A personal blog should feel easy to return to: readable typography, clear navigation, and enough structure to let the writing breathe.",
	},
	{
		title: "Notes on Shipping Small Features",
		slug: "notes-on-shipping-small-features",
		image: "https://picsum.photos/id/129/1200/800",
		tags: ["Process", "Engineering"],
		body: "Small features are easier to review, easier to test, and easier to improve once real users touch them.",
	},
	{
		title: "Why Database Migrations Matter",
		slug: "why-database-migrations-matter",
		image: "https://picsum.photos/id/100/1200/800",
		tags: ["Database", "Engineering"],
		body: "Committed migration files turn database changes into project history, which makes deployments repeatable and team work less mysterious.",
	},
	{
		title: "Making Space for Better Comments",
		slug: "making-space-for-better-comments",
		image: "https://picsum.photos/id/180/1200/800",
		tags: ["Community", "Personal"],
		body: "Comments can turn a post into a conversation when the interface feels welcoming, the prompt is clear, and the author stays present.",
	},
	{
		title: "A Small Log of Things I Learned",
		slug: "a-small-log-of-things-i-learned",
		image: "https://picsum.photos/id/24/1200/800",
		tags: ["Learning", "Notes"],
		body: "Keeping a short learning log makes progress easier to notice, especially when the work happens in quiet experiments and tiny fixes.",
	},
	{
		title: "Designing Around the Writing",
		slug: "designing-around-the-writing",
		image: "https://picsum.photos/id/96/1200/800",
		tags: ["Design", "Writing"],
		body: "The best blog layout gets out of the way without disappearing: it gives the writing rhythm, hierarchy, and a place for readers to respond.",
	},
];

export async function seedPostsTable() {
	await db
		.insert(posts)
		.values(seedPosts)
		.onConflictDoUpdate({
			target: posts.slug,
			set: {
				title: sql`excluded.title`,
				image: sql`excluded.image`,
				tags: sql`excluded.tags`,
				body: sql`excluded.body`,
			},
		});

	console.log(`Seeded ${seedPosts.length} blog posts.`);
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/")}`) {
	seedPostsTable().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
