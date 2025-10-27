# Cinetic

> A small, static movie discovery web app that uses The Movie Database (TMDB) API to show popular, top-rated, and upcoming movies. Click a movie card to view details and play the trailer.

## Live demo

This is a static project (no server required). Open `index.html` in any modern browser to use it locally.

## Features

- Browse categories: Popular, Top Rated, Upcoming
- Search movies by title
- Movie grid with poster, title, release year and a user-score circle
- Click a movie to open a modal with details, genres, runtime, overview and an embedded YouTube trailer (when available)

## Screenshots

[cinetic-movie-grid-desktop.png](https://postimg.cc/w3xZdNbz)

## Getting started (for public users)

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari)

### Run locally

Because this is a static site you can open `index.html` directly in your browser. For a better development experience (CORS and nicer URLs) run a simple static server.

Using Python (PowerShell):

```powershell
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

Or using Node (http-server):

```powershell
npx http-server -p 5500
# then open http://localhost:5500
```

### TMDB API Key

This project uses The Movie Database (TMDB) API. A demo API key is currently present in `script.js`. For your personal use, replace the `API_KEY` value in `script.js` with your own key obtained from https://www.themoviedb.org/settings/api.

Security note: Do not commit private API keys to public repositories. For production, move the key to a backend or use environment-based builds that do not expose secrets in client-side code.

## File overview

- `index.html` – App shell and modal
- `style.css` – Visual styles and responsive layout
- `script.js` – App logic: fetches from TMDB, renders movie grid and modal

For developer-facing details see `spec.md`.

## Common issues

- No posters / broken images: the app shows a placeholder image when a poster path is missing.
- No trailer shown: not all movies have a trailer; the app embeds the first available video of type `Trailer`, or the first video available.
- CORS / local loading issues: run a local server as shown above.

## Contributing

Small improvements (styling, accessibility, caching, pagination) are welcome. Please open an issue or submit a PR with a clear description of the change.

## License

This repository is provided as-is. Add a license file if you intend to open-source under a specific license (MIT, Apache-2.0, etc.).

---

Made with ❤️ — enjoy exploring movies!
