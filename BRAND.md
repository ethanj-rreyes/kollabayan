# KollaBayan: Brand and Build Notes

Based on **Gabay sa Brand v1.0 (Setyembre 2026)**. Tokens are in `src/index.css` (`@theme`) and available as Tailwind utilities (`bg-laot`, `text-tinta`, `font-display`, …).

| Token | Hex | Used for |
|---|---|---|
| `layag` | #F3F7F5 | App background, text on dark surfaces |
| `buhangin` | #DFE6E2 | Borders, panels, low-priority chips, tag outlines |
| `dagat` | #0D3446 | Dark hero panels, drawer + workspace headers, links, Paid badge |
| `laot` | #1E5B57 | **Primary action**: buttons, selected states, progress, active nav |
| `lalim` | #1F5A66 | Uppercase labels, eyebrow text, icons |
| `liwayway` | #D7A441 | **Sun + verified badge only**, plus eyebrows on dark cards. Never text on Layag |
| `tinta` | #0A2532 | Body text (with opacity steps for secondary text) |
| `sabit` | #B4533F | Form error state (not in core palette; swap if the brand team defines one) |

**Type:** Literata 600 (`font-display`) for headlines and taglines only, never under 20px. Albert Sans 400/600 for all UI, body, and labels.

**Shared data:** `src/data/taxonomy.ts` holds the skill categories and project types used by Onboarding, the Discovery filters, and Profile — edit them in one place.

**Interactions:** every button has working logic (in-memory state, no backend yet). Drawers and dialogs use the shared `Sheet` component and close on Esc or backdrop click.

**Location data:** `taxonomy.ts` also holds the country list and the 18 Philippine regions with their cities (Onboarding asks region → city only for the Philippines).

**Components added:** `Sheet` (drawer/dialog), `BrandMark` (SVG mark, ink/light/mono), `Logo` (lockup), `Icon` (line icons replacing emoji), `VerifiedBadge` / `VerifiedDot`.

**Voice:** all UI copy is in English. The one Filipino term kept is **Balangay**, used for a team/boat ("Join the Balangay", "You're not alone in the Balangay."). Headlines and CTAs use the English brand taglines (Find. Build. Show. · Let's row, team. · One boat, one shore. · Together at the oar, together at the shore.). Mock people and schools are localized to PH.

**Avoided per guide:** emoji, flag colors, jeepney / bahay kubo imagery, rainbow gradients, "Mabuhay!" greetings, corporate SaaS jargon.

## Build page (Workspace) rules

Logic lives in `src/screens/workspace/model.ts`; views and panels sit beside it.

- **Zero-UI status:** tasks link to where the work happens (Figma file, Doc, PR, form). Connected tools (max 5) move tasks forward on their own — tools never move work backwards. Manual moves still work but are counted separately in Activity.
- **Capacity ceiling:** `min(declared weekly hours, floor(4-sprint average delivered))`. Load = estimates of all open tasks. Any assignment, reassignment, estimate increase, or reopen that would exceed the ceiling is blocked (Asana / Monday style).
- **Single owner + sprint limit:** every task has exactly one owner; max 2 tasks in Doing per person (Linear style).
- **Adaptive views:** Focus (terminal-style "my tasks"), Board, Timeline (Gantt). Each crewmate opens in their usual view; the data is the same in all three.
- **Agreements + decisions:** working agreements need each crewmate's "I agree"; async decisions are voted on, linked to tasks, and close by majority (tie → lead).
- **Layout:** one-line header (Project info holds description, output, deadline). Tasks tab has a right-side **Project hub** with Connected apps, Links (manual + files found in your apps), and an Activity & versions log (auto / manual / blocked, filterable). Hub is open on Board, collapsed on Focus and Timeline, and toggleable. Crew is a toolbar pill; a single alert line appears only when action is needed.
- **Discussions:** Decisions and Agreements are full-width two-pane views: list on the left, the selected item with votes or sign-offs and a reply thread on the right.
- **Automated versions:** links tied to an app (e.g. Project Brief → Google Docs) get a new version whenever that app reports an edit; manual "Log update" still works.
- The Activity "Simulate tool activity" button is a demo control — it stands in for real webhooks.
