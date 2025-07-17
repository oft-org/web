# online-football-tycoon-web

This template should help get you started developing with Vue 3 in Vite.

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

The project includes a `vercel.json` file for proper client-side routing support. This ensures that all routes (including `/season/:season_id/classification`) work correctly in production.

### Accessing the Classification Page

To view the league classification, navigate to:
```
/season/{season_id}/classification
```

Example:
```
/season/c68be717-d38d-4e9d-9c25-128f36fb0af2/classification
```
