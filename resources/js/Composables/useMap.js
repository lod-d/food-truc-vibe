import L from 'leaflet'
import { createApp, h, onUnmounted } from 'vue'
import 'leaflet.markercluster'
import TruckPopup from '../Components/Map/TruckPopup.vue'

export function useMap(containerRef) {
    let map = null
    let clusterGroup = null
    let onTruckClickCallback = null
    let onBoundsChangeCallback = null
    let userMarker = null
    let userAccuracyCircle = null
    let skipMoveEndUntil = 0
    const popupApps = []

    const mountPopup = (truck, location) => {
        const el = document.createElement('div')
        const app = createApp({ render: () => h(TruckPopup, { truck, location }) })
        app.mount(el)
        popupApps.push(app)

        return el
    }

    const unmountPopups = () => {
        popupApps.forEach(app => app.unmount())
        popupApps.length = 0
    }

    const init = (onBoundsChange = null) => {
        onBoundsChangeCallback = onBoundsChange

        map = L.map(containerRef.value, {
            center: [46.603354, 1.888334],
            zoom: 6,
            zoomControl: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
        }).addTo(map)

        L.control.zoom({ position: 'bottomright', zoomInTitle: 'Zoomer', zoomOutTitle: 'Dézoomer' }).addTo(map)

        clusterGroup = L.markerClusterGroup({
            iconCreateFunction: (cluster) => L.divIcon({
                html: `<div class="truck-cluster">${cluster.getChildCount()}</div>`,
                className: '',
                iconSize: L.point(40, 40),
            }),
            showCoverageOnHover: false,
            maxClusterRadius: 60,
        })

        map.addLayer(clusterGroup)

        map.on('moveend', () => {
            if (!onBoundsChangeCallback) return
            // Skip bounds update during/after programmatic flyTo (window lasts 1.5s to cover animation + any extra events)
            if (Date.now() < skipMoveEndUntil) return

            if (map.getZoom() < 10) {
                onBoundsChangeCallback(null)
                return
            }

            const b = map.getBounds()
            onBoundsChangeCallback({
                minLat: b.getSouth(),
                maxLat: b.getNorth(),
                minLng: b.getWest(),
                maxLng: b.getEast(),
            })
        })
    }

    const setTrucks = (trucks, onClickFn) => {
        if (!clusterGroup) {
return
}

        onTruckClickCallback = onClickFn

        unmountPopups()
        clusterGroup.clearLayers()

        const markers = trucks.flatMap((truck) =>
            truck.locations.map((loc) => {
                const icon = L.divIcon({
                    html: `<div class="truck-marker ${loc.is_open_now ? '' : 'closed'}"><span class="emoji">${truck.cuisine.emoji}</span></div>`,
                    className: '',
                    iconSize: L.point(44, 44),
                    iconAnchor: L.point(22, 44),
                    popupAnchor: L.point(0, -44),
                })

                const marker = L.marker([loc.latitude, loc.longitude], { icon })
                marker.bindPopup(mountPopup(truck, loc), { maxWidth: 260, className: 'truck-leaflet-popup', autopan: false })
                marker.on('click', () => onTruckClickCallback?.(truck, loc))

                return marker
            })
        )

        clusterGroup.addLayers(markers)
    }

    const flyTo = (lat, lng, zoom = 14) => {
        if (!map || lat == null || lng == null) return
        skipMoveEndUntil = Date.now() + 1500
        map.flyTo([lat, lng], zoom, { animate: true, duration: 0.6 })
    }

    const showUserLocation = (lat, lng, accuracy = null) => {
        if (!map) return

        const icon = L.divIcon({
            html: '<div class="user-location-marker"></div>',
            className: '',
            iconSize: L.point(20, 20),
            iconAnchor: L.point(10, 10),
        })

        if (userMarker) {
            userMarker.setLatLng([lat, lng])
        } else {
            userMarker = L.marker([lat, lng], { icon }).addTo(map)
        }

        if (accuracy && accuracy > 50) {
            if (userAccuracyCircle) {
                userAccuracyCircle.setLatLng([lat, lng]).setRadius(accuracy)
            } else {
                userAccuracyCircle = L.circle([lat, lng], {
                    radius: accuracy,
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.08,
                    weight: 1,
                }).addTo(map)
            }
        }
    }

    const removeUserLocation = () => {
        if (userMarker) {
            map?.removeLayer(userMarker)
            userMarker = null
        }
        if (userAccuracyCircle) {
            map?.removeLayer(userAccuracyCircle)
            userAccuracyCircle = null
        }
    }

    const getMap = () => map

    onUnmounted(() => {
        unmountPopups()
        map?.remove()
        map = null
        clusterGroup = null
        userMarker = null
        userAccuracyCircle = null
    })

    return { init, setTrucks, flyTo, showUserLocation, removeUserLocation, getMap }
}
