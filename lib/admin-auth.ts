import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
	const password = process.env.ADMIN_PASSWORD;
	return password ? `echo-admin-session:${password}` : undefined;
}

function sign(value: string) {
	const secret = getSessionSecret();
	if (!secret) return null;
	return createHmac("sha256", secret).update(value).digest("hex");
}

function safelyEqual(left: string, right: string) {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);
	return (
		leftBuffer.length === rightBuffer.length &&
		timingSafeEqual(leftBuffer, rightBuffer)
	);
}

export function isAdminConfigured() {
	return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdminAuthenticated() {
	const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
	if (!cookie) return false;

	const [expiresAt, signature] = cookie.split(".");
	if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) return false;

	const expectedSignature = sign(expiresAt);
	return Boolean(
		expectedSignature && safelyEqual(signature, expectedSignature),
	);
}

export function isCorrectAdminPassword(password: string) {
	const expected = process.env.ADMIN_PASSWORD;
	return Boolean(expected && safelyEqual(password, expected));
}

export async function createAdminSession() {
	const expiresAt = String(Date.now() + SESSION_LIFETIME_SECONDS * 1000);
	const signature = sign(expiresAt);
	if (!signature) throw new Error("Admin authentication is not configured.");

	(await cookies()).set(ADMIN_COOKIE, `${expiresAt}.${signature}`, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: SESSION_LIFETIME_SECONDS,
	});
}

export async function deleteAdminSession() {
	(await cookies()).delete(ADMIN_COOKIE);
}

export async function requireAdmin() {
	if (!(await isAdminAuthenticated())) {
		throw new Error("Unauthorized admin action.");
	}
}
