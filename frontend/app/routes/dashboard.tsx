import { redirect } from "react-router";
// import type { Route } from "./+types/dashboard";

export async function loader() {
	return redirect("/students");
}

const Dashboard = () => {
	return <div>Dashboard</div>;
};

export default Dashboard;
