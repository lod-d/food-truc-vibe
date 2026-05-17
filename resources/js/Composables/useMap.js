import { onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

export function useMap(containerRef) {
    let map = null
    let clusterGroup = null
    let onTruckClickCallback = null
    let userMarker = null

    const init = () => {
        map = L.map(containerRef.value, {
            center: [46.603354, 1.888334],
            zoom: 6,
            zoomControl: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19,
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)

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
    }

    const setTrucks = (trucks, onClickFn) => {
        if (!clusterGroup) return
        onTruckClickCallback = onClickFn

        clusterGroup.clearLayers()

        const markers = trucks.flatMap((truck) =>
            truck.locations.map((loc) => {
                const icon = L.divIcon({
                    html: `<div class="truck-marker ${loc.is_open_now ? '' : 'closed'}"><span class="emoji">${truck.cuisine.emoji}</span></div>`,
                    className: '',
                    iconSize: L.point(40, 40),
                    iconAnchor: L.point(20, 40),
                    popupAnchor: L.point(0, -40),
                })

                const marker = L.marker([loc.latitude, loc.longitude], { icon })
                marker.on('click', () => onTruckClickCallback?.(truck, loc))
                return marker
            })
        )

        clusterGroup.addLayers(markers)
    }

    const flyTo = (lat, lng, zoom = 14) => {
        map?.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 })
    }

    const showUserLocation = (lat, lng) => {
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
    }

    const getMap = () => map

    onUnmounted(() => {
        map?.remove()
        map = null
        clusterGroup = null
        userMarker = null
    })

    return { init, setTrucks, flyTo, showUserLocation, getMap }
}
