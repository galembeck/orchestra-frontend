import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/panel/administrators/internal/")({
	component: InternalAdministratorsPage,
	head: () => ({
		meta: [
			{ title: "Administradores — Gestão interna | Painel - orchestra.admin" },
		],
	}),
});

function InternalAdministratorsPage() {
	return <div>Hello "/_app/panel/administrators/internal/"!</div>;
}
