import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in/")({
	component: SignInPage,
	head: () => ({
		meta: [
			{
				title: "Entrar | orchestra.web",
			},
		],
	}),
});

function SignInPage() {
	return <div>Hello "/_auth/sign-in/"!</div>;
}
