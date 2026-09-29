<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/hero-dark.svg">
  <img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/hero-light.svg" width="100%" alt="Cosmin Oros, full-stack product engineer. I build products that ship: web, mobile, backend and the AI inside them, from first commit to paying customers.">
</picture>

<p>
  <a href="https://cosmin-oros-dev.vercel.app/"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/btn-portfolio.svg" height="40" alt="Portfolio"></a>
  <a href="https://www.linkedin.com/in/oros-cosmin"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/btn-linkedin.svg" height="40" alt="LinkedIn"></a>
  <a href="mailto:cosminorosdev@gmail.com"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/btn-email.svg" height="40" alt="Email"></a>
  <a href="https://spec24.dev"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/btn-spec24.svg" height="40" alt="SPEC24"></a>
</p>

Full-Stack Software Engineer at **GAIM Solutions**, an AI software company in Munich, where I have built five products for German businesses end to end: the mobile apps, the web platforms, the backends, the billing and the AI features inside them. Co-founder of **[SPEC24](https://spec24.dev)**, where I also own pricing, positioning and every customer conversation. I care most about the parts that keep software trustworthy once real people depend on it: explicit state machines for messy workflows, mobile apps that keep working offline, billing logic that is tested rather than trusted, and AI output that is checked before anyone acts on it. Earlier: Continental, Nokia and [e-spres-oh].

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/impact-dark.svg">
  <img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/impact-light.svg" width="100%" alt="5 products in production built end to end at GAIM, 25+ portals served from one codebase, 3 platforms shipped: web, iOS and Android, 4 LLM providers behind one interface">
</picture>

## Selected work

<p>
  <a href="https://cosmin-oros-dev.vercel.app/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-care-dark.svg"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-care-light.svg" width="49%" alt="Alltagshelden24: offline-first caregiver app, admin platform and client portal for German home-care providers, plus a billing engine across four insurer budget tiers"></picture></a>
  <a href="https://cosmin-oros-dev.vercel.app/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-moxios-dark.svg"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-moxios-light.svg" width="49%" alt="Moxios: 25+ portals from one codebase with AI content in 8 languages"></picture></a>
  <a href="https://cosmin-oros-dev.vercel.app/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-tenders-dark.svg"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-tenders-light.svg" width="49%" alt="TenderHub and Submissionstool: public-tender workflow platform with document AI that is checked before anyone acts on it"></picture></a>
  <a href="https://spec24.dev"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-spec24-dark.svg"><img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/card-spec24-light.svg" width="49%" alt="SPEC24: AI client hub for agencies and freelancers that I co-founded and run end to end"></picture></a>
</p>

<details>
<summary><b>Under the hood: offline-first mobile and a billing engine that has to be right</b></summary>
<br>

```mermaid
flowchart LR
  A[Caregiver app<br/>works offline] -->|sync when online| B[Visit records<br/>and signatures]
  S[Scheduling<br/>conflict detection across regions] --> B
  B --> C[Billing engine<br/>allocation across 4 insurer budget tiers]
  C --> D[Insurer-compliant invoices<br/>via LexOffice API]
  B --> E[Admin platform<br/>and client portal]
```

- **Built for the field, not the office.** Caregivers document visits and capture signatures on a phone with no signal, and the app reconciles when it is back online.
- **Rules learned from the people who ran the process.** The insurer budget tiers were modelled with the staff who used to allocate them by hand, so the automation matches how care is actually billed.
- **Whole workflow, one system.** Scheduling, documentation and invoicing had been spread across paper and spreadsheets. Now they run end to end in three apps that share one backend.

</details>

<details>
<summary><b>Under the hood: one codebase, 25+ portals</b></summary>
<br>

```mermaid
flowchart TD
  F1[Feed A] --> I[Ingest]
  F2[Feed B] --> I
  F3[Feed C] --> I
  I --> D[Two-pass deduplication]
  D --> AI[AI generation and translation<br/>into 8 languages]
  AI --> T{Per-domain<br/>tenant isolation}
  T --> P[25+ portals with Schema.org,<br/>hreflang and per-domain sitemaps]
```

- **Tenancy by domain.** Every portal gets isolated data, its own sitemap, hreflang and Schema.org markup from a single deployment.
- **Clean input.** A two-pass deduplication algorithm runs over continuously arriving feeds, so the same event never appears twice.
- **Content at scale.** An OpenAI layer generates and translates content into 8 languages, bringing in thousands of impressions and clicks each month.

</details>

<details>
<summary><b>Under the hood: document AI that people stopped double-checking</b></summary>
<br>

```mermaid
flowchart TD
  A[PDF bid] --> B[LLM extraction<br/>strict JSON schema]
  B --> C{Schema and cross-field<br/>arithmetic checks}
  C -->|high confidence| D[(Database)]
  C -->|low confidence| E[Human review band]
  E -->|approved or corrected| D
  D --> F[Comparison dashboards<br/>and price maps]
```

- **Schema first.** The model fills a strict JSON schema, so malformed output fails loudly instead of reaching the database.
- **Arithmetic as a guardrail.** Quantities, unit prices and line totals have to reconcile before a row is accepted.
- **People only where they add value.** Low-confidence results go to a review band, everything else flows straight through. Users stopped re-checking extractions by hand.
- **Measured against ground truth.** Extraction quality is validated against labelled documents, not judged by eye.

</details>

<details>
<summary><b>Under the hood: the model layer</b></summary>
<br>

```mermaid
flowchart LR
  Feat[Product feature] --> R[Provider router<br/>switch or fall back]
  R --> O[OpenAI]
  R --> An[Anthropic]
  R --> G[Gemini]
  R --> M[Mistral]
  O --> V[Structured output validation]
  An --> V
  G --> V
  M --> V
  V --> Out[Result]
```

- **No single-vendor lock-in.** OpenAI, Anthropic, Gemini and Mistral sit behind one interface, so a feature can switch or fall back between providers.
- **Only where it earns its place.** Most of these products are deterministic. The model handles the part that was genuinely unstructured, and everything around it is ordinary, tested software.
- **Beyond completions.** MCP servers and agent tooling connect models to real systems and data.

</details>

## How I work

- **Start with the person who runs the process.** The billing rules in Alltagshelden24 came from the people who did it by hand, before any of it was modelled.
- **Make correctness visible.** State machines for messy workflows, arithmetic checks on extracted data, end-to-end tests on the paths that matter.
- **Own the outcome, not the ticket.** At SPEC24 that meant pricing, launch and support as well as the code.

<img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/terminal.svg" width="100%" alt="Claude Code running a code-review skill and a Playwright end-to-end suite through MCP">

Claude Code is my daily environment: project-scoped skills and slash commands so workflows repeat, code review running as a skill on every change, and Playwright end-to-end suites driven through MCP servers. It is leverage, not a substitute for judgment. Every line still gets read, tested and shipped under my name. The same setup built SPEC24's launch pipeline: Remotion videos, lead generation and email marketing.

## Stack

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/stack-dark.svg">
  <img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/stack-light.svg" width="100%" alt="TypeScript, React, Next.js, React Native, Expo, Node.js, Python, PostgreSQL, Firebase, Elasticsearch, OpenAI, Anthropic, Gemini, Mistral, MCP, AWS, Vercel, Docker, GitHub Actions, Playwright">
</picture>

## Activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/activity-dark.svg">
  <img src="https://raw.githubusercontent.com/cosmin-oros/cosmin-oros/main/assets/activity-light.svg" width="100%" alt="Contribution activity over the last year">
</picture>
