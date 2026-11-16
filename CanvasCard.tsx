import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { TrashIcon } from "./Icons";

const URL_REGEX = /https?:\/\/[^\s<>]+/g;

// Trailing punctuation is usually not part of the URL
const cleanUrl = (url: string) => url.replace(/[.,;:!?)\]]+$/, "");

// Find the URL at a given cursor position (or null)
const urlAtPosition = (text: string, pos: number): string | null => {
  for (const m of text.matchAll(URL_REGEX)) {
    const url = cleanUrl(m[0]);
    const start = m.index ?? 0;
    if (pos >= start && pos <= start + url.length) return url;
  }
  return null;
};

// Render text with coloured URLs (shown behind the transparent textarea)
const renderWithUrls = (text: string) => {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_REGEX)) {
    const url = cleanUrl(m[0]);
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(<span key={start} className="bp-url">{url}</span>);
    last = start + url.length;
  }
  parts.push(text.slice(last));
  return parts;
};

/**
 * A single "Canvas" component.
 */
export const CanvasCard = ({ 
  id, 
  title, 
  placeholder,
  nextId,
  prevId,
  isToday = false,
  showTodayLabel = true,
  fontSize = 14,
}: { 
  id: string; 
  title: string; 
  placeholder?: string;
  nextId?: string;
  prevId?: string;
  isToday?: boolean;
  showTodayLabel?: boolean;
  fontSize?: number;
}) => {
  const [content, setContent] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  // Keep the coloured layer aligned with the textarea when scrolling
  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (backdropRef.current) backdropRef.current.scrollTop = e.currentTarget.scrollTop;
  };

  // Cmd/Ctrl + click on a URL opens it in a new tab
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const url = urlAtPosition(content, e.currentTarget.selectionStart);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Load content whenever ID changes (e.g. week change)
  useEffect(() => {
    const saved = localStorage.getItem(id);
    setContent(saved || "");
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setContent(newVal);
    localStorage.setItem(id, newVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const targetId = e.shiftKey ? prevId : nextId;

      if (targetId) {
        const targetEl = document.getElementById(targetId) as HTMLTextAreaElement;
        if (targetEl) {
          let val = targetEl.value;
          // If the box is not empty and doesn't end with a newline, append one
          if (val && !val.endsWith("\n")) {
            const newVal = val + "\n";
            
            // Programmatically trigger React's onChange
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value"
            )?.set;
            
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(targetEl, newVal);
              const ev = new Event("input", { bubbles: true });
              targetEl.dispatchEvent(ev);
              val = newVal; // Update local tracking variable
            }
          }

          targetEl.focus();
          // Place cursor at the end
          targetEl.setSelectionRange(val.length, val.length);
        }
      }
    }
  };

  const handleClear = () => {
    if (!content.trim()) return;
    if (window.confirm("Inhalt dieses Feldes löschen?")) {
      setContent("");
      localStorage.removeItem(id);
    }
  };

  const cardStyle = isToday 
    ? { ...styles.card, ...styles.cardToday } 
    : styles.card;

  return (
    <div style={cardStyle}>
      <div style={styles.cardHeader}>
        <div style={{display:'flex', alignItems:'center'}}>
          {title} 
          {isToday && showTodayLabel && <span style={{marginLeft: "6px", opacity: 0.7}}>• Heute</span>}
        </div>
        <button 
          style={{...styles.cardClearBtn, opacity: content ? 0.6 : 0}} 
          className="icon-btn-small"
          onClick={handleClear}
          disabled={!content}
          title="Feld leeren"
        >
          <TrashIcon />
        </button>
      </div>
      <div style={styles.textareaWrap}>
        <div
          ref={backdropRef}
          style={{...styles.textareaBackdrop, fontSize: `${fontSize}px`}}
          aria-hidden="true"
        >
          {renderWithUrls(content)}
          {"\n"}
        </div>
        <textarea
          id={id}
          style={{...styles.textarea, fontSize: `${fontSize}px`}}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          onClick={handleClick}
          placeholder={placeholder || ""}
          spellCheck={false}
          title="URLs öffnen: Cmd + Klick"
        />
      </div>
    </div>
  );
};