// Fixed scenes for screenshots: ?shot=editor shows the editor with a sample
// photo loaded; ?shot=cover shows the cover alone, full viewport. `layout`,
// `grade`, `size`, `photo` and `caption` pick the scene. window.__shotReady
// is set once the fonts are in and the cover is painted.
export async function runShot(shot, query, api) {
  const layout = query.get('layout') || 'hero';
  const grade = query.get('grade') || 'sunset';
  const size = query.get('size') || '1080x1080';
  const photo = query.get('photo') || 'pier';
  const caption = query.get('caption') || 'Sunset Heist';
  const subtitle = query.get('subtitle') || 'Vice City nights';
  if (shot === 'cover') document.body.classList.add('shot-cover');
  await api.setupScene({ layout, grade, size, photo, caption, subtitle, coverOnly: shot === 'cover' });
  await document.fonts.ready;
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
