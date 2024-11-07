"use client";

import { env } from "@/lib/env";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

export const MapBox = () => {
	const mapContainer = useRef(null);

	useEffect(() => {
		if (mapContainer.current) {
			const map = new mapboxgl.Map({
				container: mapContainer.current, // container ID
				style: "mapbox://styles/urbanwatch/cm31x17eo00c001qtc27eegcz", // style URL
				accessToken: env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
			});

			return () => map.remove();
		}
	}, []);

	return <div className="h-full w-full" ref={mapContainer} />;
};
