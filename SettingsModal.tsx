import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { TrashIcon, XIcon, DownloadIcon, UploadIcon } from "./Icons";
import { ViewMode } from "./types";

interface SettingsModalProps {
  onClose: () => void;
  handleClear: () => void;
  onApplyTemplate: (mode: ViewMode, template: string) => void;
  onDataChange: () => void; // Triggered after import
}

type Tab = "templates" | "data" | "docs" | "about";

export const SettingsModal = ({
  onClose,
  handleClear,
  onApplyTemplate,
  onDataChange
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("templates");
  
  // Templates State
  const [weekTemplate, setWeekTemplate] = useState("");
  const [yearTemplate, setYearTemplate] = useState("");
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWeekTemplate(localStorage.getItem("boxplan_template_week") || "");
    setYearTemplate(localStorage.getItem("boxplan_template_year") || "");
  }, []);

  const saveWeekTemplate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setWeekTemplate(val);
    localStorage.setItem("boxplan_template_week", val);
  };

  const saveYearTemplate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setYearTemplate(val);
    localStorage.setItem("boxplan_template_year", val);
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
          <button style={styles.modalCloseBtn} onClick={onClose}>
            <XIcon />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === "templates" ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "data" ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab("data")}
          >
            Daten
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "docs" ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab("docs")}
          >
            Hilfe
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === "about" ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab("about")}
          >
            Über
          </button>
        </div>

        <div style={styles.tabContent}>
          {/* TAB: Templates */}
          {activeTab === "templates" && (
            <>
              <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Wochen-Template</span>
                <textarea
                  style={styles.templateInput}
                  value={weekTemplate}
                  onChange={saveWeekTemplate}
                  placeholder="Standard-Inhalt für neue Wochen..."
                  spellCheck={false}
                />
                <button 
                  style={styles.secondaryButton}
                  onClick={() => {
                    onApplyTemplate("week", weekTemplate);
                    onClose();
                  }}
                >
                  Auf aktuelle Woche anwenden
                </button>
              </div>

              <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Jahres-Template</span>
                <textarea
                  style={styles.templateInput}
                  value={yearTemplate}
                  onChange={saveYearTemplate}
                  placeholder="Standard-Inhalt für Monate..."
                  spellCheck={false}
                />
                <button 
                  style={styles.secondaryButton}
                  onClick={() => {
                    onApplyTemplate("year", yearTemplate);
                    onClose();
                  }}
                >
                  Auf aktuelles Jahr anwenden
                </button>
              </div>
            </>
          )}

          {/* TAB: Data */}
          {activeTab === "data" && (
            <>
               <div style={styles.settingsSection}>
                <span style={styles.settingsLabel}>Backup</span>
                <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <button style={styles.actionButton} onClick={handleExport}>
                    <DownloadIcon /> Backup erstellen (.json)
                  </button>
                  
                  <label style={styles.fileInputLabel}>
                    <div style={styles.secondaryButton}>
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
                <button style={styles.dangerButton} onClick={handleClear}>
                  <TrashIcon /> Ansicht leeren
                </button>
              </div>
            </>
          )}

          {/* TAB: Docs */}
          {activeTab === "docs" && (
            <div style={{paddingBottom: '20px'}}>
              <span style={styles.settingsLabel}>Tastaturkürzel</span>
              
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
              
              <br />
              <span style={styles.settingsLabel}>Funktionen</span>
              <p style={{fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)'}}>
                <b>Templates:</b> Erstelle Vorlagen für deine Wochen- oder Jahresplanung. 
                Mit "Anwenden" wird die Vorlage zum existierenden Text der aktuellen Ansicht hinzugefügt.
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
              <p style={{marginTop: '0px', fontSize: '12px', color: 'var(--text-secondary)'}}>v0.1.7</p>
              
              <div style={{marginTop: '10px', fontSize: '13px', lineHeight: '1.6'}}>
                Minimalistischer Planer für macOS.<br />
                Lizenz: <strong>MIT License</strong>
              </div>

              <div style={{marginTop: '20px', fontSize: '12px', color: 'var(--text-secondary)'}}>
                Entwickelt von <br />
                <a href="https://github.com/blkrk4000" style={styles.aboutLink}>github.com/blkrk4000</a>
              </div>
              
              <div style={{fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.8}}>
                Realisiert mit Unterstützung von Google Gemini AI.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};