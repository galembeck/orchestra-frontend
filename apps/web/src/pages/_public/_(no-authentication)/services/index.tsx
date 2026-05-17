import { useServices } from "@repo/core/hooks/services/use-services";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ServicesListing } from "./~components/services-content/-services-listing";
import { ServicesMap } from "./~components/services-content/-services-map";
import { SearchHeader } from "./~components/services-header/-search-header";

export const Route = createFileRoute("/_public/_(no-authentication)/services/")(
	{
		component: ServicesPage,
	},
);

type LocationState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "granted"; lat: number; lng: number }
	| { status: "denied"; error: string };

function useUserLocation(): LocationState {
	const [state, setState] = useState<LocationState>({ status: "idle" });

	useEffect(() => {
		if (!navigator.geolocation) {
			setState({ status: "denied", error: "Geolocalização não suportada." });
			return;
		}
		setState({ status: "loading" });
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				setState({
					status: "granted",
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				}),
			() =>
				setState({ status: "denied", error: "Localização não autorizada." }),
			{ timeout: 10000 },
		);
	}, []);

	return state;
}

function ServicesPage() {
	const location = useUserLocation();
	const { data: services = [] } = useServices();

	const userCoords =
		location.status === "granted"
			? { lat: location.lat, lng: location.lng }
			: null;

	return (
		<main className="flex h-screen flex-col overflow-hidden">
			<SearchHeader servicesCount={services.length} />

			<div className="flex min-h-0 flex-col gap-5 lg:flex-row lg:gap-0">
				<ServicesListing
					locationStatus={location.status}
					services={services}
					userLocation={userCoords}
				/>
				<ServicesMap services={services} userLocation={userCoords} />
			</div>
		</main>
	);
}
