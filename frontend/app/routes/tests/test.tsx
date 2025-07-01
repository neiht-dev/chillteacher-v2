import type { Route } from "./+types/test";

// This is how we add meta data to the page
export function meta({}: Route.MetaArgs) {
	return [{ title: "Test" }, { description: "Test" }];
}

// Loader function
export async function loader({ params }: Route.LoaderArgs) {
	const { testId } = params as { testId: string };
	console.log(testId);
	return { testId };
}

// Client loader function
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const { testId } = params as { testId: string };
	console.log(testId);
	// Fetch data from the API
	const response = await fetch(`https://dog.ceo/api/breeds/image/random`);
	const data = await response.json();
	console.log(data);
	return { testId, data };
}

// This is the page component for the route
export default function Test({ loaderData }: Route.ComponentProps) {
	console.log(loaderData.data);
	return <div>Test {loaderData.testId}</div>;
}


