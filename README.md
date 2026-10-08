# Oldwest Cafe — The New Trail (static site for Vercel)

## Deploy
1. Push this folder to GitHub (or drag it into vercel.com/new). Framework preset: **Other**. No build command, output directory = root.
2. Done. Every push redeploys.

## Add your food photos
Put images in `/images`. Each dish looks for `images/dishes/<slug>.jpg` (slug = the `slug` field in `menu.json`).
Hero image: `images/hero.jpg`. Missing photos fall back to a neutral label tile, so nothing breaks while you add them.

Suggested: 1600px wide JPG/WebP, under 300 KB each. To use another filename or format, set `"image":"images/dishes/my-file.webp"` on the dish.

Priority shots: hero.jpg, strawberry-belle, chocolate-chip-jack, cowpoke, then peach-cobbler-jack, cattle-baron, gold-fields, the-general, cowboy, curly-wolf.

## Update the menu
Edit `menu.json` only: name, desc, price (number, e.g. 12.99; leave null to hide), badge, tags, available, featured, orderUrl.
Per-location ordering: fill `orderUrl` inside each location.
