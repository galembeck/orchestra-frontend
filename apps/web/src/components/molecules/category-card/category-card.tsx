import { Card } from "@repo/ui/components/molecules/card/card";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
	category: string;
	icon: LucideIcon;
	professionalsCount: number;
}

export function CategoryCard({
	icon: Icon,
	category,
	professionalsCount,
}: CategoryCardProps) {
	return (
		<Card className="p-5">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
				<Icon />
			</div>

			<article>
				<h3 className="font-inter font-semibold text-foreground-primary text-lg">
					{category}
				</h3>

				<p className="font-jetbrains-mono text-foreground-tertiary text-xs">
					{professionalsCount} profissionais
				</p>
			</article>
		</Card>
	);
}
