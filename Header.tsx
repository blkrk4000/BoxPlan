import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { ChevronLeft, ChevronRight, BoxIcon, SettingsIcon, CalendarIcon, PaletteIcon, SearchIcon, SunIcon, MoonIcon, MinusIcon, PlusIcon } from "./Icons";
import { ViewMode, ThemeMode, ThemeName, THEMES } from "./types";

interface HeaderProps {
  view: ViewMode;
  setView: (mode: ViewMode) => void;
  dateLabel: string;
  navigateDate: (direction: -1 | 1) => void;
  onOpenSettings: () => void;
  onJumpToday: () => void;
  onOpenSearch: () => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  fontSize: number;
  setFontSize: (delta: number) => void;
}

export const Header = ({
  view,
  setView,
  dateLabel,
  navigateDate,
  onOpenSettings,
  onJumpToday,
  onOpenSearch,
  themeMode,
  toggleThemeMode,
  themeName,
  setThemeName,
  fontSize,
  setFontSize
}: HeaderProps) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // Handle ESC key to close theme popover
  useEffect(() => {
    if (!isThemeOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsThemeOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isThemeOpen]);

  return (
    <header style={styles.header}>
      {/* Left: Logo & Title - Packed tightly */}
      <div style={styles.headerLeft}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <BoxIcon />
          </div>
          <h1 style={styles.logoText}>BoxPlan</h1>
        </div>
        <span style={styles.versionBadge}>v0.2.0</span>
      </div>

      {/* Center: Search, NavPill, DateNav */}
      <div style={styles.headerCenter}>
        <button 
          onClick={onOpenSearch}
          style={styles.iconButton}
          className="icon-btn"
          title="Suchen"
        >
          <SearchIcon />
        </button>

        <div style={styles.navPill}>
          <button
            onClick={() => setView("week")}
            style={{
              ...styles.navButton,
              ...(view === "week" ? styles.navButtonActive : {}),
            }}
            className={`nav-btn ${view === "week" ? 'active' : ''}`}
          >
            Wochenplanung
          </button>
          <button
            onClick={() => setView("year")}
            style={{
              ...styles.navButton,
              ...(view === "year" ? styles.navButtonActive : {}),
            }}
            className={`nav-btn ${view === "year" ? 'active' : ''}`}
          >
            Jahresübersicht
          </button>
        </div>
        
        <div style={styles.dateNav}>
          <button 
            onClick={() => navigateDate(-1)} 
            style={styles.navArrow} 
            className="icon-btn-small"
            title="Zurück"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={onJumpToday} 
            style={styles.todayButton}
            className="btn-secondary"
            title="Zu heute springen"
          >
            <CalendarIcon />
            Heute
          </button>
          <span style={styles.dateLabel}>{dateLabel}</span>
          <button 
            onClick={() => navigateDate(1)} 
            style={styles.navArrow} 
            className="icon-btn-small"
            title="Weiter"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Right: Theme & Settings */}
      <div style={styles.headerRight}>
        <div style={{position: 'relative'}}>
          <button 
            onClick={() => setIsThemeOpen(!isThemeOpen)} 
            style={styles.iconButton}
            className="icon-btn"
            title="Design anpassen"
          >
            <PaletteIcon />
          </button>
          
          {isThemeOpen && (
            <>
              <div 
                style={{position: 'fixed', top:0, left:0, right:0, bottom:0, zIndex: 1999}} 
                onClick={() => setIsThemeOpen(false)} 
              />
              <div style={styles.themePopover}>
                <span style={styles.settingsLabel}>Modus</span>
                <div style={styles.settingsButtonRow}>
                  <button 
                    style={{
                      ...styles.themeButton,
                      borderColor: themeMode === 'light' ? 'var(--text-primary)' : 'var(--nav-bg)'
                    }} 
                    className="theme-btn"
                    onClick={() => themeMode === 'dark' && toggleThemeMode()}
                  >
                    <SunIcon /> Light
                  </button>
                  <button 
                    style={{
                      ...styles.themeButton,
                      borderColor: themeMode === 'dark' ? 'var(--text-primary)' : 'var(--nav-bg)'
                    }} 
                    className="theme-btn"
                    onClick={() => themeMode === 'light' && toggleThemeMode()}
                  >
                    <MoonIcon /> Dark
                  </button>
                </div>
                
                <span style={styles.settingsLabel}>Farbe</span>
                <div style={styles.colorDotsRow}>
                  {(Object.keys(THEMES) as ThemeName[]).map((tName) => (
                    <button
                      key={tName}
                      onClick={() => setThemeName(tName)}
                      title={THEMES[tName].name}
                      style={{
                        ...styles.colorDotLarge,
                        backgroundColor: THEMES[tName].previewColor,
                        transform: themeName === tName ? "scale(1.1)" : "scale(1)",
                        border: themeName === tName 
                          ? `2px solid var(--text-primary)` 
                          : "2px solid transparent",
                      }}
                      className="icon-btn"
                    />
                  ))}
                </div>

                <div style={styles.fontSizeControl}>
                  <span style={{...styles.settingsLabel, marginBottom: 0}}>Schriftgröße</span>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <button 
                      style={styles.fontSizeBtn} 
                      className="btn-secondary"
                      onClick={() => setFontSize(-1)}
                    >
                      <MinusIcon/>
                    </button>
                    <span style={styles.fontSizeDisplay}>{fontSize}px</span>
                    <button 
                      style={styles.fontSizeBtn} 
                      className="btn-secondary"
                      onClick={() => setFontSize(1)}
                    >
                      <PlusIcon/>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={onOpenSettings} 
          style={styles.settingsButton}
          className="icon-btn"
          title="Einstellungen"
        >
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};