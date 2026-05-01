import { Copy, Link2 } from "lucide-react";

export function IncompletePartitureCard() {
	const url = "orchestra.com.br/services/lost-city";

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
		} catch (err) {
			console.error("Falha ao copiar: ", err);
		}
	};

	return (
		<div className="hidden w-1/2 items-center justify-center xl:flex">
			<div
				className="relative overflow-hidden rounded-3xl bg-surface-navy"
				style={{ width: 480, height: 520 }}
			>
				{[130, 200, 270, 340, 410].map((y) => (
					<div
						className="absolute left-0 h-px w-full bg-border-on-navy"
						key={y}
						style={{ top: y }}
					/>
				))}

				<div
					className="absolute flex items-center gap-2 rounded-full border border-border-on-navy bg-surface-navy-2 px-3 py-1.5"
					style={{ top: 24, left: 24 }}
				>
					<span className="h-1.5 w-1.5 rounded-full bg-warning" />
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-inverse uppercase tracking-[1.5px]">
						Partitura incompleta
					</span>
				</div>

				<span
					className="absolute font-instrument-serif text-foreground-inverse italic"
					style={{
						fontSize: 280,
						letterSpacing: -12,
						top: 80,
						left: 64,
						lineHeight: 1,
					}}
				>
					404
				</span>

				{/** biome-ignore lint/a11y/noSvgWithoutTitle: not required in this context */}
				<svg
					className="absolute left-0"
					fill="none"
					height={90}
					style={{ top: 240 }}
					viewBox="0 0 480 90"
					width={480}
				>
					<path
						d="M0 45c60-45 120 45 180 0 60-45 120 45 180 0 60-45 120 45 120 0"
						stroke="var(--color-foreground-inverse-muted)"
						strokeWidth={2.5}
					/>
				</svg>

				<div
					className="absolute flex items-center justify-between rounded-[10px] border border-border-on-navy bg-surface-navy-2"
					style={{
						top: 456,
						left: 24,
						width: 432,
						height: 40,
						padding: "10px 16px",
					}}
				>
					<div className="flex items-center gap-2.5">
						<Link2 className="h-[13px] w-[13px] text-foreground-inverse-muted" />
						<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-inverse-muted">
							{url}
						</span>
					</div>

					<button
						className="transition-opacity hover:opacity-70"
						onClick={handleCopy}
						title="Copiar link"
						type="button"
					>
						<Copy className="h-[13px] w-[13px] cursor-pointer text-foreground-inverse-muted" />
					</button>
				</div>
			</div>
		</div>
	);
}
