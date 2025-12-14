# Base Cloudflare Template (Vite + React + TS)

This is the **Golden Template** for [wasiq.co] applications.

## Features
- **Frontend**: Vite, React, TypeScript, TailwindCSS
- **Backend**: Cloudflare Pages Functions (`/functions`)
- **Routing**: SPA routing handled via `public/_redirects`
- **UI**: Default black screen with centered "wasiq.co"

## How to Use
1. Clone this repository for a new project.
2. Run `npm install`.
3. Run `npm run dev` to start the frontend.
   - Note: To test Backend Functions locally, use `npx wrangler pages dev dist` (after building) or configure `wrangler` proxy.

## Deployment
**Recommended Method (Professional Setup)**:
1. Run `npm run build` to generate the `dist` folder.
2. Run `npx wrangler deploy`.
   - This uses the `wrangler.jsonc` configuration to deploy the `dist` folder as static assets.

**Alternative**:
- Cloudflare Pages automatic build detection (Build command: `npm run build`, Output: `dist`).

## AI Agent Context
If you are an AI agent reading this:
- **Do not remove** the `_redirects` file; it is critical for SPA routing.
- **Maintain** the TailwindCSS setup.
- **Respect** the default dark theme unless instructed otherwise.
