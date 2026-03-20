# Marketing Workspace for Claude Code

A curated set of Claude Code skills for marketing team members working with Google Analytics, SEO, campaigns, content, and reporting.

## Why This Exists

Marketing staff using Claude Code need opinionated, well-structured guidance — not generic API access. This workspace provides skills that:

- Work with our mcp-axiomatic GA4 connector (not the official Google Analytics MCP server)
- Enforce computational accuracy (LLMs must use Python for all math, never mental arithmetic)
- Compose together through a shared product marketing context document
- Guide non-technical marketing users through professional analytics workflows

## Skills

| Skill | Lines | Purpose |
|-------|-------|---------|
| [google-analytics](.claude/skills/google-analytics/SKILL.md) | 385 | Query GA4 data, build reports, audit tracking, UTM standards, event tracking |
| [seo](.claude/skills/seo/SKILL.md) | 245 | Traditional SEO audit + AI search (GEO) optimization |
| [campaign-management](.claude/skills/campaign-management/SKILL.md) | 290 | Paid ads, email sequences, product launches — full campaign lifecycle |
| [content-copywriting](.claude/skills/content-copywriting/SKILL.md) | 223 | Write, edit, and improve marketing copy and content |
| [reporting](.claude/skills/reporting/SKILL.md) | 217 | Weekly, monthly, and quarterly marketing performance reports |
| [product-marketing-context](.claude/skills/product-marketing-context/SKILL.md) | 126 | Foundational positioning and audience document — run this first |

## Architecture

```
~/marketing/
├── .agents/                              # Product marketing context (created on first use)
├── .claude/
│   ├── CLAUDE.md                         # Workspace orientation for new users
│   └── skills/
│       ├── google-analytics/
│       │   ├── SKILL.md                  # Main skill
│       │   ├── references/
│       │   │   ├── event-library.md      # 130+ events by business type
│       │   │   └── ga4-configuration.md  # Setup, GTM, custom dimensions, Ads
│       │   └── sources/
│       │       └── README.md             # Attribution to upstream sources
│       ├── seo/SKILL.md
│       ├── campaign-management/SKILL.md
│       ├── content-copywriting/SKILL.md
│       ├── reporting/SKILL.md
│       └── product-marketing-context/SKILL.md
└── README.md                             # This file
```

### How Skills Compose

All skills check for `.agents/product-marketing-context.md` before asking questions. This means a marketing user sets up their product context once, and every subsequent skill already knows the audience, voice, positioning, and goals.

Cross-references between skills:
- **google-analytics** is referenced by reporting (data source) and campaign-management (UTM standards)
- **seo** references google-analytics (organic traffic measurement) and content-copywriting (creating optimized content)
- **campaign-management** references google-analytics (attribution), content-copywriting (ad copy), and reporting (performance reports)
- **reporting** references all data-producing skills

The no-mental-math rule lives in google-analytics (primary) and reporting (reinforced), since those are the two skills that produce numbers.

## Sources

Each skill is a consolidated superset of the best available open-source skill files, cursor rules, and agent prompts. The goal was to combine the strongest elements while eliminating duplication, confusion, and common mistakes.

### google-analytics

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) | Analysis workflows (performance overview, traffic sources, pages, campaigns, funnels) | Python pip-install setup (irrelevant — we use MCP), generic "ask me" prompts |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Event naming conventions, UTM standards, debugging/validation, GA4 configuration, event library, GA4 implementation reference | Tool-specific registry (Mixpanel, Amplitude, etc.), duplicate event lists across skill and references |
| [fujii-yuji GA4 cursor rules](https://gist.github.com/fujii-yuji/bcbfc1b88b4468538335d2c11101e0c3) | No-mental-math rule (elevated to #1 rule), verification pattern, boundary between calculation and interpretation | Japanese-only examples (translated), verbose repetition of the same rule |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | Attribution model comparison table, funnel analysis methodology | Static JSON-only workflow (we have live MCP access), Python CLI scripts |

**Key design decisions:**
- The fujii-yuji insight that LLMs fail at basic arithmetic was promoted from a cursor rule footnote to the most prominent rule in the skill. This is the single most impactful quality improvement.
- GA4 metric definitions (bounceRate vs engagementRate, property ID vs measurement ID) were added to a "Common Mistakes" table because these cause real confusion.
- UTMs on internal links called out explicitly — this is the most common tracking mistake marketing teams make.

### seo

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (seo-audit) | Priority-ordered audit framework, E-E-A-T assessment, site-type-specific issues, web_fetch limitation warning | Generic output format (replaced with structured table) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (ai-seo) | Princeton GEO research data, platform comparison table, AI bot access checks, optimization strategy | Monitoring tool recommendations (too likely to become outdated) |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | Quality gates (HowTo deprecated Sept 2023, FAQ restricted Aug 2023) | 13 sub-skill architecture (over-engineered for our use case), SEO Health Score formula |
| [zubair-trabzada/geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude) | Citability scoring (134-167 word optimal passages), brand mention correlation (3x stronger than backlinks) | Prospect/proposal management, PDF generation, 5 parallel subagents |
| [199-biotechnologies/claude-skill-seo-geo-optimizer](https://github.com/199-biotechnologies/claude-skill-seo-geo-optimizer) | Freshness data (content < 30 days = 3.2x citations), stats boost (41% improvement) | IndexNow integration, platform config profiles |
| [Bhanunamikaze/Agentic-SEO-Skill](https://github.com/Bhanunamikaze/Agentic-SEO-Skill) | Resilience philosophy (never block on tool failure) | 33 evidence-collector scripts, GitHub SEO auditing |
| [travisjneuman/.claude](https://github.com/travisjneuman/.claude) | Core Web Vitals 2025 targets (LCP <2.5s, INP <200ms, CLS <0.1) | Lighthouse-specific workflow |

**Key design decisions:**
- Traditional SEO and AI search (GEO) merged into one skill. They are one search strategy, not two. Separating them creates confusion about priorities.
- Schema deprecation dates included inline (HowTo Sept 2023, FAQ Aug 2023) because agents confidently recommend deprecated features without this context.
- Content prioritization scoring formula included (Customer Impact 40%, Content-Market Fit 30%, Search Potential 20%, Resources 10%) to prevent "optimize everything" paralysis.

### campaign-management

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (paid-ads) | Platform selection guide, campaign structure, ad copy frameworks, retargeting tiers, optimization playbook, common mistakes | Tool integration registry |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (email-sequence) | Core principles, sequence types, email structure, subject line rules, timing | ESP-specific tool integrations |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (launch-strategy) | Launch tiers, ORB framework, pre-launch checklist | Product Hunt-specific tactics, case studies |
| [zubair-trabzada/ai-marketing-claude](https://github.com/zubair-trabzada/ai-marketing-claude) | Platform-specific character limits, 10 ad copy angle templates, retargeting budget percentages | Full orchestrator architecture, PDF generation |
| [itallstartedwithaidea/google-ads-skills](https://github.com/itallstartedwithaidea/google-ads-skills) | GAQL query patterns, anomaly detection thresholds | Rate limit specifics (too implementation-specific) |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) (demand-acquisition) | Channel selection matrix, budget allocation table, attribution model recommendations | Series A specific budget example, MQL-to-SQL SLA |

**Key design decisions:**
- Paid ads, email sequences, and launch strategy consolidated into one skill. Marketing teams think in campaigns, not channel silos. Having three separate skills forces the user to know which to invoke.
- Attribution honesty rules added: "Platform attribution is always inflated", "Compare platform data to GA4", "Look at blended CAC". Most ad skills uncritically report platform numbers.
- Bid strategy progression (manual → data gathering → automated) included because premature automation is the most expensive mistake in paid ads.

### content-copywriting

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (copywriting) | Core principles, writing style rules, page structure framework, CTA copy rules, page-specific guidance | Voice/tone section (lives in product-marketing-context instead) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (copy-editing) | Seven sweeps framework, common copy problems | "Working with Copy Sweeps" iterative process (too procedural) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (content-strategy) | Searchable vs shareable framework, content types, prioritization scoring | Content pillar deep-dive (too prescriptive for a general skill) |
| [timescale/marketing-skills](https://github.com/timescale/marketing-skills) (brand-voice-writer) | AI writing anti-patterns table (negative seesaws, forced triples, vocabulary clustering, em dash overuse, Hallmark endings) | Voice profile system, team member style matching |
| [SpillwaveSolutions/running-marketing-campaigns-agent-skill](https://github.com/SpillwaveSolutions/running-marketing-campaigns-agent-skill) | Content calendar planning principles | 10-domain loading order, campaign validation checklist (lives in campaign-management) |

**Key design decisions:**
- Copywriting, copy editing, and content strategy merged into one skill. A marketing user asking "write me a landing page" shouldn't need to know whether that's a copywriting, editing, or strategy task.
- The AI anti-patterns table from Timescale's brand voice writer is critical. Without it, every skill produces text with obvious AI tells (forced triples, "leveraging" everything, em dash abuse).
- The seven editing sweeps retained from coreyhaines31 — this is the most structured editing methodology found across all sources and prevents "looks good to me" rubber-stamping.

### reporting

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [zubair-trabzada/ai-marketing-claude](https://github.com/zubair-trabzada/ai-marketing-claude) (market-report) | Marketing scorecard with 6 weighted dimensions, scoring rubrics | PDF generation, JSON data structures |
| [athina-ai/goose-skills](https://github.com/athina-ai/goose-skills) (pipeline-review) | Pipeline analysis dimensions, executive summary format | CRM-specific field mapping, cadence guide |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | Revenue impact estimation framework, channel benchmarks | Demand-gen-specific KPI tables |
| fujii-yuji (via google-analytics) | No-mental-math rule (reinforced here) | Already covered in google-analytics |

**Key design decisions:**
- Three report templates (weekly, monthly, QBR) at different detail levels for different audiences. Most reporting skills produce one format and hope it works for everyone.
- "Honest attribution rules" section added: executives lose trust when marketing reports inflate numbers. Being transparent about platform attribution discrepancies builds credibility.
- Data visualization principles included because bad charts are worse than no charts.
- Revenue impact estimation requires showing the formula and assumptions — never just a number.

### product-marketing-context

| Source | What we took | What we left out |
|--------|-------------|-----------------|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (product-marketing-context) | 12-section framework, auto-draft workflow, verbatim-customer-language emphasis | `.claude/` path (migrated to `.agents/` per current convention) |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) (marketing-strategy-pmm) | ICP definition workflow, April Dunford positioning methodology | Battlecard templates, international expansion (too specialized) |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (marketing-psychology) | Switching dynamics (JTBD Four Forces) | 60+ mental models (valuable reference but too large for a context-building skill) |

**Key design decisions:**
- This skill creates the document that all other skills consume. It must be run first but only once.
- Streamlined to 126 lines — the original sources were much longer but most of the length was in examples and explanations that don't need to live in the skill file itself.
- JTBD Four Forces (Push/Pull/Habit/Anxiety) retained because it's the most actionable framework for understanding why customers switch. The 60+ mental models from marketing-psychology were omitted — they're valuable as a reference but would make this foundation-building skill overwhelming.

## What Was Intentionally Excluded

| Excluded element | Reason |
|-----------------|--------|
| Parallel subagent architectures | Over-engineered for a marketing user's needs; adds complexity without proportional value |
| PDF report generation | Implementation-specific; the skill should produce good content, the format is secondary |
| Tool-specific integrations (Mixpanel, Amplitude, Segment, etc.) | We use mcp-axiomatic for GA4; other tools can be added as MCP connectors when needed |
| Scoring formulas (SEO Health Score, CORE-EEAT 80-item benchmark, etc.) | These create false precision; a prioritized issue list is more actionable than a score |
| 60+ marketing psychology mental models | Valuable as reference material but too large and unfocused for task-oriented skills |
| Product Hunt launch playbook | Too specific for a general launch strategy section |
| Prospect/proposal management | Sales function, not marketing workspace scope |
| Platform-specific API rate limits | Implementation detail that belongs in MCP server config, not skill files |

## Related Projects

- **[mcp-axiomatic](../mcp-axiomatic/)** — The MCP server framework providing GA4 API access (Analytics v3, Admin, Data, Hub, Reporting APIs)
- **[c1-mcp-research](../c1-mcp-research/)** — Research and architecture docs for MCP connector infrastructure, including GA4 authentication
