# Setup Guide

## Prerequisites

1. **Claude Code** installed — see https://docs.anthropic.com/en/docs/claude-code
2. **MCP access to Google Analytics** — your admin will configure mcp-axiomatic for your GA4 property

## Getting Started

1. Clone this repo:
   ```bash
   git clone <repo-url> ~/marketing
   cd ~/marketing
   ```

2. Start Claude Code:
   ```bash
   claude
   ```

3. Set up your product marketing context (one-time):
   > "Help me set up our product marketing context"

   This creates a foundational document that all skills reference. You only do this once.

4. Start working:
   - "How is the site doing?" — pulls GA4 analytics
   - "Check our SEO" — runs an SEO audit
   - "Write a landing page for [product]" — creates copy
   - "Build this month's report" — generates a performance report
   - "Plan a campaign for [launch]" — designs a full campaign

## What's Included

| Skill | What it does |
|-------|-------------|
| google-analytics | Query GA4 data, track events, build reports |
| seo | Audit search rankings and AI search visibility |
| campaign-management | Plan paid ads, email sequences, launches |
| content-copywriting | Write and edit marketing copy |
| reporting | Build weekly/monthly/quarterly reports |
| product-marketing-context | Set up positioning and audience context |

## MCP Configuration

Your GA4 access is provided through mcp-axiomatic. If you get authentication errors, ask your admin to:
1. Ensure your GCP service account has Viewer access to the GA4 property
2. Verify the mcp-axiomatic server is configured in your Claude Code settings

## Tips

- **All numbers come from code.** Claude will always use Python for calculations — this is by design, not a quirk.
- **UTMs must be lowercase** with underscores. Never put UTMs on internal links.
- **Run product-marketing-context first** if you haven't already — it saves you from repeating the same context across tasks.
