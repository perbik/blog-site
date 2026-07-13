"use client";

import { LockKeyhole } from "lucide-react";
import { useActionState } from "react";

import { type AdminActionState, authenticateAdmin } from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

const initialState: AdminActionState = { success: false };

export function AdminLoginForm() {
	const [state, formAction] = useActionState(authenticateAdmin, initialState);
	const passwordError = state.errors?.password?.[0];

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-28 text-black">
			<section className="w-full max-w-md rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-10">
				<div className="mb-8 flex size-12 items-center justify-center rounded-full bg-black text-white">
					<LockKeyhole className="size-5" aria-hidden="true" />
				</div>
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
					Admin panel
				</p>
				<h1 className="mt-3 font-heading text-5xl font-semibold leading-[0.9]">
					Welcome back.
				</h1>
				<p className="mt-4 text-sm leading-6 text-black/55">
					Enter the admin password to compose posts and moderate comments.
				</p>

				<form action={formAction} className="mt-8" noValidate>
					<label
						htmlFor="admin-password"
						className="mb-2 block text-sm font-medium"
					>
						Password
					</label>
					<input
						id="admin-password"
						name="password"
						type="password"
						autoComplete="current-password"
						aria-invalid={passwordError ? "true" : undefined}
						aria-describedby={
							passwordError ? "admin-password-error" : undefined
						}
						className="h-12 w-full rounded-xl border border-black/12 bg-[#f7f7f5] px-4 outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/6 aria-[invalid=true]:border-[#EA4D30]"
					/>
					{passwordError ? (
						<p
							id="admin-password-error"
							className="mt-2 text-xs text-[#b32f1b]"
						>
							{passwordError}
						</p>
					) : null}
					{state.message ? (
						<p
							className="mt-3 rounded-xl bg-[#EA4D30]/10 px-4 py-3 text-sm text-[#8c2515]"
							role="alert"
						>
							{state.message}
						</p>
					) : null}
					<AdminSubmitButton
						idleLabel="Unlock dashboard"
						pendingLabel="Checking…"
					/>
				</form>
			</section>
		</main>
	);
}
