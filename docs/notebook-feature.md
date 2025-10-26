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
* Click "Save Notebook" to persist changes to the local filesystem (`./data/sessions`). You might be prompted for the `EDITOR_SECRET` if it wasn't found in local storage.

## Vercel Deployment Notes

* **Ephemeral Filesystem:** Vercel's serverless functions have an ephemeral filesystem. **You cannot use the local filesystem adapter (`filesystem.ts`) for persistent storage in production.** Data written during a function invocation will be lost shortly after.
* **Required Action:** For production deployment on Vercel, you **must** configure and use an external storage solution like:
    * AWS S3
    * Supabase Storage
    * Cloudflare R2
    * Other S3-compatible services (e.g., Minio self-hosted)
* **Adapter Implementation:** An adapter (like the stub `s3.ts` - to be implemented) needs to be created and configured using environment variables (e.g., `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`).
* **Environment Variables:** Ensure all necessary environment variables (including `EDITOR_SECRET` if using basic auth, or keys for your chosen storage and proper auth provider) are set in your Vercel project settings. **Never commit secrets to Git.**
* **Authentication:** The skeleton uses a basic, insecure secret check suitable only for local development. **For production, implement proper authentication** (e.g., OAuth via GitHub/Google, Supabase Auth, Lucia Auth) and associate notebooks with user IDs. Update the API endpoints (`isEditor`, `checkEditorSecret`) accordingly.

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