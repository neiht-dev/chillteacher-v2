import type { Route } from "./+types/test";

// Loader function
export async function loader({ params }: Route.LoaderArgs) {
	const { testId } = params as { testId: string };
	console.log(testId);
	return { testId };
}

// This is how we add meta data to the page
export function meta({}: Route.MetaArgs) {
	return [{ title: "Test" }, { description: "Test" }];
}

// This is the page component for the route
export default function Test({ loaderData }: Route.ComponentProps) {
	return <div>Test {loaderData.testId}</div>;
}
