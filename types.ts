/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

export type ViewMode = "week" | "year";
export type ThemeMode = "light" | "dark";
export type ThemeName = "classic" | "ocean" | "eink" | "gruvbox";

export const MONTHS = [
  "Januar", "Februar", "März", "April",
  "Mai", "Juni", "Juli", "August",
  "September", "Oktober", "November", "Dezember"
];

export const WEEKDAYS = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag",
  "Freitag", "Samstag", "Sonntag", "Notizen"
];

export interface ThemeConfig {
  name: string;
  previewColor: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const THEMES: Record<string, ThemeConfig> = {
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
  eink: {
    name: "E-Ink",
    previewColor: "#4a4a4a",
    light: {
      "--bg-color": "#a9a9a9",
      "--card-bg": "#d3d3d3",
      "--text-primary": "#000000",
      "--text-secondary": "#444444",
      "--nav-bg": "#888888",
      "--nav-text": "#000000",
      "--nav-active-bg": "#ffffff",
      "--nav-active-text": "#000000",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.1)",
    },
    dark: {
      "--bg-color": "#2b2b2b",
      "--card-bg": "#404040",
      "--text-primary": "#dcdcdc",
      "--text-secondary": "#a0a0a0",
      "--nav-bg": "#505050",
      "--nav-text": "#dcdcdc",
      "--nav-active-bg": "#666666",
      "--nav-active-text": "#ffffff",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.2)",
    },
  },
  gruvbox: {
    name: "Gruvbox",
    previewColor: "#d79921",
    light: {
      "--bg-color": "#fbf1c7",
      "--card-bg": "#ebdbb2",
      "--text-primary": "#3c3836",
      "--text-secondary": "#7c6f64",
      "--nav-bg": "#d5c4a1",
      "--nav-text": "#3c3836",
      "--nav-active-bg": "#f9f5d7",
      "--nav-active-text": "#282828",
      "--nav-active-shadow": "0 2px 4px rgba(60, 56, 54, 0.15)",
    },
    dark: {
      "--bg-color": "#282828",
      "--card-bg": "#3c3836",
      "--text-primary": "#ebdbb2",
      "--text-secondary": "#a89984",
      "--nav-bg": "#504945",
      "--nav-text": "#d5c4a1",
      "--nav-active-bg": "#1d2021",
      "--nav-active-text": "#ebdbb2",
      "--nav-active-shadow": "0 2px 4px rgba(0,0,0,0.3)",
    },
  }
};