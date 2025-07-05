import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

// import { flatRoutes } from "@react-router/fs-routes";
// export default flatRoutes() satisfies RouteConfig;

export default [
	// 404
	route("*", "./routes/404.tsx"),

	// Home route
	index("./routes/index.tsx"),

	// Protected routes
	layout("./layouts/protected-layout.tsx", [
		// School management routes
		layout("./layouts/main-layout.tsx", [
			route("schools", "./routes/schools.tsx"),
			route("dashboard", "./routes/dashboard.tsx"),
			route("students", "./routes/students.tsx"),
			route("teachers", "./routes/teachers.tsx"),
			route("classes", "./routes/classes.tsx"),
			route("classroom", "./routes/classroom.tsx"),
			route("attendance", "./routes/attendance.tsx"),
			route("reports", "./routes/reports.tsx"),
			route("settings", "./routes/settings.tsx"),
		]),
	]),

	// Auth routes
	layout("./layouts/auth-layout.tsx", [
		route("signup", "./routes/auth/signup.tsx"),
		route("login", "./routes/auth/login.tsx"),
		route("logout", "./routes/auth/logout.tsx"),
	]),
] satisfies RouteConfig;
