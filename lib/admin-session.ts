import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/utils/auth";

export function isAdminConfigured() {
	return Boolean(
		process.env.BETTER_AUTH_SECRET &&
			process.env.BETTER_AUTH_URL &&
			process.env.ADMIN_EMAIL,
	);
}

export async function getAdminSession() {
	if (!isAdminConfigured()) return null;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Better Auth proves the session while ADMIN_EMAIL restricts access to the configured administrator
	return session?.user.email.toLowerCase() ===
		process.env.ADMIN_EMAIL?.toLowerCase()
		? session
		: null;
}

export async function isAdminAuthenticated() {
	return Boolean(await getAdminSession());
}

export async function requireAdmin() {
	const session = await getAdminSession();
	if (!session) throw new Error("Unauthorized admin action.");
	return session;
}
