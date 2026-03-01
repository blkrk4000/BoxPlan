import React, { useState, useEffect, useMemo } from "react";
import { styles } from "./styles";
import { ViewMode, ThemeMode, ThemeName, THEMES, WEEKDAYS, MONTHS } from "./types";
import { getISOWeekAndYear, getDateFromISOWeek } from "./helpers";
import { Header } from "./Header";
import { CanvasCard } from "./CanvasCard";
import { SettingsModal } from "./SettingsModal";
import { SearchModal } from "./SearchModal";

/**
 * Main Application Component
 */
export const App = () => {
  const [view, setView] = useState<ViewMode>("week");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [themeName, setThemeName] = useState<ThemeName>("classic");
  const [fontSize, setFontSize] = useState(14);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // Force re-render when clearing, applying templates or importing data
  const [resetCount, setResetCount] = useState(0);

  // Derived Date Values for the VIEW
  const { week, year: isoYear } = useMemo(() => getISOWeekAndYear(currentDate), [currentDate]);
  const year = currentDate.getFullYear(); // Calendar year for Year View
  
  const dateLabel = view === "week" ? `KW ${week} • ${isoYear}` : `${year}`;

  // Sanitize theme name to ensure it matches a key in THEMES
  const safeThemeName = useMemo(() => {
    const normalized = themeName.toLowerCase().trim();
    return (normalized in THEMES) ? (normalized as ThemeName) : "classic";
  }, [themeName]);

  // Apply theme variables
  useEffect(() => {
    const themeConfig = THEMES[safeThemeName][themeMode];
    const root = document.documentElement;
    
    // Debug log
    console.log(`Applying Theme: ${safeThemeName} (${themeMode})`, themeConfig);

    // Set color-scheme for browser UI
    root.style.setProperty("color-scheme", themeMode);

    if (themeConfig) {
      Object.entries(themeConfig).forEach(([key, value]) => {
        root.style.setProperty(key, value as string);
      });
      
      // Force body background to ensure update
      document.body.style.backgroundColor = themeConfig["--bg-color"];
      document.body.style.color = themeConfig["--text-primary"];
    }

    localStorage.setItem("masterplan_theme_mode", themeMode);
    localStorage.setItem("masterplan_theme_name", safeThemeName);
  }, [themeMode, safeThemeName]);
  const today = new Date();
  const { week: currentRealWeek, year: currentRealYear } = useMemo(() => getISOWeekAndYear(today), []);
  const currentRealMonth = today.getMonth();
  // Adjust JS getDay() (0=Sun, 1=Mon) to our array (0=Mon...6=Sun)
  const currentRealDayIndex = (today.getDay() + 6) % 7; 

  // --- SHORTCUTS & FOCUS LOGIC ---

  // 1. Keyboard Shortcut: Cmd + 1 (Toggle View)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+1 or Ctrl+1 to toggle view
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        setView((prev) => (prev === "week" ? "year" : "week"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Auto-Focus Logic
  useEffect(() => {
    // Only auto-focus if we are currently looking at the "real" today period.
    // This prevents jumping focus if user is looking at history/future.
    let targetId = "";
    let shouldFocus = false;

    if (view === "week") {
      // Check if visible week matches real week
      if (week === currentRealWeek && isoYear === currentRealYear) {
        targetId = `mp_w_${currentRealYear}_${currentRealWeek}_${currentRealDayIndex}`;
        shouldFocus = true;
      }
    } else {
      // Year view: Check if visible year matches real year
      if (year === currentRealYear) {
        targetId = `mp_y_${currentRealYear}_${currentRealMonth}`;
        shouldFocus = true;
      }
    }

    if (shouldFocus && targetId) {
      // Small timeout to allow React to render the DOM
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId) as HTMLTextAreaElement;
        if (el) {
          el.focus();
          // Move cursor to end of text
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, week, isoYear, year, currentRealWeek, currentRealYear, currentRealMonth, currentRealDayIndex]);


  // --- EXISTING EFFECTS ---

  // Load theme and settings from local storage
  useEffect(() => {
    const savedMode = localStorage.getItem("masterplan_theme_mode") as ThemeMode;
    const savedName = localStorage.getItem("masterplan_theme_name");
    const savedFontSize = localStorage.getItem("masterplan_fontsize");
    
    if (savedMode) setThemeMode(savedMode);
    if (savedName) {
      // We don't check 'in THEMES' here, the safeThemeName memo handles validation
      setThemeName(savedName as ThemeName);
    }
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  const toggleMode = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeFontSize = (delta: number) => {
    setFontSize(prev => {
      const newSize = Math.min(Math.max(prev + delta, 10), 32);
      localStorage.setItem("masterplan_fontsize", newSize.toString());
      return newSize;
    });
  };

  const navigateDate = (direction: -1 | 1) => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setFullYear(newDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateFromSearch = (targetView: ViewMode, targetYear: number, weekOrIndex: number) => {
    setView(targetView);
    if (targetView === "week") {
      // Calculate a date that falls in that week
      const d = getDateFromISOWeek(weekOrIndex, targetYear);
      setCurrentDate(d);
    } else {
      // Set a date in that year
      const d = new Date(targetYear, 0, 1);
      setCurrentDate(d);
    }
  };

  const handleApplyTemplate = (mode: ViewMode, template: string, method: "append" | "replace") => {
    if (!template) return;

    if (mode === "week") {
      for (let i = 0; i < WEEKDAYS.length; i++) {
        const id = `mp_w_${isoYear}_${week}_${i}`;
        const current = localStorage.getItem(id);
        
        if (method === "replace") {
          localStorage.setItem(id, template);
        } else {
          // Append mode
          if (!current) {
            localStorage.setItem(id, template);
          } else {
            localStorage.setItem(id, current + "\n" + template);
          }
        }
      }
    } else {
      for (let i = 0; i < MONTHS.length; i++) {
        const id = `mp_y_${year}_${i}`;
        const current = localStorage.getItem(id);
        
        if (method === "replace") {
          localStorage.setItem(id, template);
        } else {
           // Append mode
          if (!current) {
            localStorage.setItem(id, template);
          } else {
            localStorage.setItem(id, current + "\n" + template);
          }
        }
      }
    }
    // Force grid to re-read localStorage
    setResetCount(prev => prev + 1);
  };

  const handleClear = () => {
    let confirmMsg = "";
    if (view === "week") {
      confirmMsg = `Möchtest du wirklich alle Einträge für KW ${week} ${isoYear} löschen?`;
    } else {
      confirmMsg = `Möchtest du wirklich alle Einträge für das Jahr ${year} löschen?`;
    }

    if (window.confirm(confirmMsg)) {
      if (view === "week") {
        for (let i = 0; i < WEEKDAYS.length; i++) {
          localStorage.removeItem(`mp_w_${isoYear}_${week}_${i}`);
        }
      } else {
        for (let i = 0; i < MONTHS.length; i++) {
          localStorage.removeItem(`mp_y_${year}_${i}`);
        }
      }
      setResetCount(prev => prev + 1);
      setShowSettings(false); // Close settings after clearing
    }
  };

  return (
    <div style={styles.container}>
      <Header
        view={view}
        setView={setView}
        dateLabel={dateLabel}
        navigateDate={navigateDate}
        onOpenSettings={() => setShowSettings(true)}
        onJumpToday={jumpToToday}
        onOpenSearch={() => setShowSearch(true)}
        themeMode={themeMode}
        toggleThemeMode={toggleMode}
        themeName={themeName}
        setThemeName={setThemeName}
        fontSize={fontSize}
        setFontSize={changeFontSize}
      />

      {/* Main Content Area */}
      <main style={styles.main}>
        {view === "week" ? (
          <div style={styles.gridWeek} key={`week-${isoYear}-${week}-${resetCount}`}>
            {WEEKDAYS.map((day, index) => {
              // Dynamic ID: mp_w_YYYY_WW_Index
              const id = `mp_w_${isoYear}_${week}_${index}`;
              
              // Calculate Next/Prev IDs for looping navigation
              const prevIndex = (index - 1 + WEEKDAYS.length) % WEEKDAYS.length;
              const nextIndex = (index + 1) % WEEKDAYS.length;
              const prevId = `mp_w_${isoYear}_${week}_${prevIndex}`;
              const nextId = `mp_w_${isoYear}_${week}_${nextIndex}`;

              // Check if this card is today
              const isToday = 
                week === currentRealWeek && 
                isoYear === currentRealYear && 
                index === currentRealDayIndex;

              return (
                <CanvasCard
                  key={id}
                  id={id}
                  title={day}
                  placeholder="" 
                  prevId={prevId}
                  nextId={nextId}
                  isToday={isToday}
                  showTodayLabel={true}
                  fontSize={fontSize}
                />
              );
            })}
          </div>
        ) : (
          <div style={styles.gridYear} key={`year-${year}-${resetCount}`}>
            {MONTHS.map((month, index) => {
              // Dynamic ID: mp_y_YYYY_Index
              const id = `mp_y_${year}_${index}`;

              // Calculate Next/Prev IDs for looping navigation
              const prevIndex = (index - 1 + MONTHS.length) % MONTHS.length;
              const nextIndex = (index + 1) % MONTHS.length;
              const prevId = `mp_y_${year}_${prevIndex}`;
              const nextId = `mp_y_${year}_${nextIndex}`;

              const isThisMonth = year === currentRealYear && index === currentRealMonth;

              return (
                <CanvasCard
                  key={id}
                  id={id}
                  title={month}
                  prevId={prevId}
                  nextId={nextId}
                  isToday={isThisMonth} 
                  showTodayLabel={false}
                  fontSize={fontSize}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Search Modal */}
      {showSearch && (
        <SearchModal 
          onClose={() => setShowSearch(false)}
          onNavigate={navigateFromSearch}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          handleClear={handleClear}
          onApplyTemplate={handleApplyTemplate}
          onDataChange={() => setResetCount(prev => prev + 1)}
        />
      )}
    </div>
  );
};