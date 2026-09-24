# Notes

> Draft. Rewrite the sections marked (edit) in your own words before submitting: you'll be asked to explain them live.

## Choices

- **Next.js App Router with plain JavaScript.** Fewer moving parts to explain than TypeScript, and the App Router gives route middleware for free.
- **URL is the source of truth.** List state is never copied into `useState`; `useProductQuery` reads it from the URL and writes it back. Refresh, Back and shared links all work for free.
- **Services + hooks + components.** UI files never call Axios. Components call hooks, hooks call `services/`, and services use the single Axios instance.
- **Hand-written debounce.** A `setTimeout` inside the input handler. Simple enough to explain, and it avoids an extra effect.
- **Search and category are exclusive.** Client-side filtering of search results would make `total` and pagination wrong, so the app doesn't pretend the API can do both.
- **Simulated writes via an overlay.** Keeps real API calls (and real errors) but makes changes visible and persistent across refresh.

## A problem and the fix (edit)

The search box has two owners: the user typing and the URL. My first version synced them with an effect (`value -> setText`). While the user typed "abc", the URL update from the earlier "ab" arrived and overwrote the box with "ab", so letters vanished. Fix: `SearchBox` remembers the last value it pushed (`lastSent` ref) and only copies from the URL when the URL differs from that, meaning the change came from somewhere else (Back button, category selection).

## Where AI helped (edit)

- Scaffolding the project structure and boilerplate (config, Tailwind setup, component skeletons).
- Suggesting the `AbortController` pattern for stale responses and the overlay approach for simulated writes.
- Reviewing edge cases: bad query params, double submits, open-redirect safety on `?next=`.

I read and can explain every file. Things to be ready to walk through: the Axios interceptors, `useProducts` cleanup, `parseParams`, `SearchBox`, and `applyOverlay`.
