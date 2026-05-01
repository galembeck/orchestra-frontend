import {
	Card,
	CardContent,
	CardHeader,
} from "@repo/ui/components/molecules/card/card";
import type { LucideIcon } from "lucide-react";

interface HowItWorksCardProps {
	description: string;
	icon: LucideIcon;
	index: string;
	title: string;
}

export function HowItWorksCard({
	description,
	icon: Icon,
	index,
	title,
}: HowItWorksCardProps) {
	return (
		<Card className="flex h-full flex-col gap-6 border border-border-on-navy bg-surface-navy-2 p-5">
			<CardHeader className="flex items-center justify-between">
				<span className="font-instrument-serif text-4xl text-foreground-inverse">
					{index}
				</span>

				<Icon className="h-5.5 w-5.5 text-foreground-inverse-muted" />
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				<h3 className="font-instrument-serif font-medium text-[22px] text-foreground-inverse">
					{title}
				</h3>

				<p className="font-inter text-foreground-inverse-muted text-sm">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
