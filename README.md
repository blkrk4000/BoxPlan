# BoxPlan

Ein einfacher Wochenplaner. Einfach in die Tagesboxen tippen, fertig.

**Live:** https://blkrk4000.github.io/BoxPlan/

## Funktionen

- **Wochenansicht:** eine Box pro Wochentag, die heutige ist hervorgehoben und fokussiert
- **Jahresansicht:** eine Box pro Monat
- **Tab / Shift+Tab** springt zur nächsten bzw. vorherigen Box, `Cmd/Ctrl+1` wechselt zwischen Woche und Jahr
- **Suche** über alle Einträge
- **Vorlagen** für Woche und Jahr (anhängen oder ersetzen)
- **Backup:** Export und Import als JSON
- Hell/Dunkel, mehrere Farbschemata, einstellbare Schriftgröße

## Datenspeicherung

Alle Einträge liegen ausschließlich im `localStorage` deines Browsers. Es gibt keinen Server und kein Konto, es werden keine Daten übertragen.

- Die Daten gelten pro Browser, Gerät und Adresse. `localhost` und die GitHub-Pages-Adresse haben getrennte Daten.
- Löschst du die Browserdaten, sind die Einträge weg. Mach deshalb regelmäßig einen Export (Einstellungen → Daten).

## Lokal starten

Voraussetzung: Node.js

```
npm install
npm run dev
```

Die App läuft dann auf http://localhost:3000. Ein API-Key wird nicht benötigt.

## Deployment

Jeder Push auf `main` baut die App und veröffentlicht sie per GitHub Actions auf GitHub Pages (`.github/workflows/deploy.yml`).

## Lizenz

MIT
