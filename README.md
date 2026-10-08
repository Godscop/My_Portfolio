# Carl Peters — Personal Portfolio

CSN 1101 (Web Technologies and Internet Applications), KCA University — a
personal portfolio site built across three assignments: semantic HTML5 and
an external stylesheet (Assignment 1), a projects/skills/services page with
JavaScript interactivity (Assignment 2), and live API data with a security
and performance pass (Assignment 3).

## What's here
- `index.html` — home page: hero, about, toolkit, and contact sections
- `projects.html` — projects catalogue, skills, services, and live GitHub repos
- `style.css` — all styling (no inline styles or `<style>` blocks)
- `script.js` — rating widget interaction, contact form validation, and live API fetches
- `assets/profile.jpg` — profile photo
- `assets/projects/` — project screenshots
- `assets/audio/` — short audio clips used in the rating widget's easter egg

## Live deployments
- GitHub Pages: https://Godscop.github.io/My_Portfolio/
- Vercel: https://my-portfolio-teal-phi-34.vercel.app/

## Live data
- **GitHub API** (`api.github.com/users/Godscop/repos`) — lists my real repositories live on the Projects page, with a loading state and error handling if the request fails.
- **Open-Meteo API** — shows current Nairobi weather on the home page, no API key required.

## Security review
- No API key or secret is exposed client-side — both APIs used are key-free by design.
- All dynamic content (repo data, rating feedback, form messages) is inserted with `textContent`, never `innerHTML`.
- Both deployments are served over HTTPS by default (GitHub Pages and Vercel).

## Performance
- Images compressed and sized appropriately (profile ~106KB, project thumbnails ~60–100KB).
- `loading="lazy"` added to below-the-fold project thumbnail images.
- Lighthouse Performance score: 87(before) -> 90(after)

## Notes
- Fonts: Fraunces (display) and Inter (body), via Google Fonts.
- Built mobile-first; verified usable from 320px wide up to desktop.
- Validated against the W3C Markup Validator (validator.w3.org).