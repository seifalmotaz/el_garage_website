"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const defaultPosition: [number, number] = [30.0444, 31.2357]; // Cairo

// Fix marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center]);

  return null;
}

export default function Map() {
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const getLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords: [number, number] = [
        pos.coords.latitude,
        pos.coords.longitude,
      ];
      setPosition(coords);
    });
  };

  return (
    <div className="space-y-3">
      <MapContainer
        center={position}
        zoom={13}
        className="h-[250px] w-full rounded-xl overflow-hidden"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={position} />
        <ChangeView center={position} />
      </MapContainer>

      <button
        onClick={getLocation}
        className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg text-sm"
      >
        📍 تحديد موقعي الحالي
      </button>
    </div>
  );
}
