# MoMa HR — v1 (para GitHub Pages en `amante.github.io/HHRR`)

Este repo está listo para publicarse en **GitHub Pages** como **Project Site** en tu cuenta `amante.github.io`, repositorio **HHRR**.

## URL final
- https://amante.github.io/HHRR/

## Estructura
```
HHRR/
├─ index.html
├─ 404.html                # fallback (útil para SPAs o enlaces profundos)
├─ .nojekyll               # evita procesamiento de Jekyll
├─ assets/
│  ├─ js/app.jsx
│  ├─ css/styles.css
│  └─ img/favicon.svg
└─ .github/workflows/pages.yml
```

## Publicación automática (GitHub Actions)
Ya viene configurado el workflow **`.github/workflows/pages.yml`** que, al **hacer push a `main`**, despliega el sitio a GitHub Pages. No requiere build (solo HTML/JS/CSS estático).

### Pasos
1. Crea el repo en GitHub: **HHRR** (público o privado con Pages activado).
2. Sube todos los archivos de este ZIP a la rama **main**.
3. Ve a **Actions** del repo y verifica la ejecución **Deploy to GitHub Pages**.  
   Al terminar, tu sitio quedará disponible en **https://amante.github.io/HHRR/**.

> Si prefieres no usar Actions, también puedes ir a **Settings → Pages → Build and deployment** y elegir **Deploy from a branch** con **Branch: `main` / Folder: `/ (root)`**. En ese caso puedes borrar el workflow.

## Credenciales demo
- Empresa: `empresa@demo.com` / `123456`  
- Usuario: `usuario@demo.com` / `123456`

> La demo usa CDN de React, ReactDOM, Babel y Tailwind, por lo que el sitio necesita salida a Internet. Los datos persisten en `localStorage` del navegador.

## Próximos pasos
- Migrar a build con Vite/React para entregar JS transpileado y minificado.
- Backend (Node + Express + PostgreSQL) con JWT, multiempresa y RBAC.
