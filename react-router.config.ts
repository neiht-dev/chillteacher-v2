import type { Config } from "@react-router/dev/config";

export default {
	// Config options...
	// Server-side render by default, to enable SPA mode set this to `false`
	ssr: false,

	// Prerender the routes
	// async prerender() {
	// 	return ["/", "/test"]
	// }
} satisfies Config;
