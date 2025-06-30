import { Link, Outlet } from "react-router";

// This is the layout component for the test route
export default function TestLayout() {
	return (
		<div>
			{/* urls */}
			<ul style={{ display: "flex", gap: "10px" }}>
				<li>
					<Link to="/test">Test</Link>
				</li>
				<li>
					<Link to="/test/1">Test 1</Link>
				</li>
				<li>
					<Link to="/test/abc">Test 2</Link>
				</li>
				<li>
					<Link to="/test/escape-nesting-layout">
						Test escape nesting layout
					</Link>
				</li>
			</ul>
			<Outlet />
		</div>
	);
}
