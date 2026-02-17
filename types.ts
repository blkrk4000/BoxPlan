export type ViewMode = "week" | "year";
export type ThemeMode = "light" | "dark";
export type ThemeName = "classic" | "ocean" | "forest" | "sunset";

export const MONTHS = [
  "Januar", "Februar", "März", "April",
  "Mai", "Juni", "Juli", "August",
  "September", "Oktober", "November", "Dezember"
];

export const WEEKDAYS = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag",
  "Freitag", "Samstag", "Sonntag", "Notizen"
];

export const THEMES: Record<string, any> = {
  classic: {
    name: "Classic",
    previewColor: "#8e8e93",
    light: {
      "--bg-color": "#f5f5f7",
      "--card-bg": "#ffffff",
      "--text-primary": "#1d1d1f",
      "--text-secondary": "#86868b",
      "--nav-bg": "#e5e5e5",
      "--nav-text": "#666666",
      "--nav-active-bg": "#ffffff",
      "--nav-active-text": "#000000",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.1)",
    },
    dark: {
      "--bg-color": "#000000",
      "--card-bg": "#1c1c1e",
      "--text-primary": "#f5f5f7",
      "--text-secondary": "#98989d",
      "--nav-bg": "#2c2c2e",
      "--nav-text": "#8e8e93",
      "--nav-active-bg": "#636366",
      "--nav-active-text": "#ffffff",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.3)",
    },
  },
  ocean: {
    name: "Ocean",
    previewColor: "#0ea5e9",
    light: {
      "--bg-color": "#f0f9ff",
      "--card-bg": "#ffffff",
      "--text-primary": "#0c4a6e",
      "--text-secondary": "#64748b",
      "--nav-bg": "#e0f2fe",
      "--nav-text": "#0284c7",
      "--nav-active-bg": "#ffffff",
      "--nav-active-text": "#0c4a6e",
      "--nav-active-shadow": "0 2px 4px rgba(14, 165, 233, 0.15)",
    },
    dark: {
      "--bg-color": "#0f172a",
      "--card-bg": "#1e293b",
      "--text-primary": "#f0f9ff",
      "--text-secondary": "#94a3b8",
      "--nav-bg": "#334155",
      "--nav-text": "#cbd5e1",
      "--nav-active-bg": "#475569",
      "--nav-active-text": "#ffffff",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.3)",
    },
  },
  forest: {
    name: "Forest",
    previewColor: "#10b981",
    light: {
      "--bg-color": "#f2fcf5",
      "--card-bg": "#ffffff",
      "--text-primary": "#064e3b",
      "--text-secondary": "#059669",
      "--nav-bg": "#d1fae5",
      "--nav-text": "#059669",
      "--nav-active-bg": "#ffffff",
      "--nav-active-text": "#064e3b",
      "--nav-active-shadow": "0 2px 4px rgba(16, 185, 129, 0.15)",
    },
    dark: {
      "--bg-color": "#064e3b",
      "--card-bg": "#065f46",
      "--text-primary": "#ecfdf5",
      "--text-secondary": "#a7f3d0",
      "--nav-bg": "#047857",
      "--nav-text": "#6ee7b7",
      "--nav-active-bg": "#10b981",
      "--nav-active-text": "#ffffff",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.3)",
    },
  },
  sunset: {
    name: "Sunset",
    previewColor: "#f97316",
    light: {
      "--bg-color": "#fff7ed",
      "--card-bg": "#ffffff",
      "--text-primary": "#7c2d12",
      "--text-secondary": "#ea580c",
      "--nav-bg": "#ffedd5",
      "--nav-text": "#c2410c",
      "--nav-active-bg": "#ffffff",
      "--nav-active-text": "#7c2d12",
      "--nav-active-shadow": "0 2px 4px rgba(249, 115, 22, 0.15)",
    },
    dark: {
      "--bg-color": "#431407",
      "--card-bg": "#7c2d12",
      "--text-primary": "#fff7ed",
      "--text-secondary": "#fdba74",
      "--nav-bg": "#9a3412",
      "--nav-text": "#ffedd5",
      "--nav-active-bg": "#c2410c",
      "--nav-active-text": "#ffffff",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.3)",
    },
  }
};