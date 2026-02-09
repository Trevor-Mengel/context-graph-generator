# Context Graph Generator - Prompt Sequence Guide

Welcome! These 7 prompts form a guided sequence for populating your context graph after the scaffolding scripts have generated the skeleton structure. Each prompt is self-contained but builds on the previous ones.

## What Are These Prompts?

These are detailed instructions designed to be fed into Claude Code, Cursor, or other AI coding agents. Each prompt guides the AI to:
- **Scan** your actual codebase
- **Extract** relevant information (types, schemas, patterns, workflows)
- **Document** findings in structured context files
- **Cross-link** between related files
- **Verify** that generated content matches your actual code

The result is a comprehensive context graph that acts as a living knowledge base for your project—reducing onboarding time, improving code consistency, and enabling better AI-assisted development.

## Recommended Sequence

The prompts are numbered for a reason. This order builds knowledge progressively:

### 1. **Foundation** (`01-foundation.md`)
Generates the root instruction file and system-wide architecture docs.
- Creates `AGENTS.md` (the master reference)
- Creates system overview and data model documentation
- Should run **first** and **only once**

### 2. **Domains** (`02-domains.md`)
Populates domain-specific context files for each business domain.
- Processes each domain skeleton from the scaffold
- Extracts entity definitions, business rules, status lifecycles
- Should run **after foundation is complete**
- Can run **per-domain** for incremental updates

### 3. **Architecture** (`03-architecture.md`)
Documents architectural concerns: security, multitenancy, integrations.
- Populates cross-cutting concern files
- Documents all third-party integrations
- Should run **after domains** (builds on domain understanding)

### 4. **Patterns** (`04-patterns.md`)
Identifies and documents recurring code patterns.
- Scans for authentication, authorization, GraphQL, state management patterns
- Documents anti-patterns and corrections
- Should run **after architecture** (understands the full system)

### 5. **Workflows** (`05-workflows.md`)
Documents development and deployment workflows.
- Local development setup
- Feature development, testing, and deployment processes
- CI/CD pipeline details
- Should run **after patterns** (understands the development environment)

### 6. **Review** (`06-review.md`)
Final verification and cross-linking pass.
- Checks for completeness and consistency
- Verifies file paths and references
- Generates first changelog entry
- Should run **last** to ensure everything is connected

## How to Use These Prompts

### With Claude Code
```bash
# Open your project in Claude Code
# Copy the full prompt text from one of these files
# Paste into the chat as a new message
# Claude will execute the instructions and generate/update files
```

### With Cursor
```bash
# In Cursor, open a new chat
# Copy the full prompt text
# Paste and hit Enter
# Cursor will process and create/modify files
```

### With Other AI Agents
- Copy the entire prompt text into your agent's chat
- Ensure the agent has file system access to your project
- Let the agent work through the checklist systematically

## Prerequisites & Setup

Before running any prompt, ensure:

1. **File System Access**
   - Your AI tool must have read/write access to your project directory
   - Run from your project root: `pwd` should show your project path

2. **Context Available**
   - Have MCP (Model Context Protocol) tools available if needed
   - For local development: ensure you can read all source files
   - For databases: have credentials if the AI needs to inspect schemas

3. **Scaffolding Complete**
   - Run the scaffolding script first: `npx context-graph-generator scaffold`
   - This creates the skeleton directory structure
   - Verify `context/` directory exists with subdirectories

4. **Tech Stack Documentation**
   - Have your `package.json` available
   - Database schema available (Prisma, Supabase, or SQL files)
   - Any architecture diagrams or documentation

## Tips for Best Results

### General Tips
- **Run one prompt at a time.** Don't skip steps; each builds on the previous.
- **Run from your project root.** All file paths in prompts are relative to project root.
- **Check the output.** Review generated files immediately after each prompt completes.
- **Iterate quickly.** If something's incomplete, re-run the prompt with clarifications.
- **Use MCP tools if available.** They help the AI access more information accurately.

### Before Each Prompt
- Read the "Before you start" section carefully
- Ensure all prerequisites are met
- Have your codebase open/accessible

### After Each Prompt
- Review the "Verification" section
- Check that generated files look correct
- Look for TODOs or placeholders that need manual work
- Fix any broken links or incorrect paths
- Commit the changes: `git add context/ && git commit -m "Update context graph"`

### Making Edits
If a prompt generates incomplete or incorrect information:
1. Re-run the prompt with more specific instructions
2. Or manually edit the file and continue with the next prompt
3. The system is designed to be resilient to incremental improvements

## Context Graph Structure

The prompts populate this structure:

```
context/
├── AGENTS.md                          # Root file (01-foundation creates)
├── WEEKLY_REVIEW.md                   # Review checklist (06-review populates)
├── architecture/
│   ├── SYSTEM_OVERVIEW.md            # Full architecture (01-foundation)
│   ├── DATA_MODEL.md                 # Database schema (01-foundation)
│   ├── SECURITY.md                   # Security patterns (03-architecture)
│   ├── MULTITENANCY.md               # Multitenancy design (03-architecture)
│   ├── INFRASTRUCTURE.md             # Deployment & infra (03-architecture)
│   ├── INTEGRATIONS_OVERVIEW.md      # Third-party integrations (03-architecture)
│   └── integrations/                 # Per-integration docs (03-architecture)
│       ├── STRIPE.md
│       ├── TWILIO.md
│       └── [others].md
├── domains/
│   ├── auth/
│   │   └── CONTEXT.md                # Domain docs (02-domains)
│   ├── billing/
│   │   └── CONTEXT.md
│   └── [more-domains]/
│       └── CONTEXT.md
├── patterns/
│   ├── AUTHENTICATION.md             # Pattern documentation (04-patterns)
│   ├── AUTHORIZATION.md
│   ├── GRAPHQL.md
│   ├── STATE_MANAGEMENT.md
│   ├── COMPONENTS.md
│   ├── FORMS.md
│   ├── NAVIGATION.md
│   ├── ERROR_HANDLING.md
│   ├── CACHING.md
│   ├── REALTIME.md
│   ├── TESTING.md
│   └── STATUS_LIFECYCLE.md
└── workflows/
    ├── LOCAL_DEVELOPMENT.md          # Workflow docs (05-workflows)
    ├── FEATURE_DEVELOPMENT.md
    ├── TESTING.md
    ├── CODE_REVIEW.md
    ├── DEPLOYMENT.md
    ├── DATABASE_MIGRATIONS.md
    ├── BUG_FIXING.md
    └── TROUBLESHOOTING.md
```

## Common Patterns in These Prompts

All prompts use these conventions:

### "Before you start" sections
List what the AI needs access to. Make sure you can provide these before starting.

### "Verification" sections
A checklist at the end to verify the work is complete and correct.

### File paths and examples
All paths are shown as they should appear in the generated files. Use as reference.

### Code snippets
The prompts ask the AI to extract actual code examples from your codebase. This ensures accuracy.

## Troubleshooting

### "File not found" errors
- Check your project structure matches expected layout
- Re-run the scaffold script: `npx context-graph-generator scaffold`
- Make sure you're running prompts from the project root

### Incomplete or generic output
- The prompt may need more codebase context
- Try re-running the same prompt with clarifications
- Or manually edit the sections the AI missed

### Cross-reference issues
- Re-run prompt 06-review to verify links
- Check that file paths exist before linking

### Out of date context
- Context files are meant to be updated as code changes
- Re-run individual prompts to refresh specific sections
- Maintain `context/WEEKLY_REVIEW.md` to track drift

## Next Steps

1. **Ready to start?** Run prompt `01-foundation.md` first
2. **Already have foundation?** Jump to the next incomplete step
3. **Need help?** Review the "Before you start" section of each prompt
4. **Want to customize?** Modify prompts as needed—they're templates, not strict rules

Good luck building your context graph!
