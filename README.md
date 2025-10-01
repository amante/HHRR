# MoMa HR — v1.2.3 (Vite + Tailwind) • Workflow incluido

Incluye el workflow de **GitHub Actions** (`.github/workflows/pages.yml`) para construir y publicar la app en **GitHub Pages**.

## Publicación
1. Sube todo este contenido al repo `amante.github.io/HHRR` (rama `main`).
2. En **Settings → Pages**, elige **Source: GitHub Actions**.
3. Haz un commit y ve a **Actions → Build and Deploy to GitHub Pages** hasta que termine en **success**.
4. Abre `https://amante.github.io/HHRR/`.

## Dev local
```bash
npm install
npm run dev       # http://localhost:5173/
npm run build
npm run preview   # http://localhost:4173/HHRR/
```

Notas:
- `vite.config.js` ya tiene `base: '/HHRR/'`.
- `index.html` usa rutas relativas (`./src/main.jsx`, `favicon.svg`).
