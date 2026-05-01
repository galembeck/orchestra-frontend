import { companyNumbers } from "@/constants/_public/company-numbers";

export function CompanyNumbersSection() {
	return (
		<section
			className="bg-surface px-5 py-10 lg:px-20 lg:py-14"
			id="company-numbers"
		>
			<div className="grid grid-cols-2 gap-8 lg:flex lg:items-center lg:justify-between">
				{companyNumbers.map(({ value, label }) => (
					<div className="flex flex-col gap-1.5" key={label}>
						<span className="font-instrument-serif text-[38px] text-foreground-primary leading-none tracking-tight">
							{value}
						</span>

						<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary tracking-[1.5px]">
							{label}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
