// Hero card: name, positioning, and an animated "whole product" scene on the right:
// a browser app draws in, a phone app captures a signature, the AI check lands,
// and the invoice pill closes the loop. Static renderers see the finished scene.
import { esc, textW, LINE, line, svg } from './theme.mjs';

export const HERO_COPY = {
  eyebrow: 'FULL-STACK PRODUCT ENGINEER · WEB · MOBILE · AI',
  name: 'Cosmin Oros',
  tagline: ['I build products that ship: web, mobile, backend and the', 'AI inside them, from first commit to paying customers.'],
  lines: [
    ['briefcase', 'Full-Stack Software Engineer, GAIM Solutions · Munich, remote'],
    ['sparkles', 'Co-founder, SPEC24 · AI client hub for agencies'],
  ],
  aria: 'Cosmin Oros, full-stack product engineer. I build products that ship: web, mobile, backend and the AI inside them, from first commit to paying customers.',
};

const PHONE_ICON = 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01';

export function hero(t, c = HERO_COPY) {
  const W = 840, H = 290;
  const br = { x: 574, y: 54, w: 244, h: 150 };
  const ph = { x: 514, y: 92, w: 76, h: 150 };
  const chartH = [18, 30, 24, 44, 36];
  const chartBase = br.y + 138, chartX = br.x + 80;
  const T = { browser: 0.25, phone: 0.75, sig: 1.3, signed: 2.25, chart: 2.5, ai: 3.05, invoice: 3.55 };

  const bars = chartH.map((h, i) => {
    const x = chartX + i * 24, b = (T.chart + i * 0.07).toFixed(2);
    return `<rect x="${x}" y="${chartBase - h}" width="15" height="${h}" rx="3" fill="${i === 3 ? t.accent : t.heat[2]}">
      <animate attributeName="height" from="0" to="${h}" begin="${b}s" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
      <animate attributeName="y" from="${chartBase}" to="${chartBase - h}" begin="${b}s" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
    </rect>`;
  }).join('\n      ');

  const pill = (x, y, text, delay, icon = LINE.check) => {
    const w = 30 + textW(text, 10.5, true) + 12;
    return `<g class="up" style="animation-delay:${delay}s">
      <rect x="${x}" y="${y}" width="${w}" height="22" rx="11" fill="${t.okSoft}" stroke="${t.ok}" stroke-opacity="0.35"/>
      ${line(icon, x + 9, y + 4.5, 13, t.ok, 2.4)}
      <text class="mono" x="${x + 27}" y="${y + 15}" font-size="10.5" fill="${t.ok}" font-weight="600">${esc(text)}</text>
    </g>`;
  };

  const sub = c.lines.map(([icon, text], i) => `${line(LINE[icon], 44, 214 + i * 24, 15, t.muted)}
    <text x="68" y="${226 + i * 24}" font-size="13.5" fill="${t.muted}">${esc(text)}</text>`).join('\n    ');

  const body = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.surface}"/><stop offset="1" stop-color="${t.surfaceTo}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${t.glow}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${t.dots}"/></pattern>
    <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="1"/>
    </linearGradient>
    <mask id="m"><rect x="380" y="0" width="${W - 380}" height="${H}" fill="url(#fadeL)"/></mask>
    <clipPath id="card"><rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18"/></clipPath>
    <clipPath id="brClip"><rect x="${br.x}" y="${br.y}" width="${br.w}" height="${br.h}" rx="10"/></clipPath>
  </defs>

  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="380" y="0" width="${W - 380}" height="${H}" fill="url(#dots)" mask="url(#m)"/>
    <ellipse cx="660" cy="140" rx="210" ry="150" fill="url(#glow)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${t.border}"/>

  <g class="up" style="animation-delay:.05s">
    <text class="mono" x="44" y="68" font-size="12" letter-spacing="1.8" fill="${t.accent}" font-weight="600">${esc(c.eyebrow)}</text>
  </g>
  <g class="up" style="animation-delay:.15s">
    <text x="41" y="122" font-size="48" font-weight="700" letter-spacing="-1.2" fill="${t.text}">${esc(c.name)}</text>
  </g>
  <g class="up" style="animation-delay:.28s">
    <text x="44" y="159" font-size="16" fill="${t.text}">${esc(c.tagline[0])}</text>
    <text x="44" y="183" font-size="16" fill="${t.text}">${esc(c.tagline[1])}</text>
  </g>
  <g class="up" style="animation-delay:.42s">
    ${sub}
  </g>

  <!-- browser app -->
  <g class="up" style="animation-delay:${T.browser}s">
    <rect x="${br.x}" y="${br.y}" width="${br.w}" height="${br.h}" rx="10" fill="${t.page}" stroke="${t.border}"/>
    <g clip-path="url(#brClip)">
      <rect x="${br.x}" y="${br.y}" width="${br.w}" height="24" fill="${t.surface2}"/>
      <rect x="${br.x}" y="${br.y + 24}" width="60" height="${br.h - 24}" fill="${t.surface2}" opacity="0.6"/>
    </g>
    <line x1="${br.x}" y1="${br.y + 24}" x2="${br.x + br.w}" y2="${br.y + 24}" stroke="${t.border}"/>
    <circle cx="${br.x + 12}" cy="${br.y + 12}" r="3" fill="${t.faint}"/><circle cx="${br.x + 22}" cy="${br.y + 12}" r="3" fill="${t.faint}"/><circle cx="${br.x + 32}" cy="${br.y + 12}" r="3" fill="${t.faint}"/>
    <rect x="${br.x + 90}" y="${br.y + 7}" width="90" height="10" rx="5" fill="${t.border}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${br.x + 12}" y="${br.y + 40 + i * 16}" width="${[36, 28, 34, 24][i]}" height="5" rx="2.5" fill="${i === 0 ? t.accent : t.faint}" opacity="${i === 0 ? 1 : 0.55}"/>`).join('')}
    ${[0, 1, 2].map((i) => `<rect x="${br.x + 80}" y="${br.y + 40 + i * 14}" width="${[118, 96, 132][i]}" height="5" rx="2.5" fill="${t.faint}" opacity="0.5"/>`).join('')}
    <text class="mono" x="${br.x + 80}" y="${br.y + 97}" font-size="8.5" fill="${t.faint}">bids by region</text>
  </g>
  <g class="fade" style="animation-delay:${T.chart}s">
      ${bars}
  </g>

  <!-- phone app -->
  <g class="up" style="animation-delay:${T.phone}s">
    <rect x="${ph.x}" y="${ph.y}" width="${ph.w}" height="${ph.h}" rx="13" fill="${t.surface2}" stroke="${t.border}"/>
    <rect x="${ph.x + 6}" y="${ph.y + 9}" width="${ph.w - 12}" height="${ph.h - 18}" rx="8" fill="${t.page}"/>
    <rect x="${ph.x + 28}" y="${ph.y + 14}" width="20" height="3" rx="1.5" fill="${t.border}"/>
    ${[0, 1, 2].map((i) => `<rect x="${ph.x + 14}" y="${ph.y + 28 + i * 11}" width="${[46, 34, 40][i]}" height="5" rx="2.5" fill="${t.faint}" opacity="0.55"/>`).join('')}
    <rect x="${ph.x + 14}" y="${ph.y + 66}" width="48" height="36" rx="5" fill="${t.surface}" stroke="${t.border}" stroke-dasharray="3 2"/>
    <path class="sig" d="M${ph.x + 19} ${ph.y + 90} c 5 -16 9 -18 11 -6 s 5 8 9 -3 s 7 -6 10 4 s 5 6 12 -2" fill="none" stroke="${t.accent}" stroke-width="1.7" stroke-linecap="round"/>
    <text class="mono" x="${ph.x + ph.w / 2}" y="${ph.y + 118}" font-size="8" text-anchor="middle" fill="${t.faint}">visit report</text>
  </g>
  ${pill(ph.x + 10, ph.y + 125, 'signed offline', T.signed)}
  ${pill(br.x + 44, br.y - 11, 'AI extraction validated', T.ai, LINE.sparkles)}
  ${pill(br.x + 96, br.y + br.h - 11, 'invoice generated', T.invoice)}`;

  const css = `
  @keyframes draw { to { stroke-dashoffset: 0; } }
  .sig { stroke-dasharray: 90; stroke-dashoffset: 90; animation: draw .9s cubic-bezier(.4,0,.6,1) ${T.sig}s forwards; }
  @media (prefers-reduced-motion: reduce) { .sig { stroke-dashoffset: 0; } }`;
  return svg(W, H, c.aria, body, css);
}
