import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Crosshair, LoaderCircle, MapPin } from "lucide-react";
import { request } from "@/api/client";
import { haptic } from "@/lib/haptics";

type Point = { latitude: number; longitude: number; address?: string; city?: string; state?: string; pincode?: string };

type Props = {
  latitude?: number | string;
  longitude?: number | string;
  onChange: (point: Point) => void;
};

declare global { interface Window { google?: any; __mrBreadoGoogleMapsPromise?: Promise<any>; } }

function loadGoogleMaps(apiKey: string): Promise<any> {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (window.__mrBreadoGoogleMapsPromise) return window.__mrBreadoGoogleMapsPromise;
  window.__mrBreadoGoogleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("mr-breado-google-maps") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.id = "mr-breado-google-maps";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
  return window.__mrBreadoGoogleMapsPromise;
}

export function OutletMapPicker({ latitude, longitude, onChange }: Props) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await request<any>({ url: "/admin/maps/browser-config", method: "GET" });
        if (cancelled) return;
        if (!cfg?.configured || !cfg?.apiKey) {
          setConfigured(false);
          setMessage(cfg?.message || "Google Maps API key is not configured.");
          setLoading(false);
          return;
        }
        const google = await loadGoogleMaps(cfg.apiKey);
        if (cancelled || !mapNode.current) return;
        const initial = {
          lat: Number(latitude) || 22.5726,
          lng: Number(longitude) || 88.3639,
        };
        const map = new google.maps.Map(mapNode.current, {
          center: initial,
          zoom: Number(latitude) && Number(longitude) ? 16 : 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });
        const marker = new google.maps.Marker({ position: initial, map, draggable: true, title: "Outlet location" });
        mapRef.current = map;
        markerRef.current = marker;
        const geocoder = new google.maps.Geocoder();
        const apply = async (latLng: any) => {
          const lat = Number(latLng.lat());
          const lng = Number(latLng.lng());
          marker.setPosition(latLng);
          map.panTo(latLng);
          let address = ""; let city = ""; let state = ""; let pincode = "";
          try {
            const result = await geocoder.geocode({ location: { lat, lng } });
            const first = result?.results?.[0];
            address = first?.formatted_address || "";
            for (const part of first?.address_components || []) {
              const types: string[] = part.types || [];
              if (types.includes("locality") || types.includes("postal_town")) city ||= part.long_name;
              if (types.includes("administrative_area_level_1")) state ||= part.long_name;
              if (types.includes("postal_code")) pincode ||= part.long_name;
            }
          } catch (_) {}
          haptic();
          onChange({ latitude: lat, longitude: lng, address, city, state, pincode });
        };
        map.addListener("click", (event: any) => event.latLng && apply(event.latLng));
        marker.addListener("dragend", (event: any) => event.latLng && apply(event.latLng));
        setLoading(false);
      } catch (error: any) {
        if (cancelled) return;
        setMessage(error?.message || "Google Maps could not be loaded.");
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const locateMe = () => {
    haptic();
    if (!navigator.geolocation) return setMessage("Location access is not available in this browser.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        mapRef.current?.setCenter(point);
        mapRef.current?.setZoom(17);
        markerRef.current?.setPosition(point);
        onChange({ latitude: point.lat, longitude: point.lng });
      },
      () => setMessage("Allow browser location permission or place the pin manually."),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  if (!configured) {
    return <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-800"><div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0"/><div><b>Google Maps setup required</b><p className="mt-1">{message} Open API Keys in the sidebar, save a valid key, then reopen this form. You can still enter latitude, longitude and address manually.</p></div></div></div>;
  }

  return <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-inner">
    <div ref={mapNode} className="h-72 w-full sm:h-80" />
    {loading && <div className="absolute inset-0 grid place-items-center bg-background/75 backdrop-blur-sm"><div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-bold"><LoaderCircle className="h-4 w-4 animate-spin text-primary"/>Loading interactive map…</div></div>}
    <div className="pointer-events-none absolute left-3 top-3 rounded-xl border bg-background/90 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>Tap the map or drag the pin</div></div>
    <button type="button" onClick={locateMe} className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-xl border bg-background/95 px-4 text-sm font-bold shadow-xl backdrop-blur transition hover:bg-accent"><Crosshair className="h-4 w-4 text-primary"/>Use my location</button>
    {message && <div className="absolute bottom-3 left-3 max-w-[65%] rounded-xl border border-amber-500/30 bg-amber-50/95 px-3 py-2 text-xs font-semibold text-amber-900 shadow-lg">{message}</div>}
  </div>;
}
