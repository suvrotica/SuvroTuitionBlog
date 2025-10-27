# Whiteboard Notebook Feature - Developer Guide

This document outlines the setup and usage for the whiteboard notebook feature within the SuvroGhosh.Blog project.

## Development Setup (Windows)

1.  **Prerequisites:**
    * Node.js (LTS version recommended - check project's `.nvmrc` or `package.json` engines field if available, otherwise use latest LTS).
    * `pnpm` (recommended), `npm`, or `bun` package manager. Git.
2.  **Clone & Install:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    pnpm install # or npm install / bun install
    ```
3.  **Environment Variables:**
    * Create a `.env` file in the project root.
    * Add the `EDITOR_SECRET` variable. This is a **required** secret string used for basic authentication during development to allow saving notebooks. Choose a strong, random string.
      ```dotenv
      # .env
      EDITOR_SECRET="your_very_strong_random_secret_here_12345"
      KV_REST_API_URL="https://your-redis-instance.upstash.io"
      KV_REST_API_TOKEN="your-token-here"
      ```
    * **DO NOT** commit your `.env` file to Git.
4.  **Run Development Server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5173` (or the configured port).
5.  **Data Storage:** Notebooks created during development are stored as JSON files in the `./data/sessions/` directory. This directory is ignored by Git (except for `.gitkeep`).

## Usage

* Navigate to the main blog page (`/blog`).
* Click the "New Notebook" button. You will be redirected to the editor page for the new notebook.
* Use the "Add Ink Section" button to create drawing areas.
* Draw within the ink sections.
* Click "Save Notebook" to persist changes to Redis KV storage. You might be prompted for the `EDITOR_SECRET` if it wasn't found in local storage.

## Vercel Deployment Notes

* **Storage Solution:** The app uses Upstash Redis KV for persistent storage. This works seamlessly on Vercel's serverless platform.
* **Required Action:** For production deployment on Vercel:
    1. Create an Upstash Redis database at https://console.upstash.com/
    2. Or use Vercel's built-in KV storage (Storage tab in your project)
    3. Set the required environment variables in Vercel project settings
* **Environment Variables:** Ensure these environment variables are set in your Vercel project settings:
    * `KV_REST_API_URL` - Your Upstash Redis REST API URL
    * `KV_REST_API_TOKEN` - Your Upstash Redis REST API token
    * `EDITOR_SECRET` - A strong random secret for notebook editing (**PRIVATE**, not PUBLIC)
* **Authentication:** The current implementation uses a basic, insecure secret check suitable only for development. **For production, implement proper authentication** (e.g., OAuth via GitHub/Google, Supabase Auth, Lucia Auth) and associate notebooks with user IDs. Update the API endpoints (`isEditor`, `checkEditorSecret`) accordingly.

## Next Steps (Post-Skeleton)

* Implement proper authentication.
* Implement the S3/Supabase storage adapter.
* Add Markdown, Code, and Title section components and editing.
* Implement section reordering (UI and PATCH endpoint logic).
* Add versioning/history tracking to the storage adapters and PATCH endpoint.
* Implement SVG export functionality.
* Add stroke simplification (`simplify-strokes.ts`).
* Implement undo/redo stack (client-side).
* Add conflict detection (409 status on PATCH).
* Refine UI/UX (toolbar, collapse, minimap).
* Add comprehensive tests (unit, integration, E2E).
* Implement the `/notebook/[id]` read-only view route.