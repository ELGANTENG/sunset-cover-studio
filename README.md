[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/ELGANTENG/sunset-cover-studio/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/ELGANTENG/sunset-cover-studio/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# Sunset Cover Studio

Turn your own photos into poster cover art in the style of a GTA 6 loading screen — right in your browser, with nothing uploaded anywhere. Pick a multi-panel layout, give it a sunset or neon grade, write a bold caption, and export the finished cover as a PNG you can post.

## What it does

- **Your photos stay on your machine** — load one photo or several from your own files; every panel can hold its own photo, and you crop and position each one by dragging it and scrolling to zoom. Two sample photos are built in, so the studio works with a single click.
- **4 layouts** — Hero + Three (one big hero panel beside three stacked panels), Four Panel Grid, Full Bleed (a single photo across the whole cover), and Snapshot Strip (three tilted polaroid-style panels with white borders and drop shadows).
- **4 colour grades** — Vice City Sunset, Neon Night, Golden Hour, and Noir. Each grade is a real per-pixel luminance gradient map, finished with a wash, a vignette, and generated grain.
- **Poster lettering** — the title is set in bold Anton capitals that auto-fit the cover, with a Pacifico script subtitle. Both fonts are vendored as files under `app/fonts/` under the SIL Open Font License.
- **3 export sizes** — 1080 x 1080, 1080 x 1350, and 1920 x 1080. Choose a size and click Export PNG to download the cover.
- **Fully offline** — every script, font, and image the app loads is a file under `app/`. The app makes no network request at all.

There is no Rockstar Games logo, wordmark, artwork, character, or font anywhere in this app — the art, the lettering, and the layouts are all original.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080.

## How to use

1. Choose photos (or click a sample photo) — one photo fills the selected panel, several photos fill the panels in order, and "Fill all panels" puts one photo in every panel.
2. Pick a layout, a colour grade, and an export size.
3. Click a panel to select it, drag it to move its photo, and scroll over it (or use the zoom and position sliders) to frame the shot.
4. Type the title and the subtitle.
5. Click **Export PNG** and share the cover.

## Screenshots

- `screenshots/1-cover.jpg` — the hero sunset wide cover: a Hero + Three layout in the Vice City Sunset grade, exported at 1920 x 1080.
- `screenshots/2-editor.jpg` — the editor in the browser with a photo loaded, showing the live preview beside the photo, layout, and grade controls.
- `screenshots/3-cover-portrait.jpg` — a neon grid portrait cover: a Four Panel Grid in the Neon Night grade, exported at 1080 x 1350.
- `screenshots/4-cover-square.jpg` — a golden snapshot-strip square cover: the Snapshot Strip layout in the Golden Hour grade, exported at 1080 x 1080.

## Entry program

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-app.ts` library.

## License

MIT — see [LICENSE](LICENSE). The fonts under `app/fonts/` are licensed under the SIL Open Font License 1.1 (see the OFL files beside them).

---

<sub>Entered on [make.fun](https://make.fun/?ref=qd0ywjzn&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
