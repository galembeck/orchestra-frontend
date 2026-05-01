import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/badge/badge";
import { Button } from "../../atoms/button/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

const meta = {
	title: "Molecules/Card",
	component: Card,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Flexible container composed of `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter` sub-components. Supports a `sm` size variant for compact contexts.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
			description: "Controls padding and font sizes across all sub-components",
			table: {
				defaultValue: { summary: "default" },
			},
		},
	},
	args: {
		size: "default",
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Card className="w-80" {...args}>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>A short description of this card.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-foreground-secondary text-sm">
					Content goes here. This area holds the primary information or
					interactive elements of the card.
				</p>
			</CardContent>
		</Card>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Card className="w-80" {...args}>
			<CardHeader>
				<CardTitle>Plan Overview</CardTitle>
				<CardDescription>Your current subscription details.</CardDescription>
				<CardAction>
					<Badge variant="accent">Pro</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p className="text-foreground-secondary text-sm">
					Unlimited requests · Priority support · Advanced analytics
				</p>
			</CardContent>
		</Card>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`CardAction` occupies the top-right cell of the header grid — useful for badges or icon buttons.",
			},
		},
	},
};

export const WithFooter: Story = {
	render: (args) => (
		<Card className="w-80" {...args}>
			<CardHeader>
				<CardTitle>New Service Request</CardTitle>
				<CardDescription>
					Fill in the details to schedule your service.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-foreground-secondary text-sm">
					Estimated arrival: today between 14h–16h.
				</p>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="secondary" size="sm">
					Cancel
				</Button>
				<Button variant="primary" size="sm">
					Confirm
				</Button>
			</CardFooter>
		</Card>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`CardFooter` renders on a `bg-surface-secondary` strip separated by a border — ideal for action rows.",
			},
		},
	},
};

export const SmallSize: Story = {
	args: { size: "sm" },
	render: (args) => (
		<Card className="w-72" {...args}>
			<CardHeader>
				<CardTitle>Quick Summary</CardTitle>
				<CardDescription>Compact card for dense layouts.</CardDescription>
				<CardAction>
					<Badge variant="success">Live</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p className="text-foreground-secondary text-sm">
					Reduced padding and smaller typography across all sub-components.
				</p>
			</CardContent>
			<CardFooter className="justify-end">
				<Button variant="secondary" size="sm">
					View details
				</Button>
			</CardFooter>
		</Card>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`size="sm"` tightens padding and reduces the title font size — use in sidebars or list views.',
			},
		},
	},
};

export const StatusCard: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(
				[
					{
						title: "Payment received",
						desc: "Invoice #4821 was paid successfully.",
						badge: "success" as const,
						label: "Paid",
					},
					{
						title: "Awaiting approval",
						desc: "Your request is under review.",
						badge: "warning" as const,
						label: "Pending",
					},
					{
						title: "Service failed",
						desc: "The technician could not access the site.",
						badge: "danger" as const,
						label: "Failed",
					},
				] as const
			).map(({ title, desc, badge, label }) => (
				<Card className="w-72" key={title}>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{desc}</CardDescription>
						<CardAction>
							<Badge variant={badge}>{label}</Badge>
						</CardAction>
					</CardHeader>
				</Card>
			))}
		</div>
	),
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story: "Cards combined with semantic Badge variants for status display.",
			},
		},
	},
};
