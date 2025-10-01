# MoMa HR — v1.1.1 con Administración (GitHub Pages listo)

Perfiles: **Admin**, **Empresa**, **Usuario**.  
El **Admin** puede ver y gestionar (cambiar estado) las **solicitudes** (tareas) de todas las empresas.

## Importante (tu caso)
En instalaciones previas de la demo, el navegador pudo guardar datos antiguos sin usuario Admin.  
Esta versión **migra/crea** el Admin automáticamente y agrega un botón de **“Restablecer demo”** en el login.

## URL esperada
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
1. Sube el contenido del ZIP al repo **HHRR** (rama **main**).
2. Revisa **Actions** → *Deploy to GitHub Pages*.
3. Abre **https://amante.github.io/HHRR/** y, si ves errores de credenciales:
   - Haz clic en **“Restablecer demo (limpiar datos locales)”** en la pantalla de login, o
   - Limpia el **Local Storage** del sitio y recarga.

> Demo estática con CDNs (React, ReactDOM, Tailwind, Babel). En producción real migraremos a build (Vite) y API.
