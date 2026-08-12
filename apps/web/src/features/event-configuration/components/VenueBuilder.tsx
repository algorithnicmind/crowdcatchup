"use client";

import { useEffect, useRef } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { useEventConfigStore } from "@/stores/event-config-store";

export function VenueBuilder() {
  const { mode, setDraftBoundary, draftBoundary } = useEventConfigStore();
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    // If we switch out of EDIT_BOUNDARY mode, clear the current drawing if it wasn't saved
    if (mode !== "EDIT_BOUNDARY" && featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  }, [mode]);

  const onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer.getLatLngs()[0];
      const points = latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }));
      setDraftBoundary(points);
    }
  };

  const onEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const latlngs = layer.getLatLngs()[0];
      const points = latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }));
      setDraftBoundary(points);
    });
  };

  const onDeleted = () => {
    setDraftBoundary([]);
  };

  if (mode !== "EDIT_BOUNDARY") return null;

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={onCreated}
        onEdited={onEdited}
        onDeleted={onDeleted}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100", // Color the shape will turn when intersects
              message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
            },
            shapeOptions: {
              color: "#10b981",
            },
          },
        }}
      />
    </FeatureGroup>
  );
}
