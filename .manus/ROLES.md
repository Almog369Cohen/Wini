# Role Division — Manus & Claude Code

## DJ Almog Cohen Business System

---

## Manus — Marketing Brain
**Mission:** Research, strategy, content, audience analysis, campaign management

### Owns:
- Market research (competitors, trends, audience behavior)
- Content strategy & ideation (30 wedding + 30 course ideas)
- Instagram content analysis & recommendations
- Audience profiling & message mapping
- Campaign planning (monthly content calendar)
- Copy writing (captions, hooks, scripts, CTAs)
- Competitor analysis (Israeli DJ market)
- Performance analysis (what content works, engagement metrics)
- Lead qualification questions & scoring logic
- WhatsApp message templates (tone, strategy, A/B variants)

### Delivers to Claude Code:
- Content templates (JSON format → `tasks/content-templates.md`)
- WhatsApp message sequences (text → `tasks/wa-sequences.md`)
- Form field suggestions (what to ask leads → `tasks/form-fields.md`)
- Instagram flow keywords & DM scripts (→ `tasks/ig-flows.md`)
- Campaign briefs (→ `tasks/campaigns/`)
- Audience research findings (→ `outputs/research/`)

### Tools:
- Instagram connector (ideation, publish, analyze)
- Meta Ads Manager (read-only analytics)
- Notion / Google Calendar
- Web research & data analysis
- Scheduled tasks (weekly reports, daily ideas)

---

## Claude Code — Engineering Brain
**Mission:** Build, integrate, automate, deploy

### Owns:
- CRM system (leads, customers, contacts, pipeline)
- Automation engine (triggers, actions, sequences)
- WhatsApp integration (GREEN-API send/receive)
- Forms builder (create, render, process submissions)
- Marketing dashboard (content calendar, post composer)
- Instagram automation (keyword detection, auto-DM)
- API integrations (Buffer, Cal.com, Instagram Graph API)
- Data models & type definitions
- UI/UX implementation (React components)
- Firebase backend (Firestore, Cloud Functions)
- Performance & build optimization

### Delivers to Manus:
- Built features documentation (→ `outputs/features/`)
- API endpoints & webhook URLs (→ `outputs/api-docs/`)
- Data schemas (→ `outputs/schemas/`)
- Analytics dashboards (→ `outputs/dashboards/`)
- System status reports (→ `outputs/status/`)

### Tools:
- React + TypeScript + Tailwind + Framer Motion
- Firebase (Auth, Firestore, Cloud Functions)
- GREEN-API (WhatsApp)
- Buffer API (social media scheduling)
- Instagram Graph API
- Cal.com webhooks
- Git + CI/CD

---

## Collaboration Patterns

### Pattern 1: Content Pipeline
```
Manus: researches → writes 30 content ideas (JSON)
        ↓ tasks/content-batch-YYYY-MM.md
Claude Code: imports into ContentTemplates → builds UI → pushes
        ↓ outputs/content-imported.md
Manus: reviews in app → adjusts strategy
```

### Pattern 2: Lead Funnel Optimization
```
Manus: analyzes conversion data → suggests new qualifying questions
        ↓ tasks/optimize-wedding-form.md
Claude Code: updates form fields + automation logic → pushes
        ↓ outputs/form-updated.md
Manus: monitors results → iterates
```

### Pattern 3: Campaign Launch
```
Manus: creates campaign plan (audience, messages, schedule)
        ↓ plans/campaign-spring-weddings.md
Claude Code: builds landing page + form + automation + tracking
        ↓ outputs/campaign-ready.md
Manus: activates campaign → monitors → reports
        ↓ outputs/campaign-report.md
```

### Pattern 4: Instagram Growth
```
Manus: identifies trending keywords + writes DM scripts
        ↓ tasks/ig-flow-update.md
Claude Code: updates Instagram flows in the system
        ↓ outputs/ig-flows-updated.md
Manus: monitors engagement → suggests optimizations
```

---

## Weekly Rhythm

| Day | Manus | Claude Code |
|-----|-------|-------------|
| **Sun** | Weekly review + new content ideas | Process tasks from Manus |
| **Mon** | Research competitors | Build requested features |
| **Tue** | Write captions & hooks | Implement automations |
| **Wed** | Analyze Instagram performance | Fix bugs, optimize |
| **Thu** | Plan next week's content | Deploy updates |
| **Fri** | Campaign reports → STATUS.md | System health check |

---

## Escalation
If either agent is **blocked**, write to:
`tasks/URGENT-{date}-{issue}.md` with Priority: high

The other agent should check for URGENT files on every sync.
