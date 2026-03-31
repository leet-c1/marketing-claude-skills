const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const fs = require("fs");
const path = require("path");

const WORKSPACE_ROOT = path.resolve(__dirname, "..");

const CATALOG_NAME = "marketing-skills";
const CATALOG_VERSION = "1.0.0";
const CATALOG_DESCRIPTION =
  "Marketing workspace with GA4, SEO, campaigns, content, and reporting skills for Claude Code.";

const POST_INSTALL_MESSAGE =
  "Marketing skills installed. Recommended first step: say 'Help me set up our product marketing context'. " +
  "This walks you through creating .agents/product-marketing-context.md — a ~20 minute conversation that captures your product, target audience, ICP, brand voice, positioning, and competitive landscape. " +
  "Six of the seven skills (SEO, content-copywriting, campaign-management, google-analytics, reporting, and c1-request-access) read this file on startup so they already know your product and audience. " +
  "Without it the skills still work, but each one will ask you foundational questions (what do you sell, who's your audience, etc.) every time you use them.";

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/** Extract name + description from SKILL.md frontmatter */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val) fm[key] = val;
  }
  return fm;
}

function collectSkills() {
  const skillsDir = path.join(WORKSPACE_ROOT, ".claude", "skills");
  const skills = [];

  if (!fs.existsSync(skillsDir)) return skills;

  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, "SKILL.md");
    const content = readFileIfExists(skillFile);
    if (content) {
      const fm = parseFrontmatter(content);
      skills.push({
        name: entry.name,
        description: fm.description || "",
        content,
      });
    }
  }
  return skills;
}

/** Browse mode: returns manifest + skill summaries (no full content) */
function buildBrowseResponse(skills, claudeMd) {
  return {
    manifest: {
      name: CATALOG_NAME,
      version: CATALOG_VERSION,
      description: CATALOG_DESCRIPTION,
      install: {
        base_dir: ".",
        directories: [".claude/skills", ".agents"],
        conflict_strategy: "prompt_user",
      },
      post_install_message: POST_INSTALL_MESSAGE,
    },
    skills: skills.map((s) => ({ name: s.name, description: s.description })),
    has_claude_md: !!claudeMd,
  };
}

/** Install mode: returns manifest + full file objects with paths */
function buildInstallResponse(skills, claudeMd, skillName) {
  const files = [];

  if (claudeMd) {
    files.push({
      path: "CLAUDE.md",
      type: "project-config",
      merge_hint: "append_as_section",
      content: claudeMd,
    });
  }

  const targetSkills = skillName
    ? skills.filter((s) => s.name === skillName)
    : skills;

  for (const skill of targetSkills) {
    files.push({
      path: `.claude/skills/${skill.name}/SKILL.md`,
      type: "skill",
      content: skill.content,
    });
  }

  return {
    manifest: {
      name: CATALOG_NAME,
      version: CATALOG_VERSION,
      description: CATALOG_DESCRIPTION,
      install: {
        base_dir: ".",
        directories: [".claude/skills", ".agents"],
        conflict_strategy: "prompt_user",
      },
      post_install_message: POST_INSTALL_MESSAGE,
    },
    files,
  };
}

async function main() {
  const server = new McpServer({
    name: "marketing-skill-catalog",
    version: "1.0.0",
  });

  server.registerTool(
    "skill-catalog",
    {
      title: "Marketing Skill Catalog",
      description:
        'Browse and install marketing skills for Claude Code. Use action "browse" (default) to see what\'s available. Use action "install" to get full file contents with target paths, ready to write to disk. Trigger phrases: "set up marketing skills", "install marketing skills", "what marketing skills are available".',
      inputSchema: z.object({
        action: z
          .enum(["browse", "install"])
          .optional()
          .describe(
            'Action to perform. "browse" (default) returns skill summaries. "install" returns full file contents with paths ready to write.'
          ),
        skill_name: z
          .string()
          .optional()
          .describe(
            "Optional: target a specific skill by name (e.g. 'seo', 'google-analytics'). Applies to both browse and install."
          ),
      }),
    },
    async ({ action, skill_name }) => {
      const effectiveAction = action || "browse";
      const allSkills = collectSkills();
      const claudeMd = readFileIfExists(
        path.join(WORKSPACE_ROOT, ".claude", "CLAUDE.md")
      );

      // Validate skill_name if provided
      if (skill_name) {
        const match = allSkills.find((s) => s.name === skill_name);
        if (!match) {
          const available = allSkills.map((s) => s.name).join(", ");
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: `Skill "${skill_name}" not found.`,
                    available_skills: available,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      }

      let result;
      if (effectiveAction === "install") {
        result = buildInstallResponse(allSkills, claudeMd, skill_name);
      } else {
        result = buildBrowseResponse(allSkills, claudeMd);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
