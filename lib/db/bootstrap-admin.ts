import { bootstrapAuth } from "@/lib/utils/auth";

async function main() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before bootstrapping.");
	}

	try {
		await bootstrapAuth.api.signUpEmail({
			body: {
				name: "Admin",
				email,
				password,
			},
		});
	} catch (error) {
		const body =
			typeof error === "object" && error !== null && "body" in error
				? error.body
				: undefined;
		const code =
			typeof body === "object" && body !== null && "code" in body
				? body.code
				: undefined;

		if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
			console.log(`Better Auth admin already exists for ${email}.`);
			return;
		}

		throw error;
	}

	console.log(`Better Auth admin created for ${email}.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
