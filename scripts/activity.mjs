// Renders assets/activity-{dark,light}.svg from the last year of contributions.
// In GitHub Actions it uses the GraphQL API with GITHUB_TOKEN.
// Without a token it reads the public contributions page instead.
// Run: node scripts/activity.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, esc, svg } from './theme.mjs';

const LOGIN = process.env.GH_LOGIN || 'cosmin-oros';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const UA = { 'User-Agent': `${LOGIN}-profile-activity` };

async function fromGraphQL(token) {
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date weekday contributionCount contributionLevel } } } } } }`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...UA, Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return mapGraphQL(json);
}

export function mapGraphQL(json) {
  const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  const weeks = cal.weeks.map((w) => w.contributionDays.map((d) => ({
    date: d.date, weekday: d.weekday, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0,
  })));
  return { total: cal.totalContributions, weeks };
}

async function fromHTML() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, { headers: UA });
  if (!res.ok) throw new Error(`contributions page HTTP ${res.status}`);
  return parseHTML(await res.text());
}

export function parseHTML(html) {
  const tips = new Map();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) tips.set(m[1], m[2]);
  const weeks = [];
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="([^"]+)"/)[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1] ?? '';
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    const pos = id.match(/-(\d+)-(\d+)$/);
    if (!pos) continue;
    const weekday = Number(pos[1]), week = Number(pos[2]);
    const tip = tips.get(id) ?? '';
    const n = tip.match(/^([\d,]+) contributions?/);
    (weeks[week] ??= []).push({ date, weekday, level, count: n ? Number(n[1].replace(/,/g, '')) : 0 });
  }
  const clean = weeks.filter(Boolean).map((w) => w.sort((a, b) => a.weekday - b.weekday));
  const total = clean.flat().reduce((s, d) => s + d.count, 0);
  if (!clean.length) throw new Error('no calendar cells found in contributions page');
  return { total, weeks: clean };
}

export function summarize({ total, weeks }) {
  const days = weeks.flat().sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  return { total, active: days.filter((d) => d.count > 0).length, longest };
}

export function render(t, data) {
  const { total, active, longest } = summarize(data);
  const W = 840, cell = 11, step = 14;
  const gridW = data.weeks.length * step - (step - cell);
  const x0 = Math.round((W - gridW) / 2), gy = 92, H = 232;
  const fmt = (n) => n.toLocaleString('en-US');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // A label sits over the first column of each month. When the calendar opens with
  // a month's last few days, that leading label is dropped so the next one has room.
  const starts = [];
  data.weeks.forEach((w, i) => {
    const m = Number(w[w.length - 1].date.slice(5, 7)) - 1;
    if (!starts.length || starts[starts.length - 1].m !== m) starts.push({ m, x: x0 + i * step });
  });
  if (starts.length > 1 && starts[1].x - starts[0].x < 30) starts.shift();
  const months = starts.map(({ m, x }) => `<text class="mono" x="${x}" y="${gy - 10}" font-size="10.5" fill="${t.muted}">${MONTHS[m]}</text>`);

  const cols = data.weeks.map((w, i) => {
    const rects = w.map((d) => `<rect x="${x0 + i * step}" y="${gy + d.weekday * step}" width="${cell}" height="${cell}" rx="2.5" fill="${t.heat[d.level]}"/>`).join('');
    return `<g class="fade" style="animation-delay:${(i * 0.014).toFixed(3)}s">${rects}</g>`;
  }).join('\n  ');

  const legendX = x0 + gridW - (5 * step - 3);
  const legend = t.heat.map((c, i) => `<rect x="${legendX + i * step}" y="${gy + 7 * step + 12}" width="${cell}" height="${cell}" rx="2.5" fill="${c}"/>`).join('');
  const footY = gy + 7 * step + 21;

  const body = `
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${t.surface}" stroke="${t.border}"/>
  <g class="up">
    <text x="${x0}" y="46"><tspan font-size="24" font-weight="700" letter-spacing="-0.5" fill="${t.text}">${fmt(total)}</tspan><tspan font-size="14" fill="${t.muted}" dx="8">contributions in the last year</tspan></text>
    <text x="${x0 + gridW}" y="46" font-size="13" text-anchor="end" fill="${t.muted}"><tspan fill="${t.text}" font-weight="600">${fmt(active)}</tspan> active days  ·  <tspan fill="${t.text}" font-weight="600">${fmt(longest)}</tspan>-day longest streak</text>
  </g>
  ${months.join('\n  ')}
  ${cols}
  <text class="mono" x="${x0}" y="${footY}" font-size="10.5" fill="${t.faint}">Updated daily by a GitHub Action</text>
  <text class="mono" x="${legendX - 8}" y="${footY}" font-size="10.5" text-anchor="end" fill="${t.faint}">Less</text>
  ${legend}
  <text class="mono" x="${legendX + 5 * step + 5}" y="${footY}" font-size="10.5" fill="${t.faint}">More</text>`;
  return svg(W, H, `${fmt(total)} contributions in the last year, ${fmt(active)} active days, ${fmt(longest)}-day longest streak`, body);
}

async function main() {
  let data;
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try { data = await fromGraphQL(token); } catch (e) { console.warn(`GraphQL failed (${e.message}), using public page`); }
  }
  data ??= await fromHTML();
  mkdirSync(out, { recursive: true });
  for (const [mode, t] of Object.entries(THEMES)) writeFileSync(join(out, `activity-${mode}.svg`), render(t, data));
  const s = summarize(data);
  console.log(`activity: ${s.total} contributions, ${s.active} active days, longest streak ${s.longest}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main().catch((e) => { console.error(e); process.exit(1); });
