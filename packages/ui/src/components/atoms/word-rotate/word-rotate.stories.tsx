import type { Meta, StoryObj } from "@storybook/react-vite";
import { WordRotate } from "./word-rotate";

const meta = {
	title: "Atoms/WordRotate",
	component: WordRotate,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Cycles through an array of words with an animated enter/exit transition powered by `motion/react`. Useful for hero headlines that rotate through key phrases.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		words: {
			control: "object",
			description: "Array of strings to cycle through",
		},
		duration: {
			control: { type: "number", min: 500, max: 10_000, step: 500 },
			description: "Time in milliseconds each word is visible before rotating",
			table: {
				defaultValue: { summary: "2500" },
			},
		},
		motionProps: {
			control: "object",
			description:
				"Framer Motion props applied to each word (`initial`, `animate`, `exit`, `transition`)",
		},
		className: {
			control: "text",
			description: "Additional classes applied to the `<motion.h1>` element",
		},
	},
	args: {
		words: ["fast.", "reliable.", "simple."],
		duration: 2500,
	},
} satisfies Meta<typeof WordRotate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HeroHeadline: Story = {
	args: {
		words: ["residencial.", "empresarial.", "industrial."],
		className: "text-4xl font-afacad font-semibold text-foreground-primary",
		duration: 2000,
	},
	render: (args) => (
		<div className="flex items-baseline gap-2 font-semibold text-4xl">
			<span className="font-afacad text-foreground-primary">Serviços</span>
			<WordRotate {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Composing `WordRotate` inline with static text to build a rotating hero headline.",
			},
		},
	},
};

export const SlowRotation: Story = {
	args: {
		words: ["Trusted.", "Transparent.", "On-time."],
		duration: 4000,
		className: "text-2xl font-inter font-medium text-foreground-secondary",
	},
	parameters: {
		docs: {
			description: {
				story: "Slower `duration` for calmer, less distracting rotation.",
			},
		},
	},
};

export const CustomAnimation: Story = {
	args: {
		words: ["Schedule.", "Track.", "Pay."],
		duration: 1800,
		className: "text-3xl font-inter font-bold text-foreground-accent",
		motionProps: {
			initial: { opacity: 0, scale: 0.8 },
			animate: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 1.2 },
			transition: { duration: 0.2, ease: "easeInOut" },
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Custom `motionProps` replacing the default slide with a scale-in/scale-out effect.",
			},
		},
	},
};
