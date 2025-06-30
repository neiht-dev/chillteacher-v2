import type { Route } from "./+types/index";

// This is how we add meta data to the page
export function meta({}: Route.MetaArgs) {
	return [{ title: "Test" }, { description: "Test" }];
}

// This is the page component for the route
export default function Test() {
	return <div>Test index</div>;
}
