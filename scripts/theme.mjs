// Shared design tokens and helpers for every profile graphic.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;
export const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`;

export const THEMES = {
  dark: {
    surface: '#0f1623', surfaceTo: '#0c1830', surface2: '#151e2d', page: '#0b111b',
    border: '#243044', text: '#e6edf3', muted: '#9aa7b6', faint: '#5d6a7c',
    accent: '#5b9dff', accentSoft: 'rgba(91,157,255,0.14)', glow: 'rgba(59,130,246,0.22)',
    ok: '#3fb950', okSoft: 'rgba(63,185,80,0.14)', dots: 'rgba(148,163,184,0.16)',
    heat: ['#172131', '#123262', '#1c4f9e', '#3176e2', '#8ab8ff'],
  },
  light: {
    surface: '#f7f9fc', surfaceTo: '#edf3ff', surface2: '#eef2f7', page: '#ffffff',
    border: '#d8dfe8', text: '#0f172a', muted: '#475569', faint: '#94a3b8',
    accent: '#2563eb', accentSoft: 'rgba(37,99,235,0.10)', glow: 'rgba(37,99,235,0.14)',
    ok: '#1a7f37', okSoft: 'rgba(26,127,55,0.10)', dots: 'rgba(15,23,42,0.10)',
    heat: ['#e9edf3', '#c6d6fb', '#8badf4', '#4a7ff0', '#1d4ed8'],
  },
};

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Rough text width so pills and chips get enough room across OS fonts.
export const textW = (s, size, mono = false) =>
  [...s].reduce((w, c) => w + (mono ? 0.61 : /[A-Z0-9]/.test(c) ? 0.66 : /[ il.,:'|·]/.test(c) ? 0.3 : 0.55), 0) * size;

export function brand(name) {
  const svg = readFileSync(join(here, 'icons', `${name}.svg`), 'utf8');
  const m = svg.match(/<path d="([^"]+)"/);
  if (!m) throw new Error(`no path in icon ${name}`);
  return m[1];
}

// Simple-icons glyph (24x24 fill) placed at x,y with a pixel size.
export const glyph = (d, x, y, size, color) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})"><path d="${d}" fill="${color}"/></g>`;

// Lucide-style stroke icons (24x24).
export const LINE = {
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  calendar: 'M8 2v4 M16 2v4 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M3 10h18 M9 16l2 2 4-4',
  sparkles: 'M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6-4.6-1.9 4.6-1.9z M19 15v4 M17 17h4',
  arrow: 'M7 17L17 7 M7 7h10v10',
  globe: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  briefcase: 'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  check: 'M20 6L9 17l-5-5',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  layers: 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
};
export const line = (d, x, y, size, color, width = 1.8) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})"><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/></g>`;

// Motion: entrance only, plays once. Base state is always the visible final state,
// so static renderers and reduced-motion viewers see the finished graphic.
export const MOTION = `
  @keyframes up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  .up { animation: up .7s cubic-bezier(.2,.8,.2,1) both; }
  .fade { animation: fade .8s ease-out both; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`;

export const svg = (w, h, title, body, css = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>
  text { font-family: ${SANS}; }
  .mono { font-family: ${MONO}; }
  ${MOTION}
  ${css}
</style>
${body}
</svg>
`;
