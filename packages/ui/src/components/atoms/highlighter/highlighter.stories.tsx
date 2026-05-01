import type { Meta, StoryObj } from "@storybook/react-vite";
import { Highlighter } from "./highlighter";

const meta = {
	title: "Atoms/Highlighter",
	component: Highlighter,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Wraps inline text with a `rough-notation` annotation that draws hand-drawn-style marks (highlight, underline, box, circle, etc.). Animates on mount or when scrolled into view when `isView` is enabled.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		action: {
			control: "select",
			options: [
				"highlight",
				"underline",
				"box",
				"circle",
				"strike-through",
				"crossed-off",
				"bracket",
			],
			description: "The rough-notation annotation type to draw",
			table: {
				defaultValue: { summary: "highlight" },
			},
		},
		color: {
			control: "color",
			description: "Color of the annotation stroke or fill",
			table: {
				defaultValue: { summary: "#ffd1dc" },
			},
		},
		strokeWidth: {
			control: { type: "number", min: 0.5, max: 6, step: 0.5 },
			description: "Width of the annotation stroke in pixels",
			table: {
				defaultValue: { summary: "1.5" },
			},
		},
		animationDuration: {
			control: { type: "number", min: 100, max: 3000, step: 100 },
			description: "Duration of the draw animation in milliseconds",
			table: {
				defaultValue: { summary: "600" },
			},
		},
		iterations: {
			control: { type: "number", min: 1, max: 5, step: 1 },
			description:
				"Number of times the annotation is redrawn to create a rougher look",
			table: {
				defaultValue: { summary: "2" },
			},
		},
		padding: {
			control: { type: "number", min: 0, max: 20, step: 1 },
			description: "Padding between the element boundary and the annotation",
			table: {
				defaultValue: { summary: "2" },
			},
		},
		multiline: {
			control: "boolean",
			description: "Whether the annotation should span across multiple lines",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		isView: {
			control: "boolean",
			description:
				"When true, the annotation only draws when the element scrolls into view",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		children: {
			control: "text",
			description: "The inline text content to annotate",
		},
	},
	args: {
		children: "highlighted text",
		action: "highlight",
		color: "#ffd1dc",
		strokeWidth: 1.5,
		animationDuration: 600,
		iterations: 2,
		padding: 2,
		multiline: true,
		isView: false,
	},
} satisfies Meta<typeof Highlighter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<p className="font-medium text-xl">
			Ship features with <Highlighter {...args} />.
		</p>
	),
};

export const Underline: Story = {
	args: {
		action: "underline",
		color: "#4f46e5",
		children: "underlined text",
	},
	render: (args) => (
		<p className="font-medium text-xl">
			This is <Highlighter {...args} />.
		</p>
	),
};

export const Box: Story = {
	args: {
		action: "box",
		color: "#f59e0b",
		children: "boxed term",
	},
	render: (args) => (
		<p className="font-medium text-xl">
			Focus on the <Highlighter {...args} /> here.
		</p>
	),
};

export const Circle: Story = {
	args: {
		action: "circle",
		color: "#10b981",
		children: "circled",
	},
	render: (args) => (
		<p className="font-medium text-xl">
			This word is <Highlighter {...args} />.
		</p>
	),
};

export const StrikeThrough: Story = {
	args: {
		action: "strike-through",
		color: "#ef4444",
		children: "old pricing",
	},
	render: (args) => (
		<p className="font-medium text-xl">
			Forget the <Highlighter {...args} /> — now it's free.
		</p>
	),
};

export const AllActions: Story = {
	render: () => (
		<div className="flex flex-col gap-6 font-medium text-lg">
			<p>
				<Highlighter action="highlight" color="#ffd1dc">
					highlight
				</Highlighter>
			</p>
			<p>
				<Highlighter action="underline" color="#4f46e5">
					underline
				</Highlighter>
			</p>
			<p>
				<Highlighter action="box" color="#f59e0b">
					box
				</Highlighter>
			</p>
			<p>
				<Highlighter action="circle" color="#10b981">
					circle
				</Highlighter>
			</p>
			<p>
				<Highlighter action="strike-through" color="#ef4444">
					strike-through
				</Highlighter>
			</p>
			<p>
				<Highlighter action="crossed-off" color="#8b5cf6">
					crossed-off
				</Highlighter>
			</p>
			<p>
				<Highlighter action="bracket" color="#0ea5e9">
					bracket
				</Highlighter>
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All seven annotation types rendered together.",
			},
		},
	},
};

export const Multiline: Story = {
	args: {
		action: "highlight",
		color: "#bbf7d0",
		multiline: true,
		children:
			"a phrase that wraps across multiple lines to show the multiline annotation behaviour",
	},
	render: (args) => (
		<p className="max-w-xs font-medium text-xl leading-relaxed">
			This is <Highlighter {...args} />.
		</p>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When `multiline` is true the annotation follows the text across line breaks.",
			},
		},
	},
};
