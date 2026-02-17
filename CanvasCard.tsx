import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { TrashIcon } from "./Icons";

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
          style={{...styles.cardClearBtn, opacity: content ? 0.4 : 0}} 
          onClick={handleClear}
          disabled={!content}
          title="Feld leeren"
        >
          <TrashIcon />
        </button>
      </div>
      <textarea
        id={id}
        style={{...styles.textarea, fontSize: `${fontSize}px`}}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || ""}
        spellCheck={false}
      />
    </div>
  );
};