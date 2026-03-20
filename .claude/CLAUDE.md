# Marketing Workspace

This workspace is configured for marketing team members using Claude Code with analytics and campaign tools.

## Getting Started

**First time?** Start by creating your product marketing context:
> "Help me set up our product marketing context"

This creates `.agents/product-marketing-context.md` — a foundational document that all other skills reference for positioning, audience, and voice. You only do this once; update it as things change.

## Available Skills

| Skill | When to use |
|-------|-------------|
| **google-analytics** | Pull analytics data, build reports, audit tracking, understand traffic and conversions |
| **seo** | Audit search rankings, optimize pages, improve AI search visibility |
| **campaign-management** | Plan and optimize paid ads, email sequences, product launches |
| **content-copywriting** | Write or improve marketing copy, blog posts, landing pages, emails |
| **reporting** | Build weekly/monthly/quarterly performance reports |
| **product-marketing-context** | Set up or update foundational positioning and audience context |

## MCP Tools Available

This workspace connects to Google Analytics via MCP (mcp-axiomatic). You can:
- Query GA4 properties for traffic, engagement, and conversion data
- Pull reports by dimension (source, page, campaign, device, geography)
- Access real-time and historical data

## Important Rules

### All calculations must use code
LLMs are unreliable at math — even simple percentages. Every number in a report must come from Python code, not mental math. This is non-negotiable. See the google-analytics skill for details.

### UTM hygiene
- Always lowercase
- Use underscores for spaces
- Never put UTMs on internal links
- Document all UTMs in a shared system

### Privacy
- Never include PII in analytics events or reports
- Respect consent requirements (EU/UK/CA)
- GA4 data retention should be set to 14 months

## Workflow Tips

- **"How is the site doing?"** → Triggers google-analytics skill for a performance overview
- **"Check our SEO"** → Triggers seo skill for an audit
- **"Write a landing page for X"** → Triggers content-copywriting skill
- **"Build this month's report"** → Triggers reporting skill
- **"Launch campaign for X"** → Triggers campaign-management skill
