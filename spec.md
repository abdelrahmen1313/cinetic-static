# Developer specification — script and API

This document explains how `script.js` works, the TMDB endpoints used, expected data shapes, DOM hooks, and developer notes for extending or testing the project.

## Quick file map

- `index.html` — app HTML and modal container
- `style.css` — styling
- `script.js` — single client-side script that (a) fetches data from TMDB, (b) renders movie list, and (c) renders movie detail modal

## High-level behavior

- On `DOMContentLoaded` the app calls `fetchMovies(currentCategory)` where `currentCategory` defaults to `popular`.
- Category buttons change `currentCategory` to `popular`, `top_rated`, or `upcoming` and re-fetch movies.
- The search control sets `currentCategory` to `search` and calls the search endpoint.
- Clicking a movie card calls `showMovieDetails(movie.id)` which fetches movie details and videos in parallel.

## Constants in `script.js`

- `API_KEY` — The TMDB API key string (currently hard-coded). Replace with your own key for local development.
- `BASE_URL` — `https://api.themoviedb.org/3`
- `IMAGE_BASE_URL` — `https://image.tmdb.org/t/p`

## Endpoints used

- Search movies: GET `${BASE_URL}/search/movie?api_key=${API_KEY}&query={query}`
- Category list: GET `${BASE_URL}/movie/{category}?api_key=${API_KEY}` where `{category}` is one of `popular`, `top_rated`, `upcoming`
- Movie details: GET `${BASE_URL}/movie/{movieId}?api_key=${API_KEY}`
- Movie videos: GET `${BASE_URL}/movie/{movieId}/videos?api_key=${API_KEY}`

## Expected response shapes (important fields)

- Search / Category list response: `{ results: [ { id, title, poster_path, vote_average, release_date } ] }`
- Movie details: `{ id, title, poster_path, overview, genres: [ { id, name } ], runtime, vote_average, release_date }`
- Videos response: `{ results: [ { id, key, name, site, type } ] }` (YouTube videos have `site: 'YouTube'` and `key` is the YouTube id)

Only the fields above are referenced directly by the UI. Add defensive checks when accessing optional fields.

## Main functions (in `script.js`)

- fetchMovies(category)
  - Builds the correct endpoint based on `category` (`search` uses the `search/movie` endpoint and reads the value of the `search` input).
  - Calls `fetch(url)`, converts to JSON, and passes `data.results` to `displayMovies`.
  - Error behavior: logs to console and writes an error message into `#moviesGrid`.

- displayMovies(movies)
  - Clears `#moviesGrid` then creates a `.movie-card` for each movie.
  - Uses `poster_path` to build image URL: `${IMAGE_BASE_URL}/w500${poster_path}` or falls back to a placeholder.
  - Shows `title`, rounded user score as a percent, and release year parsed from `release_date`.
  - Attaches an `onclick` handler to open the modal with details for that movie.

- showMovieDetails(movieId)
  - Fetches both details and videos in parallel with `Promise.all`.
  - Picks a trailer by `videos.results.find(video => video.type === 'Trailer') || videos.results[0]`.
  - Renders a modal with poster, title (with year), user score, overview, genres, runtime, and an embedded YouTube iframe when `trailer` exists.

- handleSearch()
  - Reads the `#search` input, and if non-empty sets `currentCategory = 'search'` and calls `fetchMovies('search')`.

## DOM hooks and CSS classes/ids

- `#moviesGrid` — container for movie cards
- `#search` — search input
- `#searchBtn` — search button
- `.category-btn[data-category]` — category buttons with `data-category` values `popular`, `top_rated`, `upcoming`
- `.movie-card` — movie tile element
- `#movieModal` — modal overlay
- `.modal-body` — modal content container
- `.close-btn` — closes the modal

Modify these selectors carefully; they are used directly in `script.js`.

## Contract (Inputs/Outputs/Error modes)

- Inputs: user interactions (search text, category click, movie click)
- Outputs: DOM updates — sets `#moviesGrid` innerHTML and `modalBody` innerHTML, toggles `#movieModal` display
- Error modes: network errors, missing fields, empty search results. Current behavior: log to console, show an inline error for grid fetch errors. No visual error for detail fetch errors besides console log. Consider improving.

## Edge cases to handle / tests to write

- Missing or invalid `release_date` — guard before calling `new Date(movie.release_date)`.
- Missing `poster_path` — placeholder used already.
- Empty `videos.results` — skip embedding the iframe.
- Rate limiting / API errors — show user-friendly message or spinner.
- Large lists / pagination — currently entire `results` array is shown; implement paging or infinite scroll if results are large.

Suggested tests (manual + automated):

- Manual: Search for known movie titles, open details for movies that do and do not have trailers, test no-results searches.
- Automated: End-to-end tests with Playwright or Cypress to verify interactions (search, open modal, trailer iframe present/absent).

## Developer tasks / TODOs (low risk first)

1. Remove hard-coded `API_KEY` from `script.js`. Move it to a build-time environment variable or a small server-side proxy.
2. Add a loading spinner and disable repeated clicks while requests are pending.
3. Add pagination or infinite scroll for long results.
4. Improve error UI: show banner notifications for network/API errors.
5. Add unit tests (where applicable) and an E2E test for main flows.
6. Improve accessibility: focus management when modal opens/closes, proper aria attributes, keyboard navigation.

## Local debugging tips

- Run a static server (see `README.md`) to avoid local file CORS issues.
- Open DevTools & network tab to inspect API requests and see the raw JSON if something looks off.

## Example: change API key safely (quick & dirty)

1. Open `script.js` and replace the `API_KEY` value with your key.
2. For a slightly safer local flow, create `config.js` (not committed) with `const API_KEY = 'YOUR_KEY';` then include it before `script.js` in `index.html`.

## Future: Add tests and CI

- Add GitHub Actions to run linting and E2E tests (Playwright) for PR validation. Keep the static site simple: the CI job can run `npx http-server` and then run Playwright tests against `http://localhost:8080`.

---

If you need me to implement any of the items above (API key environment handling, loading spinner, pagination, tests), tell me which one and I'll implement it next.
