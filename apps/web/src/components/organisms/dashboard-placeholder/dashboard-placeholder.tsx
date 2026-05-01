import { chartBars } from "@/constants/components/organisms/chart-bars";
import { upcomingOrders } from "@/constants/components/organisms/upcoming-orders";

export function BusinessDashboardPreview() {
	return (
		<div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-surface-paper-soft p-6">
			<div className="flex items-center justify-between">
				<span className="font-inter font-semibold text-foreground-primary text-sm">
					Painel HidroFix
				</span>
				<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary tracking-[1px]">
					HOJE · 14:32
				</span>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-surface p-3.5">
					<span className="font-jetbrains-mono font-medium text-[9px] text-foreground-tertiary uppercase tracking-[1px]">
						Receita
					</span>
					<span className="font-instrument-serif text-foreground-primary text-lg">
						R$ 24.580
					</span>
					<span className="font-jetbrains-mono font-semibold text-[11px] text-success">
						↑ 12.4%
					</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-surface p-3.5">
					<span className="font-jetbrains-mono font-medium text-[9px] text-foreground-tertiary uppercase tracking-[1px]">
						Pedidos
					</span>
					<span className="font-instrument-serif text-foreground-primary text-lg">
						38
					</span>
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-secondary">
						+6 hoje
					</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-surface p-3.5">
					<span className="font-jetbrains-mono font-medium text-[9px] text-foreground-tertiary uppercase tracking-[1px]">
						Avaliação
					</span>
					<span className="font-instrument-serif text-foreground-primary text-lg">
						4.9
					</span>
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-secondary">
						312 reviews
					</span>
				</div>
			</div>

			<div className="flex flex-col gap-3.5 rounded-[10px] border border-border bg-surface p-4">
				<div className="flex items-center justify-between">
					<span className="font-inter font-semibold text-foreground-primary text-xs">
						Receita · 7 dias
					</span>
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary">
						R$ 24.580
					</span>
				</div>

				<div className="flex h-20 items-end gap-2">
					{chartBars.map((bar, i) => (
						<div
							className={`flex-1 rounded-sm ${bar.color}`}
							// biome-ignore lint/suspicious/noArrayIndexKey: chart bars are positional
							key={i}
							style={{ height: `${bar.height}px` }}
						/>
					))}
				</div>

				<div className="flex gap-2">
					{chartBars.map((bar, i) => (
						<span
							className={`flex-1 text-center font-jetbrains-mono text-[10px] ${bar.today ? "font-semibold text-foreground-primary" : "text-foreground-tertiary"}`}
							// biome-ignore lint/suspicious/noArrayIndexKey: chart labels are positional
							key={i}
						>
							{bar.label}
						</span>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-[10px] border border-border bg-surface p-4">
				<div className="flex items-center justify-between">
					<span className="font-inter font-semibold text-foreground-primary text-xs">
						Próximos serviços
					</span>
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary">
						4 hoje
					</span>
				</div>

				{upcomingOrders.map((order) => (
					<div className="flex items-center gap-2.5" key={order.time}>
						<span className="font-jetbrains-mono font-semibold text-[11px] text-foreground-primary">
							{order.time}
						</span>
						<div className="flex flex-1 flex-col gap-0.5">
							<span className="font-inter font-medium text-foreground-primary text-xs">
								{order.title}
							</span>
							<span className="font-inter text-[11px] text-foreground-tertiary">
								{order.subtitle}
							</span>
						</div>
						<span
							className={`rounded-full px-2 py-[3px] font-jetbrains-mono font-semibold text-[10px] ${order.statusClass}`}
						>
							{order.status}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
