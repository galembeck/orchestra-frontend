import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../../../lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
	className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
	background: ReactNode;
	className: string;
	cta: string;
	description: string;
	href: string;
	Icon: React.ElementType;
	name: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => (
	<div
		className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}
		{...props}
	>
		{children}
	</div>
);

const BentoCard = ({
	name,
	className,
	background,
	Icon,
	description,
	href,
	cta,
	...props
}: BentoCardProps) => (
	<div
		className={cn(
			"group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
			"border border-border bg-surface-raised",
			"transform-gpu dark:border-border-on-navy dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
			className
		)}
		{...props}
	>
		<div>{background}</div>

		<div className="p-4">
			<div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
				<Icon className="h-12 w-12 origin-left transform-gpu text-foreground-primary transition-all duration-300 ease-in-out group-hover:scale-75" />
				<h3 className="font-inter font-semibold text-foreground-primary text-xl">
					{name}
				</h3>
				<p className="max-w-lg font-inter text-foreground-secondary text-sm">
					{description}
				</p>
			</div>

			<div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
				<a
					className="pointer-events-auto inline-flex items-center font-inter font-medium text-foreground-primary text-sm hover:underline hover:underline-offset-4"
					href={href}
				>
					{cta}
					<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
				</a>
			</div>
		</div>

		<div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
			<a
				className="pointer-events-auto inline-flex items-center font-inter font-medium text-foreground-primary text-sm hover:underline hover:underline-offset-4"
				href={href}
			>
				{cta}
				<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
			</a>
		</div>

		<div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
	</div>
);

export type { BentoCardProps, BentoGridProps };
export { BentoCard, BentoGrid };
