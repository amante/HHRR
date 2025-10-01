# MoMa HR — v1.4 (Vite + Tailwind) • Tablero Kanban con drag & drop

Novedades:
- **Tablero Kanban** (Admin y Empresa) con **arrastrar & soltar** entre estados (HTML5 DnD, sin dependencias).
- Persistencia de **vista** (Tabla/Kanban) por perfil en `localStorage`.
- Mantiene filtros, CRUD de agentes y todo lo de v1.3.
- Incluye **GitHub Actions** para **Pages** (`.github/workflows/pages.yml`).

## Publicación
1. Sube todo este contenido al repo `amante.github.io/HHRR` (rama `main`).
2. En **Settings → Pages**, elige **Source: GitHub Actions**.
3. Haz un commit y revisa **Actions → Build and Deploy to GitHub Pages** (success).
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
- DnD: arrastra una tarjeta y suéltala sobre la columna destino; queda arriba de esa columna.
