import { createApp, h, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import TruckPopup from '../Components/Map/TruckPopup.vue';
import type { Bounds } from './useTrucks';
// Type-only import — erased at build time, safe en SSR
import type L_NS from 'leaflet';

type BoundsCallback = (bounds: Bounds | null) => void;
type TruckClickCallback = (truck: any, location: any) => void;

// Instance Leaflet chargée dynamiquement (Node.js n'a pas de window)
let _L: typeof L_NS | null = null;

async function loadLeaflet(): Promise<typeof L_NS> {
    if (_L) return _L;
    const { default: leaflet } = await import('leaflet');
    _L = leaflet;
    await import('leaflet.markercluster');
    return _L;
}

export function useMap(containerRef: Ref<HTMLElement | null>) {
    let map: L_NS.Map | null = null;
    let clusterGroup: L_NS.MarkerClusterGroup | null = null;
    let onTruckClickCallback: TruckClickCallback | null = null;
    let onBoundsChangeCallback: BoundsCallback | null = null;
    let userMarker: L_NS.Marker | null = null;
    let userAccuracyCircle: L_NS.Circle | null = null;
    let skipMoveEndUntil = 0;
    const popupApps: ReturnType<typeof createApp>[] = [];

    const mountPopup = (truck: any, location: any): HTMLDivElement => {
        const el = document.createElement('div');
        const app = createApp({
            render: () => h(TruckPopup, { truck, location }),
        });
        app.mount(el);
        popupApps.push(app);

        return el;
    };

    const unmountPopups = (): void => {
        popupApps.forEach((app) => app.unmount());
        popupApps.length = 0;
    };

    const init = async (onBoundsChange: BoundsCallback | null = null): Promise<void> => {
        onBoundsChangeCallback = onBoundsChange;

        if (!containerRef.value) return;

        const L = await loadLeaflet();

        map = L.map(containerRef.value, {
            center: [46.603354, 1.888334],
            zoom: 6,
            zoomControl: false,
        });

        // Esri World Light Gray : fond clair sans clé API.
        // Tuiles natives jusqu'au zoom 16 seulement, Leaflet agrandit au-delà.
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            {
                attribution:
                    'Tiles © <a href="https://www.esri.com/">Esri</a> — Esri, DeLorme, NAVTEQ',
                maxZoom: 19,
                maxNativeZoom: 16,
            },
        ).addTo(map);

        L.control
            .zoom({
                position: 'bottomright',
                zoomInTitle: 'Zoomer',
                zoomOutTitle: 'Dézoomer',
            })
            .addTo(map);

        clusterGroup = L.markerClusterGroup({
            iconCreateFunction: (cluster) =>
                L.divIcon({
                    html: `<div class="truck-cluster">${cluster.getChildCount()}</div>`,
                    className: '',
                    iconSize: L.point(40, 40),
                }),
            showCoverageOnHover: false,
            maxClusterRadius: 60,
        });

        map.addLayer(clusterGroup);

        map.on('moveend', () => {
            if (!onBoundsChangeCallback || !map) return;
            if (Date.now() < skipMoveEndUntil) return;

            if (map.getZoom() < 10) {
                onBoundsChangeCallback(null);
                return;
            }

            const b = map.getBounds();
            onBoundsChangeCallback({
                minLat: b.getSouth(),
                maxLat: b.getNorth(),
                minLng: b.getWest(),
                maxLng: b.getEast(),
            });
        });
    };

    const setTrucks = (trucks: any[], onClickFn: TruckClickCallback): void => {
        if (!clusterGroup || !_L) return;
        const L = _L;

        onTruckClickCallback = onClickFn;
        unmountPopups();
        clusterGroup.clearLayers();

        const markers: L_NS.Marker[] = trucks.flatMap((truck) =>
            truck.locations.map((loc: any) => {
                const icon = L.divIcon({
                    html: `<div class="truck-marker ${loc.is_open_now ? '' : 'closed'}"><span class="emoji">${truck.cuisine.emoji}</span></div>`,
                    className: '',
                    iconSize: L.point(44, 44),
                    iconAnchor: L.point(22, 44),
                    popupAnchor: L.point(0, -44),
                });

                const marker = L.marker([loc.latitude, loc.longitude], { icon });
                marker.bindPopup(mountPopup(truck, loc), {
                    maxWidth: 260,
                    className: 'truck-leaflet-popup',
                    autoPan: false,
                });
                marker.on('click', () => onTruckClickCallback?.(truck, loc));

                return marker;
            }),
        );

        clusterGroup.addLayers(markers);
    };

    const flyTo = (lat: number | null, lng: number | null, zoom = 14): void => {
        if (!map || lat == null || lng == null) return;

        skipMoveEndUntil = Date.now() + 1500;
        map.flyTo([lat, lng], zoom, { animate: true, duration: 0.6 });
    };

    const showUserLocation = (
        lat: number,
        lng: number,
        accuracy: number | null = null,
    ): void => {
        if (!map || !_L) return;
        const L = _L;

        const icon = L.divIcon({
            html: '<div class="user-location-marker"></div>',
            className: '',
            iconSize: L.point(20, 20),
            iconAnchor: L.point(10, 10),
        });

        if (userMarker) {
            userMarker.setLatLng([lat, lng]);
        } else {
            userMarker = L.marker([lat, lng], { icon }).addTo(map!);
        }

        if (accuracy && accuracy > 50) {
            if (userAccuracyCircle) {
                userAccuracyCircle.setLatLng([lat, lng]).setRadius(accuracy);
            } else {
                userAccuracyCircle = L.circle([lat, lng], {
                    radius: accuracy,
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.08,
                    weight: 1,
                }).addTo(map!);
            }
        }
    };

    const removeUserLocation = (): void => {
        if (userMarker) {
            map?.removeLayer(userMarker);
            userMarker = null;
        }

        if (userAccuracyCircle) {
            map?.removeLayer(userAccuracyCircle);
            userAccuracyCircle = null;
        }
    };

    const getMap = (): L_NS.Map | null => map;

    onUnmounted(() => {
        unmountPopups();
        map?.remove();
        map = null;
        clusterGroup = null;
        userMarker = null;
        userAccuracyCircle = null;
    });

    return {
        init,
        setTrucks,
        flyTo,
        showUserLocation,
        removeUserLocation,
        getMap,
    };
}
