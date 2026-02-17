import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { SearchIcon, XIcon } from "./Icons";
import { WEEKDAYS, MONTHS } from "./types";

interface SearchResult {
  id: string;
  view: "week" | "year";
  year: number;
  weekOrIndex: number; // Week number or Month index
  label: string; // "2024 KW 12 - Montag"
  content: string;
}

interface SearchModalProps {
  onClose: () => void;
  onNavigate: (view: "week" | "year", year: number, weekOrMonth: number) => void;
}

export const SearchModal = ({ onClose, onNavigate }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const term = query.toLowerCase();
    const hits: SearchResult[] = [];

    // Iterate all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Check for Week Keys: mp_w_YYYY_WW_Index
      if (key.startsWith("mp_w_")) {
        const parts = key.split("_");
        // mp, w, YYYY, WW, Index
        if (parts.length === 5) {
          const year = parseInt(parts[2]);
          const week = parseInt(parts[3]);
          const dayIndex = parseInt(parts[4]);
          const content = localStorage.getItem(key) || "";

          if (content.toLowerCase().includes(term)) {
            hits.push({
              id: key,
              view: "week",
              year,
              weekOrIndex: week,
              label: `${year} KW ${week} • ${WEEKDAYS[dayIndex]}`,
              content
            });
          }
        }
      }

      // Check for Year Keys: mp_y_YYYY_Index
      if (key.startsWith("mp_y_")) {
        const parts = key.split("_");
        // mp, y, YYYY, Index
        if (parts.length === 4) {
          const year = parseInt(parts[2]);
          const monthIndex = parseInt(parts[3]);
          const content = localStorage.getItem(key) || "";

          if (content.toLowerCase().includes(term)) {
            hits.push({
              id: key,
              view: "year",
              year,
              weekOrIndex: monthIndex, // In year view, this is just passed to navigate to the year
              label: `${year} • ${MONTHS[monthIndex]}`,
              content
            });
          }
        }
      }
    }

    // Sort: Newest years first
    hits.sort((a, b) => b.year - a.year);
    setResults(hits);

  }, [query]);

  const handleSelect = (res: SearchResult) => {
    onNavigate(res.view, res.year, res.weekOrIndex);
    onClose();
  };

  return (
    <div style={styles.searchOverlay} onClick={onClose}>
      <div style={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.searchInputWrapper}>
          <SearchIcon />
          <input
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Suchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button style={styles.modalCloseBtn} className="icon-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div style={styles.searchResults}>
          {results.length === 0 && query.length > 0 && (
             <div style={styles.emptyState}>Keine Ergebnisse gefunden</div>
          )}
          {results.map((res) => (
            <div 
              key={res.id} 
              style={styles.searchResultItem}
              className="search-item"
              onClick={() => handleSelect(res)}
            >
              <div style={styles.resultTitle}>{res.label}</div>
              <div style={styles.resultPreview}>{res.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};