import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, Flame, TriangleAlert } from "lucide-react";
import { Badge } from "./badge";

const meta = {
	title: "Atoms/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Compact label for status, category, or metadata. Seven semantic variants built on the design-system color tokens. Supports `asChild` to render as any element (e.g. a link).",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"outline",
				"accent",
				"success",
				"warning",
				"danger",
			],
			description: "Visual style of the badge",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		children: {
			control: "text",
			description: "Label text or content inside the badge",
		},
		asChild: {
			control: "boolean",
			description:
				"When true, renders the badge's child element directly (useful for links)",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
	args: {
		children: "Badge",
		variant: "default",
		asChild: false,
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: "default", children: "Default" },
};

export const Secondary: Story = {
	args: { variant: "secondary", children: "Secondary" },
};

export const Outline: Story = {
	args: { variant: "outline", children: "Outline" },
};

export const Accent: Story = {
	args: { variant: "accent", children: "Accent" },
};

export const Success: Story = {
	args: { variant: "success", children: "Active" },
	render: (args) => (
		<Badge {...args}>
			<CircleCheck />
			{args.children}
		</Badge>
	),
};

export const Warning: Story = {
	args: { variant: "warning", children: "Pending" },
	render: (args) => (
		<Badge {...args}>
			<TriangleAlert />
			{args.children}
		</Badge>
	),
};

export const Danger: Story = {
	args: { variant: "danger", children: "Failed" },
	render: (args) => (
		<Badge {...args}>
			<Flame />
			{args.children}
		</Badge>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge variant="default">Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="accent">Accent</Badge>
			<Badge variant="success">
				<CircleCheck />
				Active
			</Badge>
			<Badge variant="warning">
				<TriangleAlert />
				Pending
			</Badge>
			<Badge variant="danger">
				<Flame />
				Failed
			</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "All seven variants side by side." },
		},
	},
};
