# Online Football Tycoon Web

Una aplicación web de gestión de fútbol construida con Vue 3 y Vite, que permite visualizar temporadas, clasificaciones, partidos y resultados.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Production Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. Follow these steps:

1. **Install Vercel CLI** (if not already installed):
   ```sh
   npm install -g vercel
   ```

2. **Build the project**:
   ```sh
   npm run build
   ```

3. **Deploy to Vercel**:
   ```sh
   vercel --prod
   ```

### Environment Variables

Make sure to set the following environment variables in your Vercel dashboard:

- `VITE_API_BASE_URL` - The base URL of your API backend

### Routing Configuration

The project includes a `vercel.json` file for proper client-side routing support. This ensures that all routes work correctly in production.

## Páginas y Funcionalidades

### 🏠 Página Principal
- **Ruta:** `/`
- **Descripción:** Dashboard principal de la aplicación

### 🏆 Clasificación de la Temporada
- **Ruta:** `/season/{season_id}/classification`
- **Funcionalidades:**
  - Visualización de la tabla de posiciones con nombres de torneos y banderas de países
  - Soporte para códigos de país ISO 3166-1 alpha-3 (ESP → 🇪🇸)
  - Indicadores visuales para posiciones (top 3, descenso, zona segura)
  - Botón de navegación para ver partidos de la temporada
- **Ejemplo:** `/season/c68be717-d38d-4e9d-9c25-128f36fb0af2/classification`

### ⚽ Partidos de la Temporada
- **Ruta:** `/season/{season_id}/matches`
- **Funcionalidades:**
  - Lista de partidos ordenados por fecha (más reciente primero)
  - Diferenciación visual entre partidos jugados y pendientes
  - **Partidos jugados:** Botón "Ver" para acceder a detalles
  - **Partidos pendientes:** Botón "Jugar" para ejecutar la simulación
  - Navegación automática a detalles tras simular un partido
  - Botón para navegar a la clasificación
- **Ejemplo:** `/season/c68be717-d38d-4e9d-9c25-128f36fb0af2/matches`

### 🎯 Detalles del Partido
- **Ruta:** `/match/{match_id}`
- **Funcionalidades:**
  - Marcador estilo estadio con nombres de equipos y resultado final
  - Timeline cronológico de eventos del partido
  - Storytelling de eventos con iconos, descripciones y traducciones en español
  - Diferenciación visual entre eventos importantes y regulares
  - Botón para navegar a la clasificación de la temporada
  - Diseño completamente responsive
- **Ejemplo:** `/match/89804c9a-7984-495a-8a1c-47e9a431393f`

## API Integration

La aplicación se conecta con los siguientes endpoints:

- `GET /season/{season_id}/classification` - Obtener clasificación
- `GET /match/season?season_id={season_id}` - Obtener partidos de temporada
- `GET /match/{match_id}` - Obtener detalles del partido
- `POST /match/play` - Simular partido (body: `{season_id, match_id}`)

## Características Técnicas

- **Vue 3** con Composition API
- **Vue Router** para navegación SPA
- **Responsive Design** optimizado para móviles
- **Estado de carga** y manejo de errores
- **Traducciones** y iconos emoji para eventos
- **Navegación contextual** entre páginas relacionadas
