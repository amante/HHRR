# MoMa HR — v1.3 (Vite + Tailwind) • Admin avanzado

Incluye **GitHub Actions** (`.github/workflows/pages.yml`) y mejoras del Admin:

- **Filtros pro**: rango de fechas (creada y vence), *solo vencidas*, persistencia de filtros en `localStorage`.
- **Productividad**: duplicar tarea (individual y masivo), edición **inline** de título/descr. (Enter para guardar, Escape para cancelar).
- **Agentes (CRUD)**: alta/edición/eliminación de agentes; reasignación en cascada al eliminar.

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
