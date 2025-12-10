"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useTranslations } from "next-intl";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

interface LocationPickerProps {
  defaultPosition?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number; name: string }) => void;
}

/* ─────────────────────────────────────────────── */
/*               Reverse Geocoding                 */
/* ─────────────────────────────────────────────── */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data?.display_name || "";
  } catch {
    return "";
  }
}

/* ─────────────────────────────────────────────── */
/*                    Search Box                   */
/* ─────────────────────────────────────────────── */
function SearchBox({
  onSelectLocation,
}: {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
}) {
  const t = useTranslations("components.LocationPicker");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) return setResults([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
    );
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[280px]">
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full px-3 py-2 rounded-lg shadow bg-white-50 border text-sm"
      />

      {results.length > 0 && (
        <div className="absolute w-full bg-white-50 shadow rounded-lg mt-1 max-h-60 overflow-auto z-[1001]">
          {results.map((place, i) => (
            <div
              key={i}
              onClick={() => {
                const lat = parseFloat(place.lat);
                const lng = parseFloat(place.lon);
                onSelectLocation(lat, lng, place.display_name);
                setResults([]);
                setQuery(place.display_name);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*               Use My Location Button            */
/* ─────────────────────────────────────────────── */
function UseMyLocationButton({
  onSelectLocation,
}: {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
}) {
  const t = useTranslations("components.LocationPicker");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    console.log({ navigator });
    if (!navigator.geolocation) {
      alert(t("geoNotSupported"));
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = await reverseGeocode(lat, lng);

        onSelectLocation(lat, lng, name);
        setLoading(false);
      },
      (error) => {
        setLoading(false);

        let message = t("geoFailed") + " ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += t("geoPermissionDenied");
            break;
          case error.POSITION_UNAVAILABLE:
            message += t("geoUnavailable");
            break;
          case error.TIMEOUT:
            message += t("geoTimeout");
            break;
          default:
            message += t("geoUnknown");
        }

        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute bottom-4 right-4 z-[1000] bg-blue-600 text-white-50 px-4 py-2 rounded-lg shadow hover:bg-blue-700 text-sm disabled:opacity-50"
    >
      {loading ? t("gettingLocation") : t("useMyLocation")}
    </button>
  );
}

/* ─────────────────────────────────────────────── */
/*                Marker Handling                  */
/* ─────────────────────────────────────────────── */
function LocationMarker({
  position,
  setPosition,
}: {
  position: LatLngExpression | null;
  setPosition: (pos: LatLngExpression) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => setPosition(e.target.getLatLng()),
      }}
    />
  ) : null;
}

/* ─────────────────────────────────────────────── */
/*            Center Map on Position Change        */
/* ─────────────────────────────────────────────── */
function MoveMapTo({ coords }: { coords: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coords, 16);
  }, [coords]);

  return null;
}

/* ─────────────────────────────────────────────── */
/*                 Main Component                  */
/* ─────────────────────────────────────────────── */
export default function LocationPicker({
  defaultPosition = null,
  onChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<LatLngExpression | null>(
    defaultPosition ? defaultPosition : null
  );

  // Sync with defaultPosition changes
  useEffect(() => {
    if (defaultPosition) setPosition(defaultPosition);
    else setPosition(null);
  }, [defaultPosition]);

  const handlePositionChange = async (latlng: LatLngExpression) => {
    setPosition(latlng);
    const { lat, lng } = latlng as any;
    const name = await reverseGeocode(lat, lng);
    onChange({ lat, lng, name });
  };

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
      {/* Search Box */}
      <SearchBox
        onSelectLocation={(lat, lng) =>
          handlePositionChange({ lat, lng })
        }
      />

      {/* Use My Location */}
      <UseMyLocationButton
        onSelectLocation={(lat, lng) =>
          handlePositionChange({ lat, lng })
        }
      />

      {/* Map */}
      <MapContainer
        center={position || [31.9539, 35.9106]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {position && <MoveMapTo coords={position} />}
        <LocationMarker
          position={position}
          setPosition={handlePositionChange}
        />
      </MapContainer>
    </div>
  );
}
