import type { ServiceDTO } from "@repo/core/models/service.model";
import {
	Map as MapComponent,
	MapMarker,
	MarkerContent,
} from "@repo/ui/components/organisms/map/map";
import { MapPin } from "lucide-react";

interface ServicesMapProps {
	services: ServiceDTO[];
	userLocation: { lat: number; lng: number } | null;
}

// São Paulo as fallback center
const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];

export function ServicesMap({ services, userLocation }: ServicesMapProps) {
	const center: [number, number] = userLocation
		? [userLocation.lng, userLocation.lat]
		: DEFAULT_CENTER;

	const serviceMarkers = services.filter(
		(s): s is ServiceDTO & { latitude: number; longitude: number } =>
			s.latitude != null && s.longitude != null,
	);

	return (
		<div className="flex h-full flex-1">
			<MapComponent center={center} zoom={12}>
				{serviceMarkers.map((s) => (
					<MapMarker key={s.id} latitude={s.latitude} longitude={s.longitude}>
						<MarkerContent>
							<MapPin className="h-4 w-4 text-accent" />
						</MarkerContent>
					</MapMarker>
				))}
			</MapComponent>
		</div>
	);
}
