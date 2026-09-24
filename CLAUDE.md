---
name: frontend-interactive
description: Build functional, highly interactive, and visually unique frontend interfaces — components, pages, or full apps — with real working behavior (including 3D/motion where it adds value), not just static "pretty" layouts.
---

# Frontend: Functional & Interactive Design

This skill guides building interfaces that are judged first by **how they work and feel to use**, not just how they look in a screenshot. Every page/component should do something — react, animate, respond, transform — not sit there as a static mockup.

## Priorities (in order)

1. **Functionality first.** Every interactive element must actually work: forms validate, buttons do something real, state persists correctly, data flows make sense. Never ship a fake/disabled control unless explicitly asked for a static mockup.
2. **Interactivity as the core experience**, not decoration. Prefer:
   - Real-time feedback (live validation, live previews, optimistic UI updates)
   - Drag-and-drop, hover states with purpose, gestures, keyboard shortcuts
   - Micro-interactions tied to user actions (not autoplay/idle animation everywhere)
   - State that's visible and understandable (loading, empty, error, success states all designed, not afterthoughts)
3. **Distinctive identity.** Avoid generic SaaS/AI-slop look: no purple gradient on white, no Inter/Roboto by default, no identical rounded cards with the same soft shadow. Commit to one bold, specific direction tied to what the site is actually for.
4. **3D / advanced visuals — only when they serve the content.** Don't bolt on 3D for its own sake. Use it when:
   - The subject matter is spatial/physical (products, architecture, data landscapes, games)
   - It's the "hero moment" — one unforgettable interactive centerpiece, not scattered everywhere
   - Performance stays acceptable (test on a mid-range device mentally; provide a reduced-motion / static fallback)

## Recommended tools for 3D & rich interactivity

- **Three.js** (raw) or **React Three Fiber** (`@react-three/fiber` + `@react-three/drei`) for 3D scenes, product viewers, particle fields, WebGL backgrounds.
- **Framer Motion** for orchestrated, physics-based UI animation (page transitions, staggered reveals, drag interactions).
- **GSAP** for scroll-triggered storytelling and precise timeline control.
- **Canvas/WebGL shaders** for generative backgrounds, gradients that react to cursor/scroll, or custom textures — when they reinforce the concept, not as wallpaper.

Match complexity to purpose: a portfolio hero can justify a full WebGL scene; a settings page should not have one.

## Design thinking (do this before coding)

- **Purpose & user**: what does someone actually *do* here? What's the one interaction they'll remember?
- **Tone**: pick an extreme (brutalist, playful/toy-like, editorial, luxury, retro-futuristic, organic) and commit — don't average toward "safe."
- **The one bold move**: identify the single most memorable interactive/visual element. Everything else stays quiet and disciplined around it.
- **Real content**: build with actual copy/data for the subject, not lorem ipsum — placeholder content makes even a good design feel templated.

## Guardrails

- Never use `localStorage`/`sessionStorage` inside Artifacts (they silently fail there) — use in-memory state instead, unless the code is meant to run outside Artifacts.
- Respect `prefers-reduced-motion` for any non-essential animation.
- Keyboard focus must stay visible; interactive elements need real accessible states (not just `:hover`).
- Mobile breakpoints are not optional — an "impressive" desktop-only interaction needs a real fallback on small screens.
- Avoid the generic AI tells: all-caps eyebrow labels, "→" on every button, middle-dot meta strings, one identical border-radius/shadow on every card, single-word accent-color emphasis in headlines.

## Process

1. Plan: purpose, tone, the one memorable interaction, and whether 3D/advanced motion is actually justified.
2. Sketch the interaction flow, not just the static layout — what happens on click/scroll/hover/load?
3. Build with real, working code (real state management, real event handling).
4. Self-critique: does removing the flashiest single element break the experience, or was it decoration? Keep only what earns its place.

---

## Case Study: Security Operations Dashboard (Malware / Brute Force / IP Traffic)

This kind of dashboard is judged by security professionals, so it must read as an **operational tool**, not a "hacker aesthetic" poster. The most common AI-slop tell for cyber dashboards specifically is: black background + neon green/cyan Matrix-rain + generic "SOC" glow cards + a spinning purple globe with no real data behind it. Avoid that combination unless deliberately reinterpreted.

### Pick ONE real conceptual direction, not the neon-hacker default

- **Observatory / radar console** — dark, precise, instrument-panel feel (radar sweep, concentric range rings, monospace-for-data-only, muted phosphor amber/cyan used sparingly as *signal*, not wallpaper).
- **Clinical monitoring (ICU vitals)** — treat the network like a patient: waveform "heartbeats" for traffic, vitals-style readouts for uptime/latency, alert colors reserved only for actual anomalies. Calm baseline, sharp contrast on alert.
- **Air-traffic-control** — utilitarian, high information density, strict grid, alarms are loud only when real; everything else quiet and legible at a glance.
- **Blueprint / schematic** — engineering-drawing aesthetic: grid paper, annotation callouts, precise line-weights, network topology literally drawn like a circuit diagram.

Whichever you pick, the accent color should mean something (e.g., amber = warning, red = active attack, teal = normal traffic) — never decorative gradients.

### 1. Malware Detection — ideas beyond a basic table

- **Infection-path Sankey/flow diagram**: entry vector → malware family → affected host/target. Shows *how* malware spreads, not just a list.
- **Threat family treemap or radial cluster**: size = frequency, color = severity — lets someone spot the dominant threat family instantly.
- **Geo-origin map** (flat, interactive choropleth or dot-density map) showing where detections originated; reserve a literal 3D globe with arcs for a single "hero" view if you want the 3D moment — flip-able to flat map for actual analysis (3D looks cool but is worse for real reading of data).
- **Detection timeline** with severity-colored ticks, zoomable, so spikes/campaigns are visible over time.
- **Confidence/severity radial gauge** per detection, plus a drill-down panel (hash, signature, first-seen, related IOCs).

### 2. Brute Force Monitoring — ideas beyond a raw counter

- **Live attempt counter** that increments in real time (or simulated stream) — this earns a micro-interaction (tick/pulse on increment).
- **Country-of-origin choropleth or ranked bar list** (bars often read faster than a map for "which country attacked most" — consider pairing both: map for geography, sortable bar list for precision).
- **Attack timeline / histogram** showing burst patterns (brute force usually comes in spikes, not a steady drizzle) — this is the kind of shape a security analyst actually looks for.
- **Top offending IPs/ASN leaderboard** with expandable detail (attempts, target accounts, time window).
- **"Impossible travel" / geo-velocity flags**: same account attacked from two distant countries within minutes — a nice, real, non-generic feature to visualize as connected dots/lines.

### 3. IP / WiFi Traffic Monitoring — ideas beyond a line chart

- **Network topology graph**: nodes = devices on the network, edges = active connections, edge thickness = traffic volume. This is a genuinely useful and visually distinctive centerpiece (good candidate for a light 3D/force-directed layout).
- **Real-time bandwidth stream** (in/out) as a live line or area chart — but make it feel alive (smooth streaming update, not a static screenshot).
- **Security posture indicator**: encryption type (WPA2/WPA3/open), firmware status, open ports — presented as a clear pass/fail checklist or shield-style status, not just a color dot.
- **Protocol/traffic-type breakdown** (bar or stacked-bar over time reads better than a pie/donut for this — donuts are an overused default).
- **Anomalous device panel**: new/unknown device joins, unusual traffic volume from one device — flagged distinctly from normal traffic.

### Functional details that make it feel like a real tool, not a mockup

- Filters that actually filter (time range, severity, country, device) — state changes should be visible everywhere at once.
- A persistent **alert feed** (like a live log/ticker) separate from the summary charts — this is what makes it feel "operational."
- Drill-down: every summary chart should lead somewhere (click a country → see its IPs; click a malware family → see instances).
- Explicit states: "no threats detected" (calm, reassuring) vs. "active incident" (unmistakably different mode — border color, sound-off alert badge, etc.) — this contrast is more memorable than any single chart.
- If you simulate data, make it *behave* like real security data: bursty, spiky, occasional false positives — not a smooth random walk.

---

## Locked Palette: Light Theme (do not change hue)

The project has settled on a **light** theme — do not switch to dark/neon-hacker mode. Lock these roles, not necessarily exact hex values (adjust for contrast/accessibility, but keep the roles and relative warmth/character):

- **Background**: soft neutral off-white (not pure `#FFFFFF`) — warm-grey, roughly `#F6F5F2`.
- **Card surface**: pure white, differentiated from background by a hairline border or very subtle shadow — not both on every card.
- **Sidebar**: dark charcoal (`~#24262A`), the one deliberately "heavy" area on the page — this contrast is good, keep it.
- **Primary accent (orange-red, ~`#F2542D`)**: reserve for genuinely urgent/attention state only — active threats, alerts, "needs attention" badges. Do NOT use it decoratively in headlines or as a generic brand color.
- **Secondary accent (blue, ~`#2F6FED`)**: calm/informational state — live status, "normal" traffic, neutral links.
- **Text**: near-black `#14151A` primary, mid-grey `#6B6F76` secondary.

### Specific fixes for the current build (avoid these exact patterns)

These are the concrete AI-slop tells found in the first build of this dashboard — avoid recreating them:

1. **No all-caps eyebrow labels joined with a middle dot** (e.g. "LIVE DEFENSE · OVERVIEW"). Use sentence case; if a live/status indicator is needed, a single meaningful colored dot is enough.
2. **Never color a single word/phrase inside a headline** for decoration (e.g. coloring "today's defense" orange). Keep headlines monochrome; let color carry real status meaning elsewhere.
3. **Don't give every stat card the same radius + same soft shadow + same corner sparkline.** Vary treatment by urgency/hierarchy: the most important metric (e.g. active threats) gets a heavier border or larger type; secondary metrics stay flatter/quieter.
4. **Avoid the default donut/ring chart for an overall score.** Prefer a stacked status list (each subsystem with its own pass/fail) or a custom instrument-style gauge — something that reads as purpose-built for security monitoring, not a generic "% complete" ring.
5. **Give the live hero chart (network traffic) dominant width** (e.g. ~70%) instead of splitting the row evenly with a secondary widget — it's the most "alive" element and should read as the visual anchor of the page.
6. **Typography**: pair one distinctive display/grotesk face for headings/nav with a dedicated monospace face used *only* for data values (IPs, percentages, counts, timestamps). This reinforces "technical precision" without resorting to neon-hacker cliché, and works fine on a light background.
7. **New module to add, not yet present**: a network topology graph card (nodes = devices, edges = active connections, edge thickness = traffic volume) — light canvas, thin grey edges, accent-colored nodes only when anomalous. This is a real, distinctive addition the current build is missing.

---

## Cara Pakai (How to Use This)

1. **Simpan file ini** sebagai `CLAUDE.md` di root folder project kamu (misalnya lewat Claude Code / repo kamu). Claude akan otomatis membacanya sebagai instruksi standar setiap kali mengerjakan project itu.
2. **Panggil secara eksplisit saat butuh** — misalnya: *"buatkan landing page produk ini, ikuti CLAUDE.md"* atau *"redesign komponen ini biar lebih interaktif sesuai panduan di CLAUDE.md."*
3. **Untuk elemen 3D**, sebut jenis interaksinya biar Claude pilih tool yang pas — contoh: *"buatkan hero section dengan objek 3D yang bisa diputar pakai mouse"* → biasanya akan pakai React Three Fiber; *"animasi scroll yang reveal section satu-satu"* → biasanya pakai Framer Motion/GSAP.
4. **Edit sesuai kebutuhan project kamu** — bagian "Recommended tools" bisa disesuaikan kalau stack kamu beda (misalnya kamu pakai Vue, bukan React → ganti React Three Fiber dengan TresJS).
5. File ini paling efektif dipakai bareng skill/alat pembuat frontend (artifact, Claude Code, dsb) — taruh sebagai konteks berulang, bukan sekali pakai.
