// Layouts: each one is a function of the cover size, returning the panel
// rectangles the photos fill. Coordinates are pixels in the cover's own
// space; `rot` tilts a panel in radians and `border` draws a white snapshot
// border around it. Panels are listed in slot order, so slot 0 is the hero.
export const LAYOUTS = {
  hero: {
    label: 'Hero + Three',
    slots: 4,
    panels(w, h) {
      const g = Math.max(6, Math.round(Math.min(w, h) * 0.012));
      if (w >= h) {
        const hw = Math.round(w * 0.62);
        const sh = Math.floor((h - 2 * g) / 3);
        return [
          { x: 0, y: 0, w: hw, h },
          { x: hw + g, y: 0, w: w - hw - g, h: sh },
          { x: hw + g, y: sh + g, w: w - hw - g, h: sh },
          { x: hw + g, y: 2 * (sh + g), w: w - hw - g, h: h - 2 * (sh + g) },
        ];
      }
      const hh = Math.round(h * 0.62);
      const sw = Math.floor((w - 2 * g) / 3);
      return [
        { x: 0, y: 0, w, h: hh },
        { x: 0, y: hh + g, w: sw, h: h - hh - g },
        { x: sw + g, y: hh + g, w: sw, h: h - hh - g },
        { x: 2 * (sw + g), y: hh + g, w: w - 2 * (sw + g), h: h - hh - g },
      ];
    },
  },
  grid: {
    label: 'Four Panel Grid',
    slots: 4,
    panels(w, h) {
      const g = Math.max(6, Math.round(Math.min(w, h) * 0.012));
      const cw = Math.floor((w - g) / 2);
      const ch = Math.floor((h - g) / 2);
      return [
        { x: 0, y: 0, w: cw, h: ch },
        { x: cw + g, y: 0, w: w - cw - g, h: ch },
        { x: 0, y: ch + g, w: cw, h: h - ch - g },
        { x: cw + g, y: ch + g, w: w - cw - g, h: h - ch - g },
      ];
    },
  },
  single: {
    label: 'Full Bleed',
    slots: 1,
    panels(w, h) {
      return [{ x: 0, y: 0, w, h }];
    },
  },
  strip: {
    label: 'Snapshot Strip',
    slots: 3,
    panels(w, h) {
      const border = Math.max(8, Math.round(Math.min(w, h) * 0.014));
      const pw = Math.floor(w * 0.3);
      const ph = Math.floor(h * 0.62);
      const y = Math.floor((h - ph) / 2);
      const gap = Math.floor((w - 3 * pw) / 4);
      return [
        { x: gap, y, w: pw, h: ph, rot: -0.055, border },
        { x: 2 * gap + pw, y, w: pw, h: ph, rot: 0.02, border },
        { x: 3 * gap + 2 * pw, y, w: pw, h: ph, rot: 0.06, border },
      ];
    },
  },
};

export const LAYOUT_ORDER = ['hero', 'grid', 'single', 'strip'];
