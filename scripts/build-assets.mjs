// Renders the static profile graphics into ../assets (dark + light variants).
// Run: node scripts/build-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, esc, textW, brand, glyph, LINE, line, svg } from './theme.mjs';
import { hero } from './hero.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });
const save = (name, content) => writeFileSync(join(out, name), content);

/* ---------------- IMPACT STRIP ---------------- */
function stats(t) {
  const W = 840, H = 128;
  const items = [
    ['5', '', 'products in production,', 'built end to end at GAIM'],
    ['25', '+', 'portals served from', 'one codebase'],
    ['3', '', 'platforms shipped:', 'web, iOS and Android'],
    ['4', '', 'LLM providers behind', 'one interface'],
  ];
  const colW = W / 4;
  const cols = items.map(([n, suf, a, b], i) => {
    const x = i * colW + 30;
    return `<g class="up" style="animation-delay:${(0.1 + i * 0.12).toFixed(2)}s">
    <text x="${x}" y="58" font-size="36" font-weight="700" letter-spacing="-1" fill="${t.text}">${n}<tspan fill="${t.accent}">${suf}</tspan></text>
    <text x="${x}" y="86" font-size="13" fill="${t.muted}">${esc(a)}</text>
    <text x="${x}" y="104" font-size="13" fill="${t.muted}">${esc(b)}</text>
  </g>`;
  }).join('\n  ');
  const dividers = [1, 2, 3].map((i) => `<line x1="${i * colW}" y1="26" x2="${i * colW}" y2="104" stroke="${t.border}"/>`).join('');
  const body = `
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.surface}" stroke="${t.border}"/>
  ${dividers}
  ${cols}`;
  return svg(W, H, '5 products in production built end to end at GAIM, 25+ portals served from one codebase, 3 platforms shipped: web, iOS and Android, 4 LLM providers behind one interface', body);
}

/* ---------------- PROJECT CARDS ---------------- */
const TECH = {
  'OpenAI': 'openai', 'Next.js': 'nextdotjs', 'Firebase': 'firebase', 'Playwright': 'playwright',
  'TypeScript': 'typescript', 'React Native': 'react', 'Expo': 'expo',
};
function chips(t, names, x, y, size = 11.5) {
  let cx = x;
  return names.map((n) => {
    const w = 14 + 7 + textW(n, size) + 20;
    const s = `<rect x="${cx}" y="${y}" width="${w}" height="24" rx="7" fill="${t.surface2}" stroke="${t.border}"/>
    ${glyph(brand(TECH[n]), cx + 10, y + 5, 14, t.muted)}
    <text x="${cx + 31}" y="${y + 16.5}" font-size="${size}" fill="${t.text}">${esc(n)}</text>`;
    cx += w + 7;
    return s;
  }).join('\n    ');
}
function card(t, c) {
  const W = 410, H = 236;
  const desc = c.desc.map((l, i) => `<text x="24" y="${100 + i * 20}" font-size="13.2" fill="${t.muted}">${esc(l)}</text>`).join('\n    ');
  const body = `
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.surface}" stroke="${t.border}"/>
  <g class="up" style="animation-delay:.05s">
    <rect x="24" y="24" width="38" height="38" rx="10" fill="${t.accentSoft}"/>
    ${line(LINE[c.icon], 33, 33, 20, t.accent)}
    <text class="mono" x="76" y="38" font-size="10" letter-spacing="1.3" fill="${t.muted}" font-weight="600">${esc(c.eyebrow)}</text>
    <text x="75" y="60" font-size="19.5" font-weight="700" letter-spacing="-0.3" fill="${t.text}">${esc(c.title)}</text>
    ${line(LINE.arrow, W - 42, 24, 18, t.faint)}
  </g>
  <g class="up" style="animation-delay:.18s">
    ${desc}
  </g>
  <g class="up" style="animation-delay:.3s">
    <text class="mono" x="24" y="176" font-size="10.5" letter-spacing="1" fill="${t.accent}" font-weight="600">${esc(c.metric)}</text>
    ${chips(t, c.tech, 24, 192)}
  </g>`;
  return svg(W, H, `${c.title}: ${c.desc.join(' ')}`, body);
}
const CARDS = [
  {
    key: 'care', icon: 'phone', eyebrow: 'MOBILE · WEB · BILLING · HOME CARE', title: 'Alltagshelden24',
    desc: ['Offline-first caregiver app, admin platform and client', 'portal for German home-care providers, plus a billing', 'engine allocating across four insurer budget tiers.'],
    metric: 'SCHEDULING TO INVOICE, FULLY DIGITAL', tech: ['React Native', 'Expo', 'Next.js'],
  },
  {
    key: 'moxios', icon: 'layers', eyebrow: 'PLATFORM ARCHITECTURE · MEDIA', title: 'Moxios',
    desc: ['25+ event and news portals from one codebase.', 'Two-pass deduplication over live feeds, per-domain', 'data isolation and AI content in 8 languages.'],
    metric: '25+ PORTALS · 8 LANGUAGES · ONE CODEBASE', tech: ['Next.js', 'Firebase', 'OpenAI'],
  },
  {
    key: 'tenders', icon: 'file', eyebrow: 'WORKFLOW · DOCUMENT AI · PROCUREMENT', title: 'TenderHub + Submissionstool',
    desc: ['Public-tender platform with a 16-status state machine,', 'scoped access control and Microsoft Graph email sync,', 'plus PDF bid extraction with checks and human review.'],
    metric: 'SCHEMA CHECKS · REVIEW BAND · PLAYWRIGHT E2E', tech: ['OpenAI', 'Next.js', 'Playwright'],
  },
  {
    key: 'spec24', icon: 'sparkles', eyebrow: 'CO-FOUNDER · PRODUCT, PRICING, SALES', title: 'SPEC24',
    desc: ['AI client hub for agencies and freelancers. I own the', 'architecture, product, pricing and every customer', 'conversation. Launched on Product Hunt and Peerlist.'],
    metric: 'LIVE AT SPEC24.DEV · YC STARTUP SCHOOL 2026', tech: ['Next.js', 'Firebase', 'OpenAI'],
  },
];

/* ---------------- BUTTONS (one file each, readable on both themes) ---------------- */
function button({ label, icon, brandIcon, primary }) {
  const H = 40, size = 14;
  const W = Math.round(16 + 16 + 9 + textW(label, size) + 20);
  const fill = primary ? '#2563eb' : '#1f2937';
  const stroke = primary ? '#3b82f6' : '#374151';
  const ic = brandIcon ? glyph(brand(brandIcon), 16, 12, 16, '#ffffff') : line(LINE[icon], 16, 12, 16, '#ffffff', 2);
  const body = `
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${fill}" stroke="${stroke}"/>
  ${ic}
  <text x="41" y="25.5" font-size="${size}" font-weight="600" fill="#ffffff">${esc(label)}</text>`;
  return svg(W, H, label, body);
}
const BUTTONS = [
  { key: 'portfolio', label: 'Portfolio', icon: 'globe', primary: true },
  { key: 'linkedin', label: 'LinkedIn', brandIcon: 'linkedin' },
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'spec24', label: 'SPEC24', icon: 'sparkles' },
];

/* ---------------- TERMINAL (dark on both themes) ---------------- */
function terminal() {
  const W = 840, H = 262, cw = 7.9, lh = 23, x0 = 28, y0 = 72;
  const c = { bg: '#0b0f17', bar: '#111827', border: '#263041', text: '#e6edf3', muted: '#8b98a9', accent: '#7aa7ff', ok: '#3fb950' };
  const rows = [
    { t: 'type', prompt: '$', s: 'claude', at: 0.4 },
    { t: 'type', prompt: '>', s: '/review', at: 1.2 },
    { t: 'out', dot: c.accent, s: 'code-review skill · diff checked against project rules', at: 2.0 },
    { t: 'out', check: true, s: 'component patterns match the design system', at: 2.5 },
    { t: 'type', prompt: '>', s: 'run the bid upload end-to-end suite', at: 3.1 },
    { t: 'out', dot: c.accent, s: 'playwright via MCP · chromium', at: 4.6 },
    { t: 'out', check: true, s: 'upload → extract → review → approve', tail: 'passed', at: 5.2 },
  ];
  // Typing: a strip in the terminal colour covers each command and slides right one
  // character per step. Its resting transform attribute already clears the text, so
  // static renderers and reduced-motion viewers see the full command.
  const keyframes = [];
  const lines = rows.map((r, i) => {
    const y = y0 + i * lh;
    if (r.t === 'type') {
      const n = r.s.length, per = 0.045, dist = Math.round(n * cw + 24);
      keyframes.push(`@keyframes t${i} { from { transform: translateX(0); } to { transform: translateX(${dist}px); } }`);
      return `<g class="fade" style="animation-delay:${(r.at - 0.15).toFixed(2)}s"><text class="mono" x="${x0}" y="${y}" font-size="13" fill="${r.prompt === '$' ? c.ok : c.accent}" font-weight="700">${esc(r.prompt)}</text></g>
  <text class="mono" x="${x0 + 18}" y="${y}" font-size="13" fill="${c.text}">${esc(r.s)}</text>
  <rect x="${x0 + 16}" y="${y - 16}" width="${dist}" height="22" fill="${c.bg}" transform="translate(${dist} 0)" style="animation: t${i} ${(n * per).toFixed(2)}s steps(${n}, end) ${r.at.toFixed(2)}s both;"/>`;
    }
    const mark = r.check
      ? line(LINE.check, x0 + 17, y - 11, 13, c.ok, 2.6)
      : `<circle cx="${x0 + 23.5}" cy="${y - 4.5}" r="3.2" fill="${r.dot}"/>`;
    const tail = r.tail ? `<tspan fill="${c.ok}" font-weight="700">   ${esc(r.tail)}</tspan>` : '';
    return `<g class="up" style="animation-delay:${r.at.toFixed(2)}s">${mark}<text class="mono" x="${x0 + 36}" y="${y}" font-size="13" fill="${r.check ? c.text : c.muted}" xml:space="preserve">${esc(r.s)}${tail}</text></g>`;
  }).join('\n  ');
  const lastY = y0 + rows.length * lh;
  const body = `
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${c.bg}" stroke="${c.border}"/>
  <path d="M14.5 0.5 H${W - 14.5} A14 14 0 0 1 ${W - 0.5} 14.5 V38 H0.5 V14.5 A14 14 0 0 1 14.5 0.5 Z" fill="${c.bar}"/>
  <line x1="0.5" y1="38" x2="${W - 0.5}" y2="38" stroke="${c.border}"/>
  <circle cx="22" cy="19" r="6" fill="#ff5f57"/><circle cx="42" cy="19" r="6" fill="#febc2e"/><circle cx="62" cy="19" r="6" fill="#28c840"/>
  <text class="mono" x="${W / 2}" y="23" font-size="11.5" text-anchor="middle" fill="${c.muted}">claude code · tenderhub</text>
  ${lines}
  <g class="fade" style="animation-delay:6s">
    <text class="mono" x="${x0}" y="${lastY}" font-size="13" fill="${c.accent}" font-weight="700">&gt;</text>
    <rect class="cursor" x="${x0 + 18}" y="${lastY - 12}" width="8" height="15" fill="${c.text}"/>
  </g>`;
  const css = `@keyframes blink { 50% { opacity: 0; } } .cursor { animation: blink 1.1s steps(1) 6.4s 6; }
  ${keyframes.join('\n  ')}`;
  return svg(W, H, 'Terminal: Claude Code running a code-review skill and a Playwright end-to-end suite through MCP', body, css);
}

/* ---------------- STACK ---------------- */
function stack(t) {
  const W = 840, rowH = 50, top = 22;
  const rows = [
    ['PRODUCT', [['TypeScript', 'typescript'], ['React', 'react'], ['Next.js', 'nextdotjs'], ['React Native', 'react'], ['Expo', 'expo'], ['Node.js', 'nodedotjs']]],
    ['DATA', [['Python', 'python'], ['PostgreSQL', 'postgresql'], ['Firebase', 'firebase'], ['Elasticsearch', 'elasticsearch']]],
    ['AI & LLM', [['OpenAI', 'openai'], ['Anthropic', 'anthropic'], ['Gemini', 'googlegemini'], ['Mistral', 'mistralai'], ['MCP', 'modelcontextprotocol']]],
    ['DELIVERY', [['AWS', 'amazonwebservices'], ['Vercel', 'vercel'], ['Docker', 'docker'], ['GitHub Actions', 'githubactions'], ['Playwright', 'playwright']]],
  ];
  const H = top * 2 + rows.length * rowH - 16;
  const body = rows.map(([label, items], r) => {
    const y = top + r * rowH;
    let x = 150;
    const cs = items.map(([name, icon]) => {
      const w = 16 + 8 + textW(name, 12.5) + 22;
      const s = `<rect x="${x}" y="${y}" width="${w}" height="34" rx="9" fill="${t.surface2}" stroke="${t.border}"/>
      ${glyph(brand(icon), x + 11, y + 9, 16, t.text)}
      <text x="${x + 35}" y="${y + 21.5}" font-size="12.5" fill="${t.text}">${esc(name)}</text>`;
      x += w + 8;
      return s;
    }).join('\n      ');
    return `<g class="up" style="animation-delay:${(0.08 + r * 0.1).toFixed(2)}s">
      <text class="mono" x="28" y="${y + 21.5}" font-size="11" letter-spacing="1.4" font-weight="600" fill="${t.muted}">${esc(label)}</text>
      ${cs}
    </g>`;
  }).join('\n  ');
  return svg(W, H, 'Stack: TypeScript, React, Next.js, React Native, Expo, Node.js; Python, PostgreSQL, Firebase, Elasticsearch; OpenAI, Anthropic, Gemini, Mistral, MCP; AWS, Vercel, Docker, GitHub Actions, Playwright',
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.surface}" stroke="${t.border}"/>\n  ${body}`);
}

for (const [mode, t] of Object.entries(THEMES)) {
  save(`hero-${mode}.svg`, hero(t));
  save(`impact-${mode}.svg`, stats(t));
  save(`stack-${mode}.svg`, stack(t));
  for (const c of CARDS) save(`card-${c.key}-${mode}.svg`, card(t, c));
}
for (const b of BUTTONS) save(`btn-${b.key}.svg`, button(b));
save('terminal.svg', terminal());
console.log('assets written to', out);
