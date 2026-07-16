import { seedCommentsTable } from "./comments";
import { seedPostsTable } from "./posts";

async function main() {
	await seedPostsTable();
	await seedCommentsTable();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
