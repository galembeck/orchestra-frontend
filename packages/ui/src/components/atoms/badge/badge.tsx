import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
	base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 font-inter font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-3",
	variants: {
		variant: {
			default: "border-transparent bg-foreground-primary text-surface",
			secondary: "border-border bg-surface-secondary text-foreground-secondary",
			outline: "border-border bg-transparent text-foreground-primary",
			accent: "border-accent/20 bg-surface-accent-soft text-foreground-accent",
			success: "border-success/30 bg-success/10 text-success",
			warning: "border-warning/30 bg-warning/10 text-warning",
			danger: "border-danger/30 bg-danger/10 text-danger",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface BadgeProps
	extends ComponentProps<"span">,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

export function Badge({
	className,
	variant = "default",
	asChild = false,
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			className={twMerge(badgeVariants({ variant }), className)}
			data-slot="badge"
			data-variant={variant}
			{...props}
		/>
	);
}
