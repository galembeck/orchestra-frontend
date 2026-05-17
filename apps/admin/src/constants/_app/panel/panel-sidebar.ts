import { CheckCircle, LayoutDashboard, ShieldUser } from "lucide-react";

export const dashboardData = {
	primary: [
		{
			title: "Visão geral",
			url: "/panel/overview",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Administradores",
			icon: ShieldUser,
			items: [
				{ title: "Plataforma pública", url: "/panel/administrators/platform" },
				{ title: "Gestão interna", url: "/panel/administrators/internal" },
			],
		},
		{
			title: "Validação de cadastro",
			url: "/panel/validation",
			icon: CheckCircle,
		},
	],
};
