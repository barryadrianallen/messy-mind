# Messy Mind

Messy Mind is a mobile-first Progressive Web App (PWA) designed to provide a structured, sensory-considerate, and user-friendly task management tool for families with neurodivergent members. It enables parents to assign and monitor tasks, and children to engage with their routines clearly and effectively.

## ✨ Features

*   Parent Dashboard for task management and child monitoring.
*   Child Dashboard for viewing and completing assigned tasks.
*   Family Settings for managing family members and app preferences.
*   User authentication via Supabase (Email/Password for parents).
*   Theme selection for a personalized user experience.

## 🛠️ Tech Stack

*   **Frontend:** [Nuxt 3](https://nuxt.com/) (Vue.js framework)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Authentication:** [Supabase](https://supabase.io/)
*   **Testing:** [Vitest](https://vitest.dev/) with [Vue Test Utils](https://test-utils.vuejs.org/)
*   **Language:** JavaScript

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS version recommended - check `.nvmrc` if present, otherwise latest LTS)
*   npm (comes with Node.js)
*   Supabase CLI (if managing local Supabase instance): `npm install supabase --save-dev` or globally.
*   Docker Desktop (for running local Supabase instance).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd messy-mind
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file at the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in `.env`:
    *   `NUXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    *   `NUXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon key.
    *(For local development, these will point to your local Supabase instance, typically `http://localhost:54321` for the URL).*

4.  **Initialize local Supabase instance (if not already running):**
    Ensure Docker Desktop is running.
    ```bash
    npx supabase start
    ```
    This will also output your local Supabase URL and anon key if you haven't set them up yet. Apply any pending database migrations:
    ```bash
    npx supabase db reset # Resets local db and applies all migrations
    # OR
    # npx supabase migration up # Applies new migrations
    ```

### Running the Development Server

Once the setup is complete, you can run the Nuxt development server:

```bash
npm run dev
```

The application should now be accessible at `http://localhost:3000`.

## ✅ Running Tests

To run the test suite:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Supabase

*   Local Supabase Studio: `http://localhost:54323`
*   Make sure to stop Supabase when you're done to free up resources:
    ```bash
    npx supabase stop
    ```

---

This README provides a basic guide. Feel free to expand it with more details about project structure, contribution guidelines, or deployment.
