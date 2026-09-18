# Cuaderno

Un cuaderno personal para canciones, poemas y escritos varios. Se sincroniza
entre dispositivos con la misma cuenta, funciona offline como PWA instalable,
y trae una sección para aprender formas poéticas (haiku, décima, copla,
soneto y más) con plantillas guiadas y conteo de sílabas aproximado.

Hecho con [Vite](https://vitejs.dev), JavaScript vanilla y
[Firebase](https://firebase.google.com) (autenticación + Firestore), pensado
para vivir en GitHub Pages.

## 1. Crear tu proyecto de Firebase

La app no trae backend propio: usa un proyecto de Firebase **tuyo** (gratis
en el plan Spark, más que suficiente para uso personal).

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) y creá un proyecto nuevo.
2. En **Authentication → Sign-in method**, habilitá el proveedor **Google**.
3. En **Firestore Database**, creá una base de datos (modo producción).
4. En **Firestore Database → Reglas**, pegá el contenido de [`firestore.rules`](./firestore.rules) de este repo y publicá. Así cada usuario solo puede leer/escribir sus propias notas.
5. En **Configuración del proyecto → General → Tus apps**, agregá una app web (ícono `</>`) y copiá el objeto `firebaseConfig` que te muestra.
6. En **Authentication → Settings → Authorized domains**, agregá el dominio donde vas a publicar la app, por ejemplo `tu-usuario.github.io` (y `localhost` ya suele venir agregado para desarrollo).

## 2. Configurar las variables de entorno

```bash
cp .env.example .env
```

Completá `.env` con los valores del `firebaseConfig` que copiaste:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` está en `.gitignore`: nunca se sube al repositorio.

## 3. Correr en local

```bash
npm install
npm run dev
```

Abrí la URL que te muestra la terminal (por defecto `http://localhost:5173`).

## 4. Publicar en GitHub Pages

El repo ya incluye un workflow (`.github/workflows/deploy.yml`) que compila y
publica la app en GitHub Pages cada vez que se hace push a `main`.

1. En **Settings → Secrets and variables → Actions → New repository secret**, cargá los mismos 6 valores de tu `.env` como secrets (con los mismos nombres: `VITE_FIREBASE_API_KEY`, etc.). El build de GitHub Actions los necesita para compilar la app con tus credenciales.
2. En **Settings → Pages → Build and deployment → Source**, elegí **GitHub Actions**.
3. Mergeá tus cambios a `main` (o corré el workflow manualmente desde la pestaña *Actions*).
4. Tu app va a quedar publicada en `https://<tu-usuario>.github.io/cuaderno/`.

Si cambiás el nombre del repositorio, actualizá el valor de `base` en
`vite.config.js` (`base: '/nombre-del-repo/'`) para que las rutas de la PWA
sigan funcionando.

## Qué incluye

- **Inicio de sesión con Google**: la misma cuenta en el celular y en la compu te muestra las mismas notas.
- **Sincronización automática y offline**: Firestore guarda una copia local y sincroniza sola en cuanto hay conexión.
- **Notas con tipo**: marcá cada escrito como Canción, Poema u Otro, y filtralos o buscalos.
- **Aprender formas poéticas**: guías de haiku, copla, redondilla, décima, romance, soneto y estructura de letra de canción, cada una con ejemplo, consejos y una plantilla para arrancar a escribir directamente en una nota nueva.
- **Contador de sílabas aproximado**: te muestra en vivo cuántas sílabas lleva cada verso mientras escribís con una forma guiada (aplica sinalefa y la ley del acento final; es una ayuda, no una regla estricta — el oído siempre manda).
- **Instalable como app** en el celular o la compu (PWA), con ícono propio y funcionamiento offline del "cascarón" de la app.

## Estructura del proyecto

```
src/
  firebase.js      Config e inicialización de Firebase (auth + Firestore offline)
  auth.js          Inicio/cierre de sesión con Google
  notes.js         CRUD de notas en Firestore
  forms-data.js    Contenido de las formas poéticas y sus plantillas
  syllables.js     Contador aproximado de sílabas en español
  views/           Pantallas: login, shell de la app, notas, aprender
```
