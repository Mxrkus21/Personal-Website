# Markus Baier: persönliches Portfolio

Diese ZIP enthält den vollständigen Quellcode für einen responsiven und zweisprachigen One-Pager. Version 4 setzt weitere Anpassungen an Farbgestaltung, Hero, Studienchronologie, Projekten und Kontaktformular um und enthält das bereitgestellte Kartenspiel-Foto.

Die Website ist noch ein **Prototyp**. Ein Porträt, weitere Projektbilder, genauer Studienschnitt, ein sicherer Nachrichtenversand und geprüfte Rechtstexte müssen vor einer Veröffentlichung ergänzt werden.

## Lokal starten

Python 3 und einen modernen Browser verwenden:

```bash
cd dist
python3 -m http.server 8000
```

Anschließend `http://localhost:8000` öffnen. Die JSON-Sprachressourcen werden per `fetch` geladen. Deshalb funktioniert das direkte Öffnen über `file://` möglicherweise nicht. Es ist kein Build-Schritt und kein Paketmanager nötig.

## Gestaltung und Aufbau

Die Website folgt einer redaktionellen Gestaltungslogik. Die Person steht zuerst im Mittelpunkt. Darauf folgen persönliche Interessen, die offen sichtbare Studienchronologie und eine Auswahl eigenständig entstandener Projekte. Kontakt bildet den Abschluss.

- **Topbar:** Der Name wird in der goldenen Akzentfarbe dargestellt.
- **Hero:** weiterhin bewusst kompakt. Der Nachname ist goldfarben, darunter steht ein einziger kurzer Einführungssatz. Das Porträt bleibt vorerst ein Platzhalter.
- **Persönlich:** kurzer Einstieg bleibt sichtbar, weitere Inhalte lassen sich aufklappen. Das selbst entwickelte Kartenspiel wird zusammen mit dem bereitgestellten Originalfoto gezeigt.
- **Studium:** Ein kurzer Subtext bleibt sichtbar, die gesamte Chronologie ist auf Wunsch aufklappbar. Auf dem Desktop stehen dann alle drei Kategorien nebeneinander; mobil gibt es einen Kategorien-Umschalter. Die drei nächsten Ziele stehen weiterhin unter Initiative und Entwicklung. Der Subtext ist vorläufig, da der genaue gewünschte Wortlaut noch fehlt.
- **Projekte:** Projektnamen, Kategorien und Tech-Stack bleiben immer sichtbar. Die vollständigen Beschreibungen und Details sind darunter aufklappbar. Auf dem Desktop steht das App-Bild links und das Primzahl-Bild rechts.
- **Kontakt:** Überschrift, Text und breites Formular stehen untereinander. Das Formular hat exakt drei Felder. Der Sende-Button ist goldfarben umrandet und nicht gefüllt; fokussierte Felder ändern nur ihre Rahmenfarbe.

Für die Gestaltung werden eine ruhige Grundfläche, deutliche Schriftgrößenunterschiede und großzügiger Raum verwendet. Der Dark Mode nutzt dunkles Anthrazit mit heller Hauptschrift, gedämpftem Sekundärtext und goldenen Akzenten. Das gleiche semantische Farbsystem gilt für alle Abschnitte. Für den Light Mode werden dieselben Rollen mit passenden Kontrastwerten definiert.

## Dateistruktur

```text
dist/
  index.html
  impressum.html
  datenschutz.html
  css/
    tokens.css
    main.css
  js/
    config.js
    i18n.js
    content.js
    interactions.js
    contact.js
    app.js
  locales/
    de.json
    en.json
  assets/
    kartenspiel.jpeg
tests/
  check.mjs
```

## Inhalte und Design ändern

- Alle sichtbaren und sprachabhängigen Texte liegen in `dist/locales/de.json` und `dist/locales/en.json`. Die Dateien besitzen die gleiche Schlüsselstruktur. Im HTML verweisen `data-i18n` und `data-i18n-attr` auf diese Schlüssel.
- Schriftgrößen, Farben, Abstände und Bewegungseinstellungen liegen zentral in `dist/css/tokens.css`. Layoutregeln stehen in `dist/css/main.css`.
- Die statische HTML-Struktur steht in `dist/index.html`. Die Datei ist bewusst mit gut lesbaren Einrückungen formatiert.
- Die mobile Studienansicht wird in `dist/js/content.js` aus den Sprachdateien aufgebaut. Desktop und Mobilansicht verwenden dieselben Studieninhalte. Die Projektdetails sind als verständliche HTML-Struktur hinterlegt und werden mit den Texten aus den Sprachdateien gefüllt.
- Die Öffnungszustände von Persönlich, Studium und den beiden vollständigen Projektvorstellungen verwaltet `dist/js/interactions.js`. Sie sind unabhängig voneinander.
- Sprache und Theme werden zunächst aus Browser und System übernommen. Eine manuelle Auswahl hat Vorrang und wird, soweit möglich, lokal gespeichert.
- Bewegung wird reduziert, wenn das Betriebssystem `prefers-reduced-motion` meldet.

## Kontaktformular

Das Formular überprüft Pflichtfelder und E-Mail-Format. Die Fehlermeldungen sind auf Deutsch und Englisch vorhanden. Ein Versand ist derzeit nicht eingerichtet. Deshalb zeigt die Seite erst nach einem gültigen Sendeversuch die entsprechende Fehlermeldung, aber **niemals einen falschen Erfolg**.

Für echten Versand muss ein sicherer Backend-Endpunkt eingerichtet und in `dist/js/config.js` als `contactEndpoint` hinterlegt werden. Der Client erwartet dann eine erfolgreiche HTTP-Antwort mit `{ "ok": true }`. Ein produktiver Server benötigt zusätzlich serverseitige Validierung, Spam-Schutz, Rate-Limiting, Datenschutzmaßnahmen und eine zuverlässige Versandlösung.

## Vor der Veröffentlichung

1. Echtes Porträt, App-Screenshots und mathematische Visualisierungen einsetzen. Das Foto des Kartenspiels ist bereits eingebunden.
2. Offene akademische Zeitangaben und den genauen Studienschnitt ergänzen.
3. Kontaktadresse und funktionsfähiges Backend einrichten.
4. Impressum und Datenschutzerklärung vollständig erstellen und prüfen.
5. Alle Angaben und Texte noch einmal inhaltlich abstimmen.
6. Darstellung und Tastaturbedienung auf echten Mobilgeräten und Desktop-Browsern testen.

## Automatische Prüfungen

Im Projektverzeichnis ausführen:

```bash
node tests/check.mjs
```

Das Skript prüft insbesondere die identischen Sprachstrukturen, existierende Textschlüssel, die vorgesehenen Inhaltsbereiche und das Fehlen der ausgeschlossenen Satzzeichen in den sichtbaren Sprachressourcen.

Stand: 7. November 2026. Die ZIP ist für eine lokale Vorschau und die weitere Entwicklung vorgesehen, nicht als direkt veröffentlichte Produktionswebsite.
