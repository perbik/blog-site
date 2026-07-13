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
