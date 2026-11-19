// Draws the cover: graded photos in the layout's panels, a wash, vignette
// and grain, then the title in Anton capitals with a Pacifico subtitle.
// `state` is { layout, grade, title, subtitle, photos }, where each photo is
// { img, zoom, ox, oy } or null. `opts.highlight` draws a dashed outline
// around one panel (preview only, never on an export).
import { GRADES } from './grades.js';
import { LAYOUTS } from './layouts.js';

const gradedCache = new Map();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function duotonePixel(r, g, b, grade) {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const from = lum < 0.5 ? grade.shadow : grade.mid;
  const to = lum < 0.5 ? grade.mid : grade.light;
  const t = lum < 0.5 ? lum * 2 : (lum - 0.5) * 2;
  return [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
}

/** Draws one photo into a panel-sized canvas and grades it; results are cached. */
function gradedPanel(photo, panel, gradeId) {
  const grade = GRADES[gradeId];
  const key = `${photo.img.currentSrc || photo.img.src}|${panel.w}x${panel.h}|${photo.zoom}|${photo.ox}|${photo.oy}|${gradeId}`;
  const hit = gradedCache.get(key);
  if (hit) return hit;
  if (gradedCache.size > 24) gradedCache.clear();
  const off = document.createElement('canvas');
  off.width = Math.max(2, panel.w);
  off.height = Math.max(2, panel.h);
  const ctx = off.getContext('2d');
  const iw = photo.img.naturalWidth;
  const ih = photo.img.naturalHeight;
  const scale = Math.max(panel.w / iw, panel.h / ih) * photo.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (panel.w - dw) / 2 + photo.ox * panel.w;
  const dy = (panel.h - dh) / 2 + photo.oy * panel.h;
  ctx.drawImage(photo.img, dx, dy, dw, dh);
  const data = ctx.getImageData(0, 0, off.width, off.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const [r, g, b] = duotonePixel(px[i], px[i + 1], px[i + 2], grade);
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  }
  ctx.putImageData(data, 0, 0);
  gradedCache.set(key, off);
  return off;
}

let noiseCanvas = null;
function grainTile() {
  if (noiseCanvas) return noiseCanvas;
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 128;
  noiseCanvas.height = 128;
  const ctx = noiseCanvas.getContext('2d');
  const data = ctx.createImageData(128, 128);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 110 + Math.floor(Math.random() * 90);
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  return noiseCanvas;
}

function emptyPanel(ctx, panel, grade) {
  const grad = ctx.createLinearGradient(panel.x, panel.y, panel.x + panel.w, panel.y + panel.h);
  grad.addColorStop(0, `rgb(${grade.shadow[0]}, ${grade.shadow[1]}, ${grade.shadow[2]})`);
  grad.addColorStop(1, `rgb(${grade.mid[0]}, ${grade.mid[1]}, ${grade.mid[2]})`);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
  ctx.globalAlpha = 1;
}

function fitFont(ctx, text, maxWidth, startSize) {
  let size = startSize;
  ctx.font = `${size}px Anton, sans-serif`;
  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  return size;
}

/** Draws the whole cover onto `canvas` at its own pixel size. */
export function drawCover(canvas, state, opts = {}) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grade = GRADES[state.grade];
  const layout = LAYOUTS[state.layout];
  const panels = layout.panels(w, h);

  ctx.fillStyle = `rgb(${grade.shadow[0]}, ${grade.shadow[1]}, ${grade.shadow[2]})`;
  ctx.fillRect(0, 0, w, h);

  panels.forEach((panel, i) => {
    const photo = state.photos[i] || null;
    ctx.save();
    if (panel.rot) {
      ctx.translate(panel.x + panel.w / 2, panel.y + panel.h / 2);
      ctx.rotate(panel.rot);
      ctx.translate(-panel.w / 2, -panel.h / 2);
    } else {
      ctx.translate(panel.x, panel.y);
    }
    if (panel.border) {
      ctx.fillStyle = '#f5f0e8';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = Math.round(w * 0.015);
      ctx.shadowOffsetY = Math.round(h * 0.008);
      ctx.fillRect(-panel.border, -panel.border, panel.w + 2 * panel.border, panel.h + 2 * panel.border);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
    ctx.beginPath();
    ctx.rect(0, 0, panel.w, panel.h);
    ctx.clip();
    if (photo && photo.img) {
      ctx.drawImage(gradedPanel(photo, panel, state.grade), 0, 0);
    } else {
      emptyPanel(ctx, { x: 0, y: 0, w: panel.w, h: panel.h }, grade);
    }
    ctx.restore();
    if (opts.highlight === i) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(2, Math.round(w * 0.003));
      ctx.setLineDash([Math.round(w * 0.012), Math.round(w * 0.008)]);
      ctx.strokeRect(panel.x + 2, panel.y + 2, panel.w - 4, panel.h - 4);
      ctx.restore();
    }
  });

  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, w, h);

  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.72);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, `rgba(0, 0, 0, ${grade.vignette})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  const grain = ctx.createPattern(grainTile(), 'repeat');
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  const title = (state.title || '').trim().toUpperCase();
  const subtitle = (state.subtitle || '').trim();
  if (title || subtitle) {
    const pad = Math.round(w * 0.045);
    const bandH = Math.round(h * 0.22);
    const band = ctx.createLinearGradient(0, h - bandH, 0, h);
    band.addColorStop(0, 'rgba(0, 0, 0, 0)');
    band.addColorStop(1, 'rgba(0, 0, 0, 0.62)');
    ctx.fillStyle = band;
    ctx.fillRect(0, h - bandH, w, bandH);
    let baseline = h - Math.round(h * 0.055);
    if (title) {
      const size = fitFont(ctx, title, w - 2 * pad, Math.round(h * 0.105));
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = Math.max(2, Math.round(size * 0.07));
      ctx.strokeText(title, pad, baseline);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = Math.round(size * 0.12);
      ctx.shadowOffsetY = Math.round(size * 0.03);
      ctx.fillText(title, pad, baseline);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      baseline -= size + Math.round(h * 0.012);
    }
    if (subtitle) {
      const subSize = Math.max(16, Math.round(h * 0.038));
      ctx.font = `${subSize}px Pacifico, cursive`;
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgb(${grade.light[0]}, ${grade.light[1]}, ${grade.light[2]})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = Math.round(subSize * 0.15);
      ctx.fillText(subtitle, pad, baseline);
      ctx.shadowBlur = 0;
    }
  }
}
