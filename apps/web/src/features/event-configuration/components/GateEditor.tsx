"use client";

import { useEffect, useRef } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { useEventConfigStore } from "@/stores/event-config-store";

export function GateEditor() {
  const { mode, setDraftGate, draftGate } = useEventConfigStore();
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (mode !== "ADD_GATE" && featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  }, [mode]);

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "marker") {
      const latlng = layer.getLatLng();
      setDraftGate({
        ...draftGate,
        name: draftGate?.name || "New Gate",
        location: { lat: latlng.lat, lng: latlng.lng },
        type: draftGate?.type || "ENTRY",
        status: draftGate?.status || "CLOSED",
      });
    }
  };

  if (mode !== "ADD_GATE") return null;

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          polygon: false,
          polyline: false,
          marker: true,
        }}
      />
    </FeatureGroup>
  );
}
