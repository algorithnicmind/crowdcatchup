"use client";

import { useEffect, useRef } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { useEventConfigStore } from "@/stores/event-config-store";

export function ZoneEditor() {
  const { mode, setDraftZone, draftZone } = useEventConfigStore();
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (mode !== "ADD_ZONE" && featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  }, [mode]);

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer.getLatLngs()[0];
      const points = latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }));
      setDraftZone({
        ...draftZone,
        name: draftZone?.name || "New Zone",
        polygon: points,
        capacity: draftZone?.capacity || 1000,
        type: draftZone?.type || "GENERAL",
      });
    }
  };

  if (mode !== "ADD_ZONE") return null;

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          polygon: {
            shapeOptions: {
              color: "#3b82f6",
              fillOpacity: 0.2,
            },
          },
        }}
      />
    </FeatureGroup>
  );
}
