import { Badge } from "@repo/ui/components/atoms/badge/badge";
import { WordRotate } from "@repo/ui/components/atoms/word-rotate/word-rotate";
import {
	Card,
	CardContent,
	CardHeader,
} from "@repo/ui/components/molecules/card/card";
import { MapPin, Truck } from "lucide-react";

export function PlaceholderCard() {
	return (
		<Card className="hidden flex-col lg:flex lg:max-w-[380px]">
			<CardHeader className="flex items-center justify-between">
				<Badge className="flex items-center gap-2 font-jetbrains-mono font-medium">
					<div className="h-1 w-1 rounded-full bg-success" />A caminho
				</Badge>

				<span className="font-jetbrains-mono font-medium text-foreground-tertiary text-xs tracking-[0.5px]">
					ETA 14 min
				</span>
			</CardHeader>

			<CardContent>
				<div className="flex h-[120px] items-center justify-center rounded-[10px] border border-border bg-surface">
					<Truck className="h-9 w-9 text-foreground-primary" />
				</div>

				<article>
					<h3 className="flex items-center gap-1 font-inter font-semibold text-[15px] text-foreground-primary">
						Carlos ·{" "}
						<WordRotate
							words={[
								"Encanador",
								"Eletricista",
								"Jardinagem",
								"Marceneiro",
								"Pintor",
							]}
						/>
					</h3>

					<p className="font-inter text-[13px] text-foreground-tertiary">
						Serviços e reparos gerais em sua residência/empresa sempre que
						precisar através de nossas empresas parceiras e cadastradas.
					</p>
				</article>

				<article className="mt-3.5 flex items-center gap-2 font-jetbrains-mono text-foreground-secondary text-xs">
					<MapPin className="h-3.5 w-3.5 text-foreground-accent" />
					No trânsito
					<span aria-hidden="true">·</span>
					2.4 km de você
				</article>
			</CardContent>
		</Card>
	);
}
