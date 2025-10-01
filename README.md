# MoMa HR — v1.2.1 (Vite + Tailwind PostCSS) • Fixes

Soluciona los errores que viste:
1) **Tailwind CDN** → Ahora Tailwind está instalado como **PostCSS plugin** (sin warnings de producción).
2) **MIME text/jsx** → `index.html` ya apunta a `/src/main.jsx` (Vite lo reescribe a JS en `dist`).
3) **favicon 404** → Favicon en `public/` y `href="/favicon.svg"` (Vite lo sirve en la raíz del sitio).

## Publicación en GitHub Pages
1. Sube todo este contenido a tu repo `amante.github.io/HHRR` (rama `main`).
2. En **Actions**, corre **Build and Deploy to GitHub Pages**.
3. La app quedará en `https://amante.github.io/HHRR/`.

## Dev local
```bash
npm install
npm run dev      # http://localhost:5173/
npm run build
npm run preview  # http://localhost:4173/HHRR/
```

## Nota
- El `base: '/HHRR/'` ya está configurado en `vite.config.js`.
- El workflow usa `npm install` (sin `package-lock.json`). Si prefieres lockfile, lo generamos y cambiamos a `npm ci`.
