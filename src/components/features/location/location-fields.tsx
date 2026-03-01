"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";

export type LocationValue = {
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
};

type LocationFieldsProps = {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  disabled?: boolean;
};

export function LocationFields({ value, onChange, disabled }: LocationFieldsProps) {
  const t = useT();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  function handleUseMyLocation() {
    if (!navigator?.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          ...value,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      () => {
        setGpsError("Could not get location. Check permissions or try again.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.city")}</label>
          <Input
            value={value.city ?? ""}
            onChange={(e) => onChange({ ...value, city: e.target.value || undefined })}
            placeholder="e.g. Dar es Salaam"
            className="h-11"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.region")}</label>
          <Input
            value={value.region ?? ""}
            onChange={(e) => onChange({ ...value, region: e.target.value || undefined })}
            placeholder="e.g. Dar es Salaam"
            className="h-11"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleUseMyLocation}
          disabled={disabled || gpsLoading}
        >
          <MapPin className="w-4 h-4" />
          {gpsLoading ? "Detecting…" : "Use my location (GPS)"}
        </Button>
        {(value.latitude != null && value.longitude != null) && (
          <span className="text-xs text-muted-foreground">
            {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
          </span>
        )}
      </div>
      {gpsError && <p className="text-sm text-destructive">{gpsError}</p>}
    </div>
  );
}
