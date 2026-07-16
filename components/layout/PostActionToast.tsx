"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const messages = {
	created: "Blog post created successfully.",
	updated: "Blog post updated successfully.",
	deleted: "Blog post deleted successfully.",
	bulkDeleted: "Selected blog posts deleted successfully.",
	restored: "Blog post restored successfully.",
	bulkRestored: "Selected blog posts restored successfully.",
	permanentlyDeleted: "Blog post permanently deleted.",
	bulkPermanentlyDeleted: "Selected blog posts permanently deleted.",
} as const;

export function PostActionToast() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const postAction = searchParams.get("postAction");

	useEffect(() => {
		if (!(postAction && postAction in messages)) return;

		toast.success(messages[postAction as keyof typeof messages], {
			duration: 3000,
			id: `post-action-${postAction}`,
		});

		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.delete("postAction");
		const query = nextParams.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	}, [pathname, postAction, router, searchParams]);

	return null;
}
