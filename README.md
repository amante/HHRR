# MoMa HR — v1.2 (Vite) • Admin mejorado + GitHub Pages

Este paquete cumple con tus puntos **(1) Mejoras de Admin (sin backend)** y **(2) Frontend pro con Vite**.

## Qué incluye
- **Vite + React** con `base: '/HHRR/'` para publicar en `amante.github.io/HHRR`.
- **GitHub Actions** que hacen *build + deploy* automático a Pages.
- **Admin mejorado (sin backend)**:
  - Asignación de tareas a **agentes internos** (seed: Ana, Carlos, Sofía).
  - **Comentarios** por tarea con adjuntos **por URL**.
  - **Acciones masivas** (estado, prioridad, asignación).
  - **Paginación** (10 por página) y **exportación CSV** del listado filtrado.
- **Empresa**: edita datos de su empresa + CRUD de tareas.
- **Usuario**: consulta en solo lectura.

> Persistencia en `localStorage` (demo). En producción real conectaremos a API.

## Estructura
```
HHRR/
├─ index.html
├─ public/
│  ├─ 404.html
│  ├─ .nojekyll
│  └─ favicon.svg
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ storage.js
│  └─ utils.js
├─ package.json
├─ vite.config.js
└─ .github/workflows/pages.yml
```

## Publicación en GitHub Pages
1. Crea/usa el repo **HHRR** en tu cuenta `amante.github.io`.
2. Sube **todo** este contenido a la rama **main**.
3. Ve a **Actions** y observa **Build and Deploy to GitHub Pages**.  
   Al terminar, tu sitio queda en: `https://amante.github.io/HHRR/`.

## Dev local (opcional)
```bash
npm ci
npm run dev
# http://localhost:5173/HHRR/  (Vite usará base /HHRR/ en rutas)
```
```bash
npm run build && npm run preview
# preview en http://localhost:4173/HHRR/
```

## Credenciales demo
- Admin:   `admin@demo.com`   / `123456`
- Empresa: `empresa@demo.com` / `123456`
- Usuario: `usuario@demo.com` / `123456`

## Notas
- Para adjuntos sin backend, se admiten **URLs** (Drive, S3, etc.). Podemos ampliar a *Data URLs* con límite de tamaño.
- Si migras desde versiones previas, el sistema **migrará** datos y creará el Admin si no existe.
- La UI usa Tailwind desde CDN por simplicidad. Podemos integrarlo como dependencia (PostCSS) si lo prefieres.
