import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Dashboard" }, { description: "Dashboard" }];
}

export default function Home() {
	return <div>Home</div>;
}
