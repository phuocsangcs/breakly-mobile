// Global theme tokens synchronized from Figma "Breakly – UI" (Foundations & Components, node 47:2).
// Includes Cozy chill room (Dark) and Normal (Light) palettes, typography scale (Fraunces & DM Sans),
// spacing, border radii, and backward-compatible aliases for all existing screens.

export type ThemeMode = "dark" | "light";
export type BreaklyThemeId = "cozy-room" | "garden";

export interface ThemePalette {
  /** Primary accent color (Warm Amber #F2B05E in Dark, Forest Sage #2F6B5E in Light) */
  primary: string;
  /** Alias of primary matching Figma token name `accent` */
  accent: string;
  /** Contrast foreground on top of accent surfaces (#2B2238 in Dark, #FFFFFF in Light) */
  onAccent: string;
  /** Primary screen background (#232437 in Dark, #F4EDE1 in Light) */
  background: string;
  /** Primary card / elevated surface (#2E2F46 in Dark, #FFFFFF in Light) */
  surface: string;
  /** Secondary pill / chip / badge surface (#383A55 in Dark, #EAE1D2 in Light) */
  surface2: string;
  /** Primary text color (#F6EBDD in Dark, #1F2A2A in Light) */
  text: string;
  /** Secondary / muted text color (#B9AFC8 in Dark, #5C625F in Light) */
  textMuted: string;
  /** Alias of textMuted matching Figma token name `textSecondary` */
  textSecondary: string;
  /** Subtle divider & stroke color */
  border: string;
  /** Alias of border matching Figma token name `line` */
  line: string;
  /** Semantic danger / error color (#E9897A in Dark, #B4473A in Light) */
  danger: string;
  /** Text input field background fill */
  inputFill: string;
  /** Floating bottom navigation bar translucent surface */
  bottomBarBg: string;
  /** Hotspot pill background in SpaceView */
  roomLabelBg: string;
  /** Hotspot pill text color in SpaceView */
  roomLabelText: string;
  /** Hotspot pill icon color in SpaceView */
  roomLabelIcon: string;
  /** Artwork placeholder surface */
  artworkBg: string;
}

export const Colors: Record<ThemeMode, ThemePalette> = {
  // Figma "Dark · Cozy chill room"
  dark: {
    primary: "#F2B05E",
    accent: "#F2B05E",
    onAccent: "#2B2238",
    background: "#232437",
    surface: "#2E2F46",
    surface2: "#383A55",
    text: "#F6EBDD",
    textMuted: "#B9AFC8",
    textSecondary: "#B9AFC8",
    border: "rgba(255, 246, 232, 0.14)",
    line: "rgba(255, 246, 232, 0.14)",
    danger: "#E9897A",
    inputFill: "rgba(255, 246, 232, 0.06)",
    bottomBarBg: "rgba(28, 29, 46, 0.94)",
    roomLabelBg: "#F6EBDD",
    roomLabelText: "#2B2238",
    roomLabelIcon: "#9C4F2C",
    artworkBg: "#3E4A7A",
  },
  // Figma "Light · Normal"
  light: {
    primary: "#2F6B5E",
    accent: "#2F6B5E",
    onAccent: "#FFFFFF",
    background: "#F4EDE1",
    surface: "#FFFFFF",
    surface2: "#EAE1D2",
    text: "#1F2A2A",
    textMuted: "#5C625F",
    textSecondary: "#5C625F",
    border: "rgba(31, 42, 42, 0.12)",
    line: "rgba(31, 42, 42, 0.12)",
    danger: "#B4473A",
    inputFill: "#FFFFFF",
    bottomBarBg: "rgba(255, 255, 255, 0.96)",
    roomLabelBg: "#FFFFFF",
    roomLabelText: "#1F2A2A",
    roomLabelIcon: "#2F6B5E",
    artworkBg: "#3E4A7A",
  },
};

/**
 * Helper to resolve a ThemePalette from either ThemeMode ("dark" | "light")
 * or Breakly preference themeId ("cozy-room" | "garden").
 */
export function getThemeColors(modeOrThemeId?: ThemeMode | BreaklyThemeId | string): ThemePalette {
  if (modeOrThemeId === "light" || modeOrThemeId === "garden") {
    return Colors.light;
  }
  return Colors.dark;
}

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Radius = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  pill: 26,
  full: 9999,
};

export const Typography = {
  fonts: {
    display: "Fraunces",
    sans: "DM Sans",
  },
  sizes: {
    xxs: 10,
    xs: 12,
    caption: 13,
    sm: 14,
    label: 15,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 32,
    display: 38,
  },
  lineHeights: {
    xs: 16,
    caption: 18,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 34,
    xxl: 40,
    display: 46,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  presets: {
    display: {
      fontSize: 38,
      lineHeight: 46,
      fontWeight: "600" as const,
    },
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: "600" as const,
    },
    h2: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "600" as const,
    },
    title: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
    },
    label: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "600" as const,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "400" as const,
    },
    overline: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "600" as const,
      letterSpacing: 1.2,
    },
  },
};
