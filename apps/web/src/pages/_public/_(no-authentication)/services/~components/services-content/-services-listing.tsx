import type { ServiceDTO } from "@repo/core/models/service.model";
import {
	ScrollArea,
	ScrollBar,
} from "@repo/ui/components/atoms/scroll-area/scroll-area";
import { Hammer, type LucideIcon, Paintbrush, Wrench, Zap } from "lucide-react";
import { ServicesListingCard } from "./-services-listing-card";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
	wrench: Wrench,
	hammer: Hammer,
	paintbrush: Paintbrush,
	zap: Zap,
};

function getCategoryIcon(iconName: string): LucideIcon {
	return CATEGORY_ICONS[iconName.toLowerCase()] ?? Wrench;
}

function haversineKm(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface ServicesListingProps {
	locationStatus: "idle" | "loading" | "granted" | "denied";
	services: ServiceDTO[];
	userLocation: { lat: number; lng: number } | null;
}

export function ServicesListing({
	locationStatus,
	services,
	userLocation,
}: ServicesListingProps) {
	const servicesWithDistance = services.map((s) => {
		if (userLocation && s.latitude != null && s.longitude != null) {
			const km = haversineKm(
				userLocation.lat,
				userLocation.lng,
				s.latitude,
				s.longitude,
			);
			return { service: s, distanceKm: km };
		}
		return { service: s, distanceKm: null };
	});

	servicesWithDistance.sort((a, b) => {
		if (a.distanceKm !== null && b.distanceKm !== null) {
			return a.distanceKm - b.distanceKm;
		}
		if (a.distanceKm !== null) return -1;
		if (b.distanceKm !== null) return 1;
		return 0;
	});

	return (
		<div className="h-full w-full min-w-0 shrink-0 border-border border-r lg:w-[600px]">
			<ScrollArea className="h-full">
				<div className="flex flex-col gap-4 px-5 py-3.5 lg:px-20">
					{locationStatus === "loading" && (
						<div className="flex items-center justify-center py-8 font-jetbrains-mono text-foreground-tertiary text-xs">
							Obtendo sua localização...
						</div>
					)}

					{locationStatus === "denied" && (
						<div className="rounded-lg border border-border border-dashed p-3 font-inter text-foreground-tertiary text-xs">
							Localização não autorizada. Serviços exibidos sem ordenação por
							proximidade.
						</div>
					)}

					{servicesWithDistance.length === 0 &&
						locationStatus !== "loading" && (
							<div className="flex flex-col items-center gap-2 py-10 text-center">
								<p className="font-instrument-serif text-foreground-primary text-xl">
									Nenhum serviço encontrado
								</p>
								<p className="font-inter text-foreground-tertiary text-sm">
									Tente novamente mais tarde.
								</p>
							</div>
						)}

					{servicesWithDistance.map(({ service, distanceKm }) => (
						<ServicesListingCard
							key={service.id}
							category={service.categoryName}
							companyName={service.companyFantasyName}
							distance={distanceKm !== null ? distanceKm.toFixed(1) : "—"}
							distanceUnavailable={distanceKm === null}
							estimatedTime={
								distanceKm !== null ? String(Math.round(distanceKm * 3)) : "—"
							}
							icon={getCategoryIcon(service.categoryIcon)}
							neighborhood={service.neighborhood}
							price={
								service.budgetable ? "Sob consulta" : String(service.price ?? 0)
							}
							reviews={{
								rating: service.rating,
								counter: String(service.reviewsCount),
							}}
							serviceType={service.serviceType}
						/>
					))}
				</div>

				<ScrollBar className="hidden" />
			</ScrollArea>
		</div>
	);
}
