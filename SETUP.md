# Setup Guide

## What You Need

1. **Claude Code** installed on your computer — your admin can help with this, or see https://docs.anthropic.com/en/docs/claude-code
2. **This folder on your computer** — your admin will set this up for you, or you can run this in a terminal:
   ```bash
   git clone https://github.com/leet-c1/marketing-claude-skills.git ~/marketing
   ```
3. **Google Analytics access** — your admin will connect Claude Code to your company's GA4 account. You don't need to do anything for this step.

4. **ConductorOne MCP server** — this connects Claude to ConductorOne so it can request access to external systems (Salesforce, GA4, etc.) on your behalf. Run this in a terminal:
   ```bash
   claude mcp add conductorone --transport http https://your-tenant.conductor.one/api/v1alpha/mcp
   ```
   Replace `your-tenant` with your company's ConductorOne tenant domain. Your admin can provide this. Claude will prompt you to authenticate when it first connects.

## Getting Started (5 minutes)

Once your admin confirms everything is set up:

1. Open a terminal and run:
   ```bash
   cd ~/marketing
   claude
   ```

2. Set up your product marketing context (~20 minutes, one-time only):
   > "Help me set up our product marketing context"

   Claude will walk you through describing your product, audience, and goals. This only happens once — after that, every skill already knows your context.

3. Start working! Just ask Claude what you need:
   - **"How is the site doing?"** — pulls your Google Analytics data and summarizes performance
   - **"Check our SEO"** — audits your search rankings and suggests improvements
   - **"Write a landing page for [product]"** — drafts marketing copy
   - **"Build this month's report"** — creates a performance report with real data
   - **"Plan a campaign for [launch]"** — designs ads, emails, and launch plan

## What's Included

| Skill | What it does |
|-------|-------------|
| google-analytics | Pull traffic and conversion data, audit tracking setup |
| seo | Audit search rankings, optimize for Google and AI search engines |
| campaign-management | Plan paid ads, email sequences, product launches |
| content-copywriting | Write and improve marketing copy, blog posts, landing pages |
| reporting | Build weekly, monthly, and quarterly performance reports |
| product-marketing-context | Set up your product and audience context (run this first) |
| c1-request-access | Request access to external systems (Salesforce, GA4, etc.) via ConductorOne |

## Things to Know

- **Claude uses Python for all math.** When you ask for a report, Claude will write and run code to compute percentages, growth rates, etc. This is intentional — it prevents calculation errors that AI can make when doing mental math.

- **UTM parameters** (the tracking tags in campaign URLs like `?utm_source=email`) must always be lowercase with underscores. Never add UTM parameters to links between pages on your own site — that breaks session tracking.

- **Your product context carries across sessions.** Once you set it up, you don't need to re-explain your product every time you start a new conversation.

## If Something Isn't Working

**Claude can't access Google Analytics:**
Send this message to your admin:
> "Claude Code needs the mcp-axiomatic Google Analytics connector configured. The GCP service account needs Viewer access to our GA4 property, and the MCP server needs to be added to Claude Code's settings."

**Claude can't request access to external tools:**
Make sure you've added the ConductorOne MCP server (step 4 above). If it's already added, check that your tenant domain is correct:
```bash
claude mcp list
```
If the server shows but connections fail, ask your admin to verify your ConductorOne account has the right permissions.

**Claude doesn't seem to know our product:**
Run "Help me set up our product marketing context" to create or update the context document.

**A skill doesn't trigger:**
You can describe what you want in plain language — you don't need to use exact phrases. Claude matches your request to the right skill based on what you're asking about.
