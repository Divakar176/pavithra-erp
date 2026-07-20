import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom truck icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/815/815599.png', // A simple truck icon
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const LiveFleetMap = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/trips/active/locations');
                setLocations(res.data);
            } catch (err) {
                console.error("Failed to fetch fleet locations", err);
            }
        };

        // Fetch immediately
        fetchLocations();

        // Refresh every 5 seconds
        const interval = setInterval(fetchLocations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Default center to Chennai if no trucks are active
    const defaultCenter = [13.0827, 80.2707];

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative z-0">
            <MapContainer 
                center={locations.length > 0 ? [locations[0].currentLatitude, locations[0].currentLongitude] : defaultCenter} 
                zoom={7} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {locations.map((trip) => (
                    <Marker 
                        key={trip.id} 
                        position={[trip.currentLatitude, trip.currentLongitude]}
                        icon={truckIcon}
                    >
                        <Popup>
                            <div className="font-sans">
                                <h3 className="font-bold text-gray-900 mb-1">{trip.vehicle?.vehicleNumber}</h3>
                                <p className="text-sm text-gray-600 m-0">Driver: {trip.driver?.username}</p>
                                <p className="text-sm text-gray-600 m-0">Route: {trip.source} → {trip.destination}</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                                    Last Update: {new Date(trip.lastLocationUpdate).toLocaleTimeString()}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default LiveFleetMap;
