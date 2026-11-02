// Type definitions for interactive virtual spaces and theme renderers.
export interface SpaceHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  action: string;
}

export interface SpaceTheme {
  id: string;
  name: string;
  renderer: "image" | "three";
  assets: {
    background?: string;
    model?: string;
    thumbnail?: string;
  };
  palette: {
    primary: string;
    background: string;
    surface: string;
    text: string;
  };
  hotspots: SpaceHotspot[];
}

export interface SpaceRendererProps {
  theme: SpaceTheme;
  onHotspotPress?: (hotspot: SpaceHotspot) => void;
}

