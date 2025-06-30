import type { Route } from "./+types/escape-layout";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Escape nesting layout" },
		{ description: "Escape nesting layout" },
	];
}

export default function EscapeNestingLayout() {
	return <div>Escape nesting layout</div>;
}
