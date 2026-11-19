// Sunset Cover Studio: wires the editor. A photo (or several) in, a graded
// multi-panel cover out as a PNG in the common post sizes. Photos are read
// on this machine and never uploaded; every asset is a file under app/.
import { drawCover } from './cover.js';
import { GRADES, GRADE_ORDER } from './grades.js';
import { LAYOUTS, LAYOUT_ORDER } from './layouts.js';
import { runShot } from './shots.js';

export const SIZES = {
  square: { label: '1080 x 1080', w: 1080, h: 1080 },
  portrait: { label: '1080 x 1350', w: 1080, h: 1350 },
  wide: { label: '1920 x 1080', w: 1920, h: 1080 },
};
export const SIZE_ORDER = ['square', 'portrait', 'wide'];

const SAMPLES = { boulevard: 'samples/boulevard.jpg', pier: 'samples/pier.jpg' };

const state = {
  layout: 'hero',
  grade: 'sunset',
  size: 'square',
  title: 'Sunset Heist',
  subtitle: 'Vice City nights',
  photos: [null, null, null, null],
  selected: 0,
};

const preview = document.getElementById('preview');
const status = document.getElementById('status');
let coverOnlyMode = false;

function sizeDims() {
  return SIZES[state.size];
}

function previewDims() {
  const { w, h } = sizeDims();
  const scale = Math.min(1, 780 / Math.max(w, h));
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

function redraw() {
  if (coverOnlyMode) {
    const { w, h } = sizeDims();
    if (preview.width !== w || preview.height !== h) {
      preview.width = w;
      preview.height = h;
    }
    drawCover(preview, state);
    return;
  }
  const dims = previewDims();
  if (preview.width !== dims.w || preview.height !== dims.h) {
    preview.width = dims.w;
    preview.height = dims.h;
  }
  drawCover(preview, state, { highlight: state.selected });
  syncPanelControls();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function setPhoto(slot, img) {
  state.photos[slot] = { img, zoom: 1, ox: 0, oy: 0 };
}

async function loadSample(name) {
  const img = await loadImage(SAMPLES[name]);
  return img;
}

function photoFromFile(file) {
  return loadImage(URL.createObjectURL(file));
}

function slotCount() {
  return LAYOUTS[state.layout].slots;
}

function syncSlotButtons() {
  document.querySelectorAll('#slots button').forEach((btn) => {
    const i = Number(btn.dataset.slot);
    btn.disabled = i >= slotCount();
    btn.classList.toggle('active', i === state.selected);
    btn.textContent = state.photos[i] ? `Panel ${i + 1} · photo set` : `Panel ${i + 1} · empty`;
  });
}

function syncPanelControls() {
  const photo = state.photos[state.selected];
  const zoom = document.getElementById('zoom');
  const ox = document.getElementById('ox');
  const oy = document.getElementById('oy');
  const has = Boolean(photo);
  zoom.disabled = !has;
  ox.disabled = !has;
  oy.disabled = !has;
  if (has) {
    zoom.value = photo.zoom;
    ox.value = photo.ox;
    oy.value = photo.oy;
  }
  syncSlotButtons();
}

function buildPickers() {
  const layoutBox = document.getElementById('layouts');
  LAYOUT_ORDER.forEach((key) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = LAYOUTS[key].label;
    btn.dataset.key = key;
    btn.addEventListener('click', () => {
      state.layout = key;
      if (state.selected >= slotCount()) state.selected = 0;
      layoutBox.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.key === key));
      redraw();
    });
    layoutBox.appendChild(btn);
  });
  layoutBox.querySelector('button').classList.add('active');

  const gradeBox = document.getElementById('grades');
  GRADE_ORDER.forEach((key) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = GRADES[key].label;
    btn.dataset.key = key;
    btn.style.setProperty('--swatch', `rgb(${GRADES[key].mid[0]}, ${GRADES[key].mid[1]}, ${GRADES[key].mid[2]})`);
    btn.addEventListener('click', () => {
      state.grade = key;
      gradeBox.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.key === key));
      redraw();
    });
    gradeBox.appendChild(btn);
  });
  gradeBox.querySelector('button').classList.add('active');

  const sizeBox = document.getElementById('sizes');
  SIZE_ORDER.forEach((key) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = SIZES[key].label;
    btn.dataset.key = key;
    btn.addEventListener('click', () => {
      state.size = key;
      sizeBox.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.key === key));
      redraw();
    });
    sizeBox.appendChild(btn);
  });
  sizeBox.querySelector('button').classList.add('active');

  const slotBox = document.getElementById('slots');
  for (let i = 0; i < 4; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.slot = String(i);
    btn.addEventListener('click', () => {
      state.selected = i;
      redraw();
    });
    slotBox.appendChild(btn);
  }
  slotBox.querySelector('button').classList.add('active');
}

function panelAt(clientX, clientY) {
  const rect = preview.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * preview.width;
  const y = ((clientY - rect.top) / rect.height) * preview.height;
  const panels = LAYOUTS[state.layout].panels(preview.width, preview.height);
  for (let i = panels.length - 1; i >= 0; i--) {
    const p = panels[i];
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) return i;
  }
  return -1;
}

function wireEditor() {
  document.getElementById('photoFile').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    if (files.length === 1) {
      state.photos[state.selected] = { img: await photoFromFile(files[0]), zoom: 1, ox: 0, oy: 0 };
    } else {
      for (let i = 0; i < files.length && i < 4; i++) {
        state.photos[i] = { img: await photoFromFile(files[i]), zoom: 1, ox: 0, oy: 0 };
      }
    }
    status.textContent = `${files.length} photo${files.length > 1 ? 's' : ''} loaded. Drag a panel to move its photo.`;
    redraw();
    e.target.value = '';
  });

  document.getElementById('sampleBoulevard').addEventListener('click', async () => {
    await setPhoto(state.selected, await loadSample('boulevard'));
    status.textContent = 'Sample photo: boulevard.';
    redraw();
  });
  document.getElementById('samplePier').addEventListener('click', async () => {
    await setPhoto(state.selected, await loadSample('pier'));
    status.textContent = 'Sample photo: pier.';
    redraw();
  });
  document.getElementById('fillAll').addEventListener('click', () => {
    const photo = state.photos[state.selected];
    if (!photo) {
      status.textContent = 'Pick a panel with a photo first.';
      return;
    }
    for (let i = 0; i < 4; i++) state.photos[i] = { img: photo.img, zoom: 1, ox: 0, oy: 0 };
    status.textContent = 'One photo fills every panel.';
    redraw();
  });

  document.getElementById('title').addEventListener('input', (e) => {
    state.title = e.target.value;
    redraw();
  });
  document.getElementById('subtitle').addEventListener('input', (e) => {
    state.subtitle = e.target.value;
    redraw();
  });

  document.getElementById('zoom').addEventListener('input', (e) => {
    const photo = state.photos[state.selected];
    if (photo) {
      photo.zoom = Number(e.target.value);
      redraw();
    }
  });
  document.getElementById('ox').addEventListener('input', (e) => {
    const photo = state.photos[state.selected];
    if (photo) {
      photo.ox = Number(e.target.value);
      redraw();
    }
  });
  document.getElementById('oy').addEventListener('input', (e) => {
    const photo = state.photos[state.selected];
    if (photo) {
      photo.oy = Number(e.target.value);
      redraw();
    }
  });
  document.getElementById('resetPanel').addEventListener('click', () => {
    const photo = state.photos[state.selected];
    if (photo) {
      photo.zoom = 1;
      photo.ox = 0;
      photo.oy = 0;
      redraw();
    }
  });

  let drag = null;
  preview.addEventListener('pointerdown', (e) => {
    const slot = panelAt(e.clientX, e.clientY);
    if (slot < 0) return;
    state.selected = slot;
    const photo = state.photos[slot];
    drag = { x: e.clientX, y: e.clientY, photo };
    preview.setPointerCapture(e.pointerId);
    redraw();
  });
  preview.addEventListener('pointermove', (e) => {
    if (!drag || !drag.photo) return;
    const rect = preview.getBoundingClientRect();
    const panels = LAYOUTS[state.layout].panels(preview.width, preview.height);
    const panel = panels[state.selected];
    drag.photo.ox += ((e.clientX - drag.x) / rect.width) * (preview.width / panel.w);
    drag.photo.oy += ((e.clientY - drag.y) / rect.height) * (preview.height / panel.h);
    drag.photo.ox = Math.max(-0.6, Math.min(0.6, drag.photo.ox));
    drag.photo.oy = Math.max(-0.6, Math.min(0.6, drag.photo.oy));
    drag.x = e.clientX;
    drag.y = e.clientY;
    redraw();
  });
  preview.addEventListener('pointerup', () => { drag = null; });
  preview.addEventListener('wheel', (e) => {
    const photo = state.photos[state.selected];
    if (!photo) return;
    e.preventDefault();
    photo.zoom = Math.max(1, Math.min(3, photo.zoom - Math.sign(e.deltaY) * 0.1));
    redraw();
  }, { passive: false });

  document.getElementById('export').addEventListener('click', async () => {
    const url = await exportPNG();
    const { w, h } = sizeDims();
    const a = document.createElement('a');
    a.href = url;
    a.download = `sunset-cover-${w}x${h}.png`;
    a.click();
    status.textContent = `Saved sunset-cover-${w}x${h}.png`;
  });
}

/** Renders the cover at full export size and returns a PNG data URL. */
export async function exportPNG() {
  const { w, h } = sizeDims();
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  drawCover(off, state);
  return off.toDataURL('image/png');
}

async function setupScene({ layout, grade, size, photo, caption, subtitle, coverOnly }) {
  state.layout = LAYOUTS[layout] ? layout : 'hero';
  state.grade = GRADES[grade] ? grade : 'sunset';
  state.size = SIZES[size] ? size : 'square';
  state.title = caption;
  state.subtitle = subtitle;
  document.getElementById('title').value = caption;
  document.getElementById('subtitle').value = subtitle;
  const first = await loadSample(photo === 'boulevard' ? 'boulevard' : 'pier');
  const second = await loadSample(photo === 'boulevard' ? 'pier' : 'boulevard');
  state.photos = [
    { img: first, zoom: 1, ox: 0, oy: 0 },
    { img: second, zoom: 1, ox: 0, oy: 0 },
    { img: second, zoom: 1.15, ox: 0.05, oy: 0 },
    { img: first, zoom: 1.1, ox: -0.04, oy: 0.03 },
  ];
  if (coverOnly) {
    coverOnlyMode = true;
    preview.style.width = '100vw';
    preview.style.height = '100vh';
  }
  redraw();
  syncSlotButtons();
}

buildPickers();
wireEditor();

document.fonts.load('100px Anton').catch(() => {});
document.fonts.load('100px Pacifico').catch(() => {});
document.fonts.ready.then(() => redraw());

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), { setupScene });
} else {
  (async () => {
    const b = await loadSample('boulevard');
    const p = await loadSample('pier');
    state.photos[0] = { img: b, zoom: 1, ox: 0, oy: 0 };
    state.photos[1] = { img: p, zoom: 1, ox: 0, oy: 0 };
    state.photos[2] = { img: p, zoom: 1.15, ox: 0.05, oy: 0 };
    state.photos[3] = { img: b, zoom: 1.1, ox: -0.04, oy: 0.03 };
    redraw();
  })();
}

window.__sunsetStudio = { state, exportPNG, redraw };
