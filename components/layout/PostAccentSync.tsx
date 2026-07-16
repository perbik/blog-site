"use client";

import { useEffect } from "react";

type PostAccent =
	| "blue"
	| "red"
	| "beige"
	| "gray"
	| "purple"
	| "green"
	| "yellow";

export function PostAccentSync({ accent }: { accent: PostAccent }) {
	useEffect(() => {
		document.documentElement.dataset.activePostAccent = accent;

		return () => {
			delete document.documentElement.dataset.activePostAccent;
		};
	}, [accent]);

	return null;
}
