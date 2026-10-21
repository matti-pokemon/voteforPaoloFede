# Campagna Paolo & Federica

Sito statico (HTML + CSS + JS), nessuna installazione e nessun backend.

## File
- index.html: la pagina
- style.css: lo stile "poster elettorale" (colori in cima al file)
- script.js: quiz, schermata Patrizio, finale, accordion (le domande si modificano in cima al file)
- motivi.js: i 100 motivi
- manifesto.png: il poster (originale, non modificato)
- patrizio.jpg: la foto della schermata "Noi conosciamo Patrizio"
- video.mp4: il video della schermata finale (+ video-poster.jpg, il fotogramma mostrato prima del play)

## Percorso del quiz
Domanda 1 > Domanda 2 > Domanda 3 > Schermata Patrizio > Domanda 4 > FINE (video + 100 motivi)

## Aprirlo in locale
Doppio clic su index.html (Safari, Chrome, Edge, Firefox).

## Pubblicarlo su Vercel
1. Vai su vercel.com e accedi.
2. "Add New..." > "Project" e carica/importa la cartella (oppure: `npm i -g vercel`, poi `vercel` dentro la cartella).
3. Framework Preset: "Other", nessun build command. Deploy.
