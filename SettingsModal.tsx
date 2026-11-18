import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { TrashIcon, XIcon, DownloadIcon, UploadIcon } from "./Icons";
import { ViewMode, WEEKDAYS } from "./types";

interface SettingsModalProps {
  onClose: () => void;
  handleClear: () => void;
  onApplyTemplate: (mode: ViewMode, template: string, method: "append" | "replace") => void;
  view: ViewMode;
  onSaveWeekTemplate: () => void;
  onApplyWeekTemplate: () => number; // returns number of boxes filled (-1 = no template saved)
  onDataChange: () => void; // Triggered after import
}

type Tab = "data" | "templates" | "docs" | "about";

const WEEK_TEMPLATE_KEY = "boxplan_template_week_days";

const loadWeekTemplate = (): string[] | null => {
  try {
    const raw = localStorage.getItem(WEEK_TEMPLATE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
};

export const SettingsModal = ({
  onClose,
  handleClear,
  onApplyTemplate,
  view,
  onSaveWeekTemplate,
  onApplyWeekTemplate,
  onDataChange
}: SettingsModalProps) => {
  // Default to "data" as requested
  const [activeTab, setActiveTab] = useState<Tab>("data");
  
  // Templates State
  const [yearTemplate, setYearTemplate] = useState("");
  const [weekTemplateInfo, setWeekTemplateInfo] = useState("");
  const [weekDays, setWeekDays] = useState<string[] | null>(null);
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setYearTemplate(localStorage.getItem("boxplan_template_year") || "");
    setWeekDays(loadWeekTemplate());
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasWeekTemplate = !!weekDays && weekDays.some((d) => d && d.trim());

  const editWeekTemplateDay = (index: number, value: string) => {
    const next = WEEKDAYS.map((_, k) => (k === index ? value : weekDays?.[k] ?? ""));
    localStorage.setItem(WEEK_TEMPLATE_KEY, JSON.stringify(next));
    setWeekDays(next);
  };

  const handleSaveWeekTemplate = () => {
    if (hasWeekTemplate && !window.confirm("Die bestehende Wochenvorlage wird überschrieben. Fortfahren?")) {
      return;
    }
    onSaveWeekTemplate();
    setWeekDays(loadWeekTemplate());
    setWeekTemplateInfo("Vorlage gespeichert.");
  };

  const handleApplyWeekTemplate = () => {
    const filled = onApplyWeekTemplate();
    if (filled < 0) {
      setWeekTemplateInfo("Noch keine Vorlage gespeichert.");
      return;
    }
    onClose();
  };

  const saveYearTemplate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setYearTemplate(val);
    localStorage.setItem("boxplan_template_year", val);
  };

  const handleTemplateAction = (mode: ViewMode, template: string, method: "append" | "replace") => {
    if (!template) return;
    
    if (method === "replace") {
      if (!window.confirm("Achtung: Dies ersetzt alle Einträge der aktuellen Ansicht durch das Template. Fortfahren?")) {
        return;
      }
    }
    
    onApplyTemplate(mode, template, method);
    onClose();
  };

  const handleExport = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("mp_") || key.startsWith("boxplan_"))) {
        data[key] = localStorage.getItem(key) || "";
      }
    }
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `boxplan_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (typeof json === "object" && json !== null) {
          if (window.confirm("Achtung: Importierte Daten überschreiben vorhandene Einträge. Fortfahren?")) {
             Object.entries(json).forEach(([key, value]) => {
                if (typeof value === "string") {
                  localStorage.setItem(key, value);
                }
             });
             onDataChange(); // Refresh app
             alert("Import erfolgreich!");
          }
        }
      } catch (err) {
        alert("Fehler beim Lesen der Datei. Ist es eine gültige JSON-Datei?");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Einstellungen</h2>
          <button style={styles.modalCloseBtn} className="icon-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        {/* Tab Navigation - Reordered: Data first */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === "data" ? styles.tabButtonActive : {})}}
            className={`tab-btn ${activeTab === "data" ? 'active' : ''}`}
            onClick={() => setActiveTab("data")}
          >
            Daten
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "templates" ? styles.tabButtonActive : {})}}
            className={`tab-btn ${activeTab === "templates" ? 'active' : ''}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates{hasWeekTemplate ? " ✓" : ""}
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "docs" ? styles.tabButtonActive : {})}}
            className={`tab-btn ${activeTab === "docs" ? 'active' : ''}`}
            onClick={() => setActiveTab("docs")}
          >
            Hilfe
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "about" ? styles.tabButtonActive : {})}}
            className={`tab-btn ${activeTab === "about" ? 'active' : ''}`}
            onClick={() => setActiveTab("about")}
          >
            Über
          </button>
        </div>

        <div style={styles.tabContent}>
          
          {/* TAB: Data (Now First) */}
          {activeTab === "data" && (
            <>
               <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Backup</span>
                <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <button style={styles.actionButton} className="btn-primary" onClick={handleExport}>
                    <DownloadIcon /> Backup erstellen (.json)
                  </button>
                  
                  <label style={styles.fileInputLabel}>
                    <div style={styles.secondaryButton} className="btn-secondary">
                       <UploadIcon /> Backup wiederherstellen
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".json" 
                      style={{display: 'none'}} 
                      onChange={handleImport}
                    />
                  </label>
                </div>
              </div>

              <div style={{...styles.divider, marginBottom: '20px'}} />

              <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Gefahrenzone</span>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px'}}>
                  Löscht alle Einträge der aktuell angezeigten Ansicht (Jahr oder Woche).
                </p>
                <button style={styles.dangerButton} className="btn-danger" onClick={handleClear}>
                  <TrashIcon /> Reset Planung
                </button>
              </div>
            </>
          )}

          {/* TAB: Templates (Now Second) */}
          {activeTab === "templates" && (
            <>
              <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Wochenvorlage</span>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.5'}}>
                  Fülle eine Woche so aus, wie sie typischerweise aussieht, und speichere sie als Vorlage.
                  Beim Einsetzen werden nur leere Boxen gefüllt, vorhandene Einträge bleiben unverändert.
                </p>
                <p style={{fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px'}}>
                  {hasWeekTemplate
                    ? `✓ Wochenvorlage vorhanden (${weekDays!.filter((d) => d && d.trim()).length} von ${WEEKDAYS.length} Boxen mit Inhalt)`
                    : "Noch keine Wochenvorlage gespeichert"}
                </p>
                <div style={styles.settingsButtonRow}>
                  <button
                    style={{...styles.secondaryButton, opacity: view === "week" ? 1 : 0.5}}
                    className="btn-secondary"
                    disabled={view !== "week"}
                    onClick={handleSaveWeekTemplate}
                  >
                    Aktuelle Woche als Vorlage speichern
                  </button>
                  <button
                    style={{...styles.secondaryButton, opacity: view === "week" && hasWeekTemplate ? 1 : 0.5}}
                    className="btn-secondary"
                    disabled={view !== "week" || !hasWeekTemplate}
                    onClick={handleApplyWeekTemplate}
                  >
                    Vorlage in aktuelle Woche einsetzen
                  </button>
                </div>
                {view !== "week" && (
                  <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px'}}>
                    Wechsle in die Wochenansicht, um die Wochenvorlage zu nutzen.
                  </p>
                )}
                {weekTemplateInfo && (
                  <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px'}}>{weekTemplateInfo}</p>
                )}

                <details style={{marginTop: '12px'}}>
                  <summary style={{cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)'}}>
                    Wochenvorlage ansehen / bearbeiten
                  </summary>
                  <div style={{marginTop: '10px'}}>
                    {WEEKDAYS.map((day, i) => (
                      <div key={day} style={{marginBottom: '10px'}}>
                        <span style={styles.settingsLabel}>{day}</span>
                        <textarea
                          style={{...styles.templateInput, minHeight: '90px'}}
                          value={weekDays?.[i] ?? ""}
                          onChange={(e) => editWeekTemplateDay(i, e.target.value)}
                          spellCheck={false}
                          className="input-focus"
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Jahres-Template</span>
                <textarea
                  style={styles.templateInput}
                  value={yearTemplate}
                  onChange={saveYearTemplate}
                  placeholder="Standard-Inhalt für Monate..."
                  spellCheck={false}
                  className="input-focus"
                />
                <div style={styles.settingsButtonRow}>
                  <button 
                    style={styles.secondaryButton}
                    className="btn-secondary"
                    onClick={() => handleTemplateAction("year", yearTemplate, "append")}
                  >
                    Anfügen
                  </button>
                  <button 
                    style={styles.secondaryButton}
                    className="btn-secondary"
                    onClick={() => handleTemplateAction("year", yearTemplate, "replace")}
                  >
                    Ersetzen
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB: Docs */}
          {activeTab === "docs" && (
            <div style={{paddingBottom: '20px'}}>
              <span style={styles.settingsLabel}>Tastaturkürzel</span>
              
              <div style={styles.shortcutRow}>
                <span>Ansicht wechseln</span>
                <div>
                  <span style={styles.keyCap}>Cmd</span> + <span style={styles.keyCap}>1</span>
                </div>
              </div>
              <div style={styles.shortcutRow}>
                <span>Nächstes Feld</span>
                <span style={styles.keyCap}>Tab</span>
              </div>
              <div style={styles.shortcutRow}>
                <span>Vorheriges Feld</span>
                <div>
                  <span style={styles.keyCap}>Shift</span> + <span style={styles.keyCap}>Tab</span>
                </div>
              </div>
               <div style={styles.shortcutRow}>
                <span>Neue Zeile</span>
                <span style={styles.keyCap}>Enter</span>
              </div>
              <div style={styles.shortcutRow}>
                <span>Dialog schließen</span>
                <span style={styles.keyCap}>Esc</span>
              </div>
              
              <br />
              <span style={styles.settingsLabel}>Funktionen</span>
              <p style={{fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)'}}>
                <b>Wochenvorlage:</b> Speichert alle Boxen der aktuellen Woche als Vorlage und setzt sie in leere Boxen einer anderen Woche ein. Vorhandene Einträge bleiben unverändert.
              </p>
              <p style={{fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)'}}>
                <b>Jahres-Template:</b> Ein Text für alle Monate.
                <br/>
                <i>Anfügen:</i> Fügt den Text unter bestehende Notizen hinzu.
                <br/>
                <i>Ersetzen:</i> Löscht bestehende Notizen und setzt das Template ein.
              </p>
              <p style={{fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)'}}>
                <b>Suche:</b> Die Suche durchsucht alle lokal gespeicherten Daten.
              </p>
            </div>
          )}

          {/* TAB: About */}
          {activeTab === "about" && (
            <div style={styles.aboutContainer}>
              <h3 style={{color: 'var(--text-primary)', marginBottom: '0px'}}>BoxPlan</h3>
              <p style={{marginTop: '0px', fontSize: '12px', color: 'var(--text-secondary)'}}>v{__APP_VERSION__}</p>
              
              <div style={{marginTop: '10px', fontSize: '13px', lineHeight: '1.6'}}>
                Minimalistischer Wochenplaner im Browser.<br />
                Lizenz: <strong>MIT License</strong>
              </div>

              <div style={{marginTop: '20px', fontSize: '12px', color: 'var(--text-secondary)'}}>
                Entwickelt von <br />
                <a href="https://github.com/blkrk4000" style={styles.aboutLink}>github.com/blkrk4000</a>
              </div>
              
              <div style={{fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.8}}>
                Realisiert mit Unterstützung von Google Gemini AI und Claude (Anthropic).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};