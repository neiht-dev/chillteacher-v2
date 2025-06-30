import {
	index,
	// layout,
	// prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

// import { flatRoutes } from "@react-router/fs-routes";
// export default flatRoutes() satisfies RouteConfig;

export default [
	// School management routes
	index("./routes/index.tsx"),
	route("dashboard", "./routes/dashboard.tsx"),
	route("students", "./routes/students.tsx"),
	route("teachers", "./routes/teachers.tsx"),
	route("classes", "./routes/classes.tsx"),
	route("classroom", "./routes/classroom.tsx"),
	route("attendance", "./routes/attendance.tsx"),
	route("reports", "./routes/reports.tsx"),
	route("settings", "./routes/settings.tsx"),

	// Test routes
	route("test", "./routes/tests/test-layout.tsx", [
		index("./routes/tests/index.tsx"),
		route(":testId", "./routes/tests/test.tsx"),
	]),
	route("test/escape-nesting-layout", "./routes/tests/escape-layout.tsx"),
] satisfies RouteConfig;
