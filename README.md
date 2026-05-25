# FDVweb Arbeidsordre

Webapp for å opprette arbeidsordrer i FDVweb. Fungerer på mobil og desktop.

## Filer

```
index.html                   — Frontend
netlify.toml                 — Netlify-konfigurasjon
netlify/functions/token.js   — Serverless proxy (løser CORS for token)
```

## Deploy på Netlify (gratis, kobles til GitHub)

1. Gå til **[netlify.com](https://netlify.com)** og logg inn med GitHub
2. Klikk **Add new site → Import an existing project**
3. Velg **GitHub** → velg dette repoet
4. La alle innstillinger stå som de er — klikk **Deploy site**
5. Ferdig! Du får en URL som `https://ditt-navn.netlify.app`

Netlify leser `netlify.toml` automatisk og setter opp funksjonen.

## Repo-struktur

```
/
├── index.html
├── netlify.toml
├── README.md
└── netlify/
    └── functions/
        └── token.js
```
