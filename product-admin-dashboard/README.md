# Product Admin Dashboard

Admin dashboard built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS 3** and **Axios**, using the free [DummyJSON](https://dummyjson.com) API.
No React Query, SWR or table/pagination libraries: all logic is written by hand.

- Live demo: `<add your Vercel/Netlify link>`
- Design decisions, one problem I hit, and where AI helped: see [NOTES.md](./NOTES.md)

## Setup

Requires Node.js 18.17 or newer.

```bash
npm install
cp .env.example .env.local   # optional, defaults work
npm run dev                  # http://localhost:3000
```

Log in with **emilys / emilyspass**.

```bash
npm run build && npm start   # production build
npm run lint
```

### Dependencies (single package, installed from the project root)

```bash
# runtime
npm install next@14 react@18 react-dom@18 axios
# dev
npm install -D tailwindcss@3 postcss autoprefixer eslint@8 eslint-config-next@14
```

### Environment variables (all optional)

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API base URL. Default `https://dummyjson.com` |
| `NEXT_PUBLIC_API_DELAY` | Adds `?delay=<ms>` to list/detail requests. Set `2000` to test slow responses |

## What's finished

- [x] Login (`POST /auth/login`), error message for wrong details, logout button
- [x] Protected routes: middleware redirects logged-out users to `/login` (with a safe `?next=` return)
- [x] Product list: table on desktop, cards on mobile (image, title, category, price, rating, stock)
- [x] Server-side pagination (`limit` / `skip`), page numbers, Previous/Next, page size 10/20/50, "Showing 21–40 of 194"
- [x] Debounced search (`/products/search?q=`), resets to page 1
- [x] Category filter (`/products/categories`) and sort by price / rating / title
- [x] Product details at `/products/[id]`: image gallery, description, price, reviews; not-found page for bad ids
- [x] Add / edit (validated form) and delete (confirm popup)
- [x] Loading, empty and error states, with a Retry button
- [x] One shared Axios file (`src/lib/axios.js`): adds the token, handles errors centrally
- [x] Page, limit, search, category and sort all live in the URL
- [x] Stale-response protection, bad-URL protection, double-click protection

## Project structure

```
src/
  middleware.js        route protection
  app/                 routes: /login, /products, /products/[id], not-found pages
  components/
    ui/                Loader, ErrorState, EmptyState, Modal, ConfirmDialog
    layout/            Header (logout)
    auth/              LoginForm
    products/          ProductListView, ProductTable, ProductCards, Pagination, SearchBox,
                       CategoryFilter, SortSelect, ProductForm, ProductDetail, ...
  hooks/               useProductQuery (URL state), useProducts, useProduct, useCategories, useProductActions
  services/            authService, productService  <- every API call is here
  lib/                 axios (shared instance), auth, query (URL parsing), overlay, validation, ...
  context/             LocalChangesContext (simulated writes), ToastContext
```

## How the tricky parts work

**Fast typing / stale results.** Each request is made in an effect with its own `AbortController`. When the search text changes, the effect cleanup aborts the previous request; an aborted request is ignored, so an old response can never replace a newer one. Test with `NEXT_PUBLIC_API_DELAY=2000`.

**Search + category.** The API can't do both, so the app makes them mutually exclusive: choosing a category clears the search and typing a search clears the category (a hint under the toolbar says so). Reason: filtering search results by category in the browser would break server-side pagination and the total count. If both appear in a URL, search wins.

**Add / edit / delete aren't saved by the API.** The app still calls the API (so loading and error handling are real), then records the change in `LocalChangesContext`, saved in `localStorage`, and lays it over API responses (`src/lib/overlay.js`):
new products appear at the top of page 1 (ids from 100000 up), edits replace the API version, deleted products are hidden, and the total is adjusted. "Discard local changes" in the header resets everything. Trade-off: a page can be one row longer or shorter than the page size.

**Bad URL values.** `parseParams` (`src/lib/query.js`) validates everything: `?page=abc` -> 1, `?limit=15` -> 10, unknown `sort` is ignored. `?page=999` loads, sees the real total, and redirects to the last page. `/products/abc` shows "not found" immediately.

**Repeated clicks.** Login, Save and Delete use a `useRef` lock (updates instantly, unlike state) plus a disabled button, so only one request is ever in fly

**Auth.** The token is stored in a cookie so `middleware.js` can protect pages on the server, and the Axios request interceptor adds it as `Authorization: Bearer`. A 401 clears the session and redirects to `/login`. The cookie is readable by JavaScript; a production app would use an `httpOnly` cookie set by a server route.

## Deploy

Push to GitHub, import the repo in Vercel or Netlify. No settings needed (framework: Next.js).
