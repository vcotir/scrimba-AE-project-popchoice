# PopChoice

PopChoice is a movie recommendation app that asks what kind of movie mood you are in, then uses semantic search and OpenAI to suggest a fitting pick.

The React frontend collects three preferences:

- your favorite movie and why you like it
- whether you want something new or classic
- whether you want something fun, serious, or somewhere in between

The backend turns those answers into an embedding, searches Supabase for nearby movie context, and asks OpenAI to produce a short conversational recommendation.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Hook Form
- Zustand
- Hono server
- OpenAI embeddings and chat completions
- Supabase vector search

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file with:

```bash
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_API_KEY=your_supabase_api_key
```

## Database Setup

PopChoice needs a Supabase `movies` table populated with movie text chunks and embeddings.

First, create the table by running:

```text
reference_and_scripts/movies.sql
```

Then create the semantic search RPC by running:

```text
reference_and_scripts/db_semantic_search.sql
```

That script creates the `match_movies` RPC used by `server.js` to search movie embeddings.

Finally, seed the table from `movies.txt`:

```bash
node reference_and_scripts/db_seeding.js
```

The seeding script reads `movies.txt`, splits the movie details into chunks, creates OpenAI embeddings for each chunk, and inserts them into the Supabase `movies` table.

Run the frontend and backend together:

```bash
npm run dev
```

The Vite app runs in the browser, and the Hono API listens on:

```text
http://localhost:3000/recommendation
```

## How It Works

1. The user submits their movie preferences.
2. `server.js` combines those answers into a search query.
3. OpenAI creates an embedding for the query.
4. Supabase runs the `match_movies` RPC to find relevant movie context.
5. OpenAI writes the final recommendation using that context.

## Notes

This project expects Supabase to have movie content available for vector search and an RPC function named `match_movies`. The table is defined in `reference_and_scripts/movies.sql`, the RPC is defined in `reference_and_scripts/db_semantic_search.sql`, and `reference_and_scripts/db_seeding.js` loads the data from `movies.txt`. Without that database setup, the frontend will run, but recommendations will fail when the backend tries to search for matching movie context.
