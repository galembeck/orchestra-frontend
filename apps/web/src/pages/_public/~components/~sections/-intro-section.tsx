import { Highlighter } from "@repo/ui/components/atoms/highlighter/highlighter";
import { Fragment } from "react/jsx-runtime";
import { PlaceholderCard } from "@/components/molecules/placeholder-card/placeholder-card";
import { platformDetails } from "@/constants/_public/platform-details";
import { SearchBlock } from "../-search-block";

export function IntroSection() {
	const isMobile = window.matchMedia("	(max-width: 768px)");

	return (
		<section
			className="flex flex-col gap-12 px-5 py-10 lg:px-20 lg:py-14"
			id="intro"
		>
			<div className="flex flex-col items-start gap-12 lg:flex-row">
				<article className="flex flex-col gap-12">
					<div className="flex items-center gap-3.5 font-jetbrains-mono font-medium text-foreground-tertiary text-xs uppercase tracking-[1.5px]">
						{platformDetails.map((item, index) => (
							<Fragment key={item}>
								<span>{item}</span>

								{index < platformDetails.length - 1 && (
									<span aria-hidden="true">·</span>
								)}
							</Fragment>
						))}
					</div>

					<h1 className="font-instrument-serif text-5xl text-foreground-primary md:text-6xl lg:text-7xl">
						Componha o serviço{" "}
						<span className="text-surface-accent italic">certo</span>, com a
						empresa <span className="text-surface-accent italic">certa</span>,
						na hora{" "}
						<Highlighter action="underline" color="#2547D0">
							certa
						</Highlighter>
						.
					</h1>

					<p className="font-inter text-foreground-secondary">
						Encontre profissionais verificados perto de você. Acompanhe o
						serviço em tempo real, converse direto pelo app e pague pelo PIX —
						tudo em um só lugar.
					</p>

					{isMobile && <SearchBlock />}
				</article>

				<PlaceholderCard />

				{!isMobile && <SearchBlock />}
			</div>
		</section>
	);
}
