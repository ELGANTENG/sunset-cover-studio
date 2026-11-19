[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/ELGANTENG/sunset-cover-studio/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# Sunset Cover Studio

A GTA-style cover art maker that runs entirely offline in your browser. Drop in your own photos, pick a layout and a colour grade, write a caption, and export a poster cover as a PNG to share.

- **Your photos, kept on your machine** — upload one photo or several; each panel gets its own photo, cropped and positioned by dragging and zooming. Or load the two built-in sample photos with one click.
- **4 layouts** — Hero + Three, Four Panel Grid, Full Bleed, and Snapshot Strip (tilted polaroid-style panels).
- **4 colour grades** — Vice City Sunset, Neon Night, Golden Hour, and Noir, applied as a real duotone gradient map with vignette and grain.
- **Bold poster lettering** — Anton capitals for the title and a Pacifico script subtitle, both shipped as OFL-licensed files under `app/fonts/`.
- **3 export sizes** — 1080 x 1080, 1080 x 1350, and 1920 x 1080, one click to download the PNG.
- **Fully offline** — every script, font, and image is a file under `app/`; the app makes no network request at all.

No Rockstar Games logo, wordmark, artwork, character, or font anywhere in this app.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080.

## How to use

1. Choose photos (or click a sample photo) — one photo fills the selected panel, several photos fill the panels in order, "Fill all panels" puts one photo everywhere.
2. Pick a layout, a colour grade, and an export size.
3. Click a panel to select it, drag it to move its photo, scroll over it (or use the sliders) to zoom and reposition.
4. Type the title and subtitle.
5. Click **Export PNG**.

## Entry program

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-app.ts` library.

## License

MIT — see [LICENSE](LICENSE). Fonts under `app/fonts/` are licensed under the SIL Open Font License 1.1 (see the OFL files beside them).
