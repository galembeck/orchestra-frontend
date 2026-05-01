/** biome-ignore-all lint/suspicious/noArrayIndexKey: required by bento-grid component */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banknote, BarChart3, ClipboardList, ShieldCheck } from "lucide-react";
import { BentoCard, BentoGrid } from "./bento-grid";

const sampleItems = [
	{
		name: "Validação em até 48h",
		description:
			"Empresa verificada com CNPJ em dois dias. Sem burocracia, sem visita presencial.",
		Icon: ShieldCheck,
		href: "/",
		cta: "Ver como funciona",
		className: "col-span-3 lg:col-span-2",
		background: (
			<div className="relative h-44 overflow-hidden bg-surface-navy/5">
				<div className="absolute -top-10 -right-10 h-48 w-48 rounded-full border border-foreground-primary/8" />
				<div className="absolute top-4 right-4 h-28 w-28 rounded-full border border-foreground-primary/8" />
				<div className="absolute top-14 right-14 h-12 w-12 rounded-full bg-foreground-primary/5" />
			</div>
		),
	},
	{
		name: "PIX integrado",
		description:
			"Receba na hora, sem D+30. Liquidez real para quem depende do caixa diário.",
		Icon: Banknote,
		href: "/",
		cta: "Saiba mais",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className="relative h-44 overflow-hidden bg-surface-accent-soft/25">
				<span className="absolute top-4 right-4 select-none font-bold font-jetbrains-mono text-7xl text-accent/10 leading-none">
					PIX
				</span>
			</div>
		),
	},
	{
		name: "Ordens digitais",
		description:
			"Checklists, fotos, assinatura do cliente e histórico completo em cada serviço.",
		Icon: ClipboardList,
		href: "/",
		cta: "Ver exemplo",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className="relative h-44 overflow-hidden bg-surface-tertiary/40">
				<div className="absolute inset-x-5 top-7 flex flex-col gap-2.5">
					<div className="h-1.5 w-3/4 rounded-full bg-foreground-primary/10" />
					<div className="h-1.5 w-full rounded-full bg-foreground-primary/10" />
					<div className="h-1.5 w-2/3 rounded-full bg-foreground-primary/10" />
					<div className="h-1.5 w-full rounded-full bg-foreground-primary/10" />
					<div className="h-1.5 w-4/5 rounded-full bg-foreground-primary/10" />
				</div>
			</div>
		),
	},
	{
		name: "Painel em tempo real",
		description:
			"Receita, equipe, avaliações e agenda — tudo atualizado ao vivo, de qualquer dispositivo.",
		Icon: BarChart3,
		href: "/",
		cta: "Explorar painel",
		className: "col-span-3 lg:col-span-2",
		background: (
			<div className="relative flex h-44 items-end overflow-hidden bg-surface-secondary/60 px-5">
				<div className="flex w-full items-end gap-1.5">
					{[30, 48, 38, 62, 54, 72, 80].map((h, i) => (
						<div
							className={`flex-1 rounded-t-[3px] ${i === 6 ? "bg-accent/30" : "bg-foreground-primary/10"}`}
							key={`bar-${i}`}
							style={{ height: `${h * 0.55}px` }}
						/>
					))}
				</div>
			</div>
		),
	},
];

const meta = {
	title: "Organisms/BentoGrid",
	component: BentoGrid,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"A responsive feature-showcase grid composed of `BentoGrid` (layout) and `BentoCard` (item). Cards reveal a CTA link on hover via a translate animation. Pass `className` on each `BentoCard` to control column span.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof BentoGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="bg-surface p-8">
			<BentoGrid className="auto-rows-auto lg:auto-rows-[22rem]">
				{sampleItems.map((item) => (
					<BentoCard
						background={item.background}
						className={item.className}
						cta={item.cta}
						description={item.description}
						href={item.href}
						Icon={item.Icon}
						key={item.name}
						name={item.name}
					/>
				))}
			</BentoGrid>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Classic 2+1 / 1+2 bento layout with four feature cards. Hover a card on desktop to reveal the CTA.",
			},
		},
	},
};

export const SingleCard: Story = {
	render: () => (
		<div className="bg-surface p-8">
			<BentoGrid>
				<BentoCard
					background={
						<div className="relative h-44 overflow-hidden bg-surface-navy/5">
							<div className="absolute -top-10 -right-10 h-48 w-48 rounded-full border border-foreground-primary/8" />
						</div>
					}
					className="col-span-3 lg:col-span-1"
					cta="Ver como funciona"
					description="Empresa verificada com CNPJ em dois dias. Sem burocracia, sem visita presencial."
					href="/"
					Icon={ShieldCheck}
					name="Validação em até 48h"
				/>
			</BentoGrid>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"A single narrow card (`col-span-1`), useful for isolated inspection.",
			},
		},
	},
};
