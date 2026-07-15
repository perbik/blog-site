import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import * as authSchema from "@/lib/db/auth-schema";

function createAuth(disableSignUp: boolean) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: authSchema,
		}),
		emailAndPassword: {
			enabled: true,
			disableSignUp,
		},
		plugins: [nextCookies()],
	});
}

export const auth = createAuth(true);
export const bootstrapAuth = createAuth(false);
