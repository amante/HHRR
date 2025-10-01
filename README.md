# MoMa HR — v1.1 con Administración (GitHub Pages listo)

Perfiles: **Admin**, **Empresa**, **Usuario**.  
El **Admin** puede ver y gestionar (cambiar estado) las **solicitudes** (tareas) de todas las empresas.

## URL esperada del proyecto
- https://amante.github.io/HHRR/

## Estructura
```
HHRR/
├─ index.html
├─ 404.html
├─ .nojekyll
├─ assets/
│  ├─ js/app.jsx
│  ├─ css/styles.css
│  └─ img/favicon.svg
└─ .github/workflows/pages.yml
```

## Credenciales demo
- Admin:   `admin@demo.com`   / `123456`
- Empresa: `empresa@demo.com` / `123456`
- Usuario: `usuario@demo.com` / `123456`

## Cómo publicar
1. Crea (o usa) el repo **HHRR** en `amante.github.io`.
2. Sube el contenido del ZIP a la rama **main**.
3. Revisa **Actions** → *Deploy to GitHub Pages*.
4. Verás el sitio en **https://amante.github.io/HHRR/**.

> Nota: Esta demo es 100% estática con CDN (React, ReactDOM, Tailwind, Babel). En producción real migraremos a build (Vite) y API.

## Qué incluye el panel Admin
- Resumen de **tareas pendientes** y **desglose por prioridad** y **por empresa**.
- Listado de todas las solicitudes con filtros (búsqueda, estado, prioridad, empresa).
- Cambio de estado rápido (➡️ avanza estados).
