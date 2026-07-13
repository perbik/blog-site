import "dotenv/config";
import { inArray } from "drizzle-orm";
import { db } from "../index";
import { comments, posts } from "../schema";

const seedComments = [
	{
		postSlug: "building-a-calm-personal-blog",
		authorName: "Mara",
		body: "This makes the blog feel intentional without making it feel heavy.",
	},
	{
		postSlug: "notes-on-shipping-small-features",
		authorName: "Jules",
		body: "Small feature slices are so much easier to review and actually finish.",
	},
	{
		postSlug: "why-database-migrations-matter",
		authorName: "Ari",
		body: "Committed migrations make database changes much easier to trust.",
	},
];

export async function seedCommentsTable() {
	const existingPosts = await db.select().from(posts);
	const postIdsBySlug = new Map(
		existingPosts.map((post) => [post.slug, post.id] as const),
	);

	const values = seedComments.map((comment) => {
		const postId = postIdsBySlug.get(comment.postSlug);

		if (!postId) {
			throw new Error(
				`Cannot seed comment: post "${comment.postSlug}" is missing`,
			);
		}

		return {
			postId,
			authorName: comment.authorName,
			body: comment.body,
			approved: true,
		};
	});

	await db.delete(comments).where(
		inArray(
			comments.postId,
			values.map((comment) => comment.postId),
		),
	);

	await db.insert(comments).values(values);

	console.log(`Seeded ${values.length} comments.`);
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/")}`) {
	seedCommentsTable().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
