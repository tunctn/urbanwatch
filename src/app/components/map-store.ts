import { type MapViewState, type UserCoords, saveToLocalStorage } from "@/utils/local-storage";
import { create } from "zustand";

interface MapCoords {
	lat: number;
	lng: number;
}

interface ContextMenu {
	open: boolean;
	spawnCoords: { x: number; y: number };
	mapCoords: MapCoords;
}

// Istanbul's coordinates
export const defaultViewState: MapViewState = {
	center: [29.026005309371357, 41.01624869192369],
	zoom: 11.5,
	pitch: 0,
	bearing: 0,
};

interface SetViewStateArgs {
	viewState: MapViewState;
	saveCookie?: boolean;
}

interface MapStore {
	map: mapboxgl.Map;
	setMap: (map: mapboxgl.Map) => void;

	isDraggingCompass: boolean;
	setIsDraggingCompass: (isDragging: boolean) => void;

	viewState: MapViewState;
	setViewState: (args: SetViewStateArgs) => void;

	contextMenu: ContextMenu;
	setContextMenu: (contextMenu: ContextMenu) => void;

	userCoords: MapCoords;
	setUserCoords: (userCoords: MapCoords) => void;

	locateUser: () => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
	map: {} as mapboxgl.Map,
	setMap: (map: mapboxgl.Map) => set({ map }),

	isDraggingCompass: false,
	setIsDraggingCompass: (isDragging: boolean) => set({ isDraggingCompass: isDragging }),

	userCoords: { lat: 0, lng: 0 },
	setUserCoords: (userCoords) => set({ userCoords }),

	// Istanbul's coordinates
	viewState: defaultViewState,
	setViewState: (args) => {
		if (args.saveCookie) saveToLocalStorage("map-view-state", args.viewState);

		set({ viewState: args.viewState });
	},

	contextMenu: {
		open: false,
		spawnCoords: { x: 0, y: 0 },
		mapCoords: { lat: 0, lng: 0 },
	},
	setContextMenu: (contextMenu) => {
		set({ contextMenu: { ...contextMenu } });
	},

	locateUser: () => {
		if (!get().map) return;
		if (!("geolocation" in navigator)) return;

		navigator.geolocation.getCurrentPosition((position) => {
			const userCoords: UserCoords = [position.coords.longitude, position.coords.latitude];

			const mapViewState: MapViewState = {
				center: userCoords,
				zoom: 15.5,
				pitch: 0,
				bearing: 0,
			};

			saveToLocalStorage("last-user-coords", userCoords);
			set({ userCoords: { lat: userCoords[1], lng: userCoords[0] } });
			get().setViewState({ viewState: mapViewState, saveCookie: true });
			get().map.easeTo(mapViewState);
		});
	},
}));
