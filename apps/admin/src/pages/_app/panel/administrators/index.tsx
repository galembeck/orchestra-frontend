import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/panel/administrators/")({
	beforeLoad: () => {
		throw redirect({ to: "/panel/overview" });
	},
});
