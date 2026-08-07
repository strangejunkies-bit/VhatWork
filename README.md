# Fresh Work Factory — Production Website

This repository is a production-structured static website for **freshworkfactory.com**, designed to deploy cleanly on GitHub Pages without a runtime server.

## What changed

- Replaced the 8.5 MB single-file build with a structured multi-page site.
- Extracted 53 embedded base64 images into optimized assets.
- Preserved all 34 original service groups and all original menu options.
- Added dedicated pages for vehicle wraps and direct mail because those services are represented in the existing/legacy site content.
- Preserved established URLs including `/about-us/`, `/flyers/`, `/get-a-quote/`, `/shop/`, `/privacy-policy/` and `/terms-and-conditions/`.
- Added canonical URLs, unique titles/descriptions, Open Graph, Twitter cards, structured data, breadcrumbs, sitemap, robots.txt, favicon family, web manifest and 404 handling.
- Kept the existing Formspree endpoint temporarily. FreshWork360 Forms can replace it after the site rollout without changing page URLs.

## Deployment

See `DEPLOYMENT.md` before replacing the current GitHub Pages build.

## Current page count

Generated indexable pages: **54** (plus `404.html`).
