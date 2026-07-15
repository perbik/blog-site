import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/utils/auth";

export const { GET, POST } = toNextJsHandler(auth);
