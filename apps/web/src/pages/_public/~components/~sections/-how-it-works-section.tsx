import { HowItWorksCard } from "@/components/molecules/how-it-works-card/how-it-works-card";
import { howItWorks } from "@/constants/_public/how-it-works";

export function HowItWorksSection() {
	return (
		<section
			className="bg-surface-navy dark:bg-surface-navy-2"
			id="how-it-works"
		>
			<div className="flex flex-col gap-12 px-5 py-10 lg:px-20 lg:py-14">
				<article className="flex flex-col gap-2.5">
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-inverse-muted! uppercase tracking-[1.5px]">
						Como funciona · 3 passos
					</span>

					<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
						<h1 className="font-instrument-serif text-5xl text-foreground-inverse">
							Do primeiro toque ao serviço concluído.
						</h1>

						<p className="flex w-full justify-end font-inter font-medium text-foreground-inverse-muted text-sm lg:max-w-[380px]">
							Sem WhatsApp confuso, sem orçamento em papel. Tudo registrado,
							rastreável e pago em um só lugar - para quem precisa do serviço e
							para quem entrega.
						</p>
					</div>
				</article>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{howItWorks.map((item, index) => (
						<HowItWorksCard
							description={item.description}
							icon={item.icon}
							index={item.index}
							// biome-ignore lint/suspicious/noArrayIndexKey: necessary due to index being a string
							key={index}
							title={item.title}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
