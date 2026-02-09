# context-graph-generator

## Give Your AI Coding Agents a Map of Your Codebase

context-graph-generator is a CLI tool + prompt library that generates an AI-agent-friendly "context graph" for TypeScript, React, Node.js, GraphQL, and Supabase codebases. It creates structured documentation that helps Claude Code, Cursor, Windsurf, and other AI coding agents understand and work autonomously on your project with exceptional depth and accuracy.

By providing your AI agents with a comprehensive map of your codebase—from architecture to business domains to development workflows—you eliminate the context-hunting that leads to bugs, missed patterns, and convention violations.

## What is a Context Graph?

### The Problem

When AI coding agents work on your codebase without proper context, they:

- Miss business logic constraints that should influence their decisions
- Violate established architectural patterns and conventions
- Don't understand cross-cutting concerns (permissions, validation, error handling)
- Make assumptions that contradict your domain knowledge
- Can't reason about interconnected systems and dependencies
- Require constant hand-holding and corrections

### The Solution

A **context graph** is a structured documentation layer that lives in your repository. It's a system of interconnected markdown files that captures:

- Your system architecture and design patterns
- Business domains, entities, and their lifecycles
- Reusable code patterns with examples
- Development workflows and decision-making frameworks
- Integration points and external dependencies
- Status quo conventions and anti-patterns to avoid

Think of it as a comprehensive briefing document that an AI agent reads before starting work. Instead of having to explore your entire codebase, the agent has a high-level map that explains the landscape, the rules, and the reasoning.

### How It Works

The context graph uses a two-phase approach:

1. **Scaffold (Scripts)** - Our Node.js CLI analyzes your codebase, detects your tech stack, identifies domains, and generates skeleton files
2. **Populate (AI Prompts)** - Sequenced prompts you feed to Claude Code or Cursor to deeply populate each file with business logic, code examples, and cross-references

The result: AI agents that understand your project as well as a senior engineer who's been with the company for a year.

### Compatibility

The context graph works with:

- **Claude Code** - Automatically reads `CLAUDE.md` → `@AGENTS.md`
- **Cursor** - Automatically reads `.cursorrules` → `@AGENTS.md`
- **Windsurf** - Reads `AGENTS.md` directly
- **Other AI Agents** - Read `AGENTS.md` directly
- **Standalone Claude** - Paste AGENTS.md content into any conversation

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/context-graph-generator.git
cd context-graph-generator

# Install dependencies
npm install

# Make the CLI available globally (optional)
npm link
```

### Generate Context Graph for Your Project

```bash
# Initialize context graph scaffolding in your project
npx context-graph-generator init --dir /path/to/your/project

# Scan your codebase and generate skeleton files
npx context-graph-generator scan --dir /path/to/your/project

# Verify the context graph structure
npx context-graph-generator verify --dir /path/to/your/project

# Populate with AI (follow the sequential prompts in prompts/ directory)
# Use Claude Code or Cursor to work through prompts/01-foundation.md through 06-review.md
```

## How It Works

### Phase 1: Scaffold (Automatic)

The CLI tool performs code analysis:

```bash
npx context-graph-generator scan --dir /path/to/your/project
```

This command:

- Detects your tech stack (React, Next.js, Node.js, GraphQL, Supabase, etc.)
- Scans your source code to identify business domains and entities
- Creates skeleton context files with prompts and placeholders
- Generates the directory structure with helpful comments
- Produces entry points for Claude Code and Cursor

**Time to complete**: 2-5 minutes

### Phase 2: Populate (AI-Assisted)

The sequential prompts in the `prompts/` directory guide you through populating each context file. You feed these to Claude Code or Cursor:

1. **Foundation** (`01-foundation.md`) - Create AGENTS.md, system overview, data model
2. **Domains** (`02-domains.md`) - Populate business domain contexts
3. **Architecture** (`03-architecture.md`) - Document system design and patterns
4. **Patterns** (`04-patterns.md`) - Define reusable code patterns
5. **Workflows** (`05-workflows.md`) - Document development processes
6. **Review** (`06-review.md`) - Verify completeness and cross-linking

**Time to complete**: 30-60 minutes per prompt (depends on codebase size)

## What Gets Generated

After running `init` and `scan`, your project structure looks like this:

```
your-project/
├── README.md                          # Your project's existing README
├── AGENTS.md                          # Root AI agent instructions (generated)
├── CLAUDE.md                          # Claude Code entry point → @AGENTS.md (generated)
├── .cursorrules                       # Cursor entry point → @AGENTS.md (generated)
├── src/                               # Your source code
└── context/                           # New context graph directory
    ├── architecture/                  # System design documentation
    │   ├── DATA_MODEL.md
    │   ├── API_DESIGN.md
    │   ├── INTEGRATIONS.md
    │   └── INFRASTRUCTURE.md
    ├── domains/                       # Business domain contexts
    │   ├── users/
    │   │   └── CONTEXT.md
    │   ├── payments/
    │   │   └── CONTEXT.md
    │   └── _DOMAIN_TEMPLATE.md
    ├── patterns/                      # Reusable code patterns
    │   ├── FORMS.md
    │   ├── API_HANDLERS.md
    │   ├── DATABASE_QUERIES.md
    │   └── ERROR_HANDLING.md
    ├── workflows/                     # Development processes
    │   ├── FEATURE_DEVELOPMENT.md
    │   ├── BUG_FIXING.md
    │   └── REFACTORING.md
    ├── changelog/                     # Change tracking
    │   ├── 2024-01.md
    │   └── 2024-02.md
    ├── templates/                     # Templates for new files
    │   ├── component.template.tsx
    │   ├── api-handler.template.ts
    │   └── database-query.template.ts
    ├── WEEKLY_REVIEW.md               # Maintenance checklist
    └── README.md                      # Navigation guide
```

## Context File Types

### Domains

**Location**: `context/domains/{domain}/CONTEXT.md`

**Purpose**: Define business entities, rules, and their codebase locations.

**What to document**:

- What is this domain? (business explanation)
- Key entities and their properties
- Status lifecycles and state transitions
- Business rules and constraints
- Permission and access patterns
- Code locations (components, services, database tables)
- Related domains and dependencies

**Example**: `context/domains/users/CONTEXT.md`

```markdown
# Users Domain

## What is this domain?
The Users domain manages authentication, profiles, and access control. It's the foundation for all other domains.

## Key Entities
- User Account (authentication, profile data)
- User Profile (preferences, public information)
- Role & Permissions (access control)

## User Lifecycle
1. Signup → pending_email_verification
2. Email verified → active
3. Suspended → inactive
4. Deleted → deleted

## Business Rules
- Users must verify email within 24 hours
- Passwords must be at least 12 characters
- Profile visibility is user-controlled

## Code Locations
- Auth service: src/services/auth.ts
- User API: src/api/users/
- Database: schema.sql (users table)
```

### Architecture

**Location**: `context/architecture/{aspect}.md`

**Purpose**: Document system design, infrastructure, and high-level patterns.

**What to document**:

- **DATA_MODEL.md** - Database schema, relationships, data flow
- **API_DESIGN.md** - API structure, conventions, error handling
- **INTEGRATIONS.md** - Third-party services, webhooks, external APIs
- **INFRASTRUCTURE.md** - Deployment, environments, CI/CD

### Patterns

**Location**: `context/patterns/{pattern_name}.md`

**Purpose**: Document reusable code patterns with examples and anti-patterns.

**What to document**:

- Pattern name and purpose
- When to use this pattern
- Step-by-step implementation guide
- Code example (actual code from your codebase)
- Anti-patterns (what not to do)
- Related patterns

**Example**: `context/patterns/FORMS.md`

```markdown
# Forms Pattern

## When to use
Any user input collection (signup, settings, search filters, etc.)

## Implementation Steps
1. Create form component with React Hook Form
2. Add client-side validation with Zod
3. Submit to API endpoint
4. Handle errors with error toast

## Code Example
[actual form from your codebase]

## Anti-Patterns
- Don't use uncontrolled components
- Don't validate only on the backend
- Don't store form state in Redux
```

### Workflows

**Location**: `context/workflows/{workflow_name}.md`

**Purpose**: Document development processes and decision frameworks.

**What to document**:

- Workflow name and purpose
- Prerequisites and setup
- Step-by-step process
- Common decision points
- Where to get help
- Related workflows

**Example**: `context/workflows/FEATURE_DEVELOPMENT.md`

```markdown
# Feature Development Workflow

## Process
1. Start with acceptance criteria
2. Update DATA_MODEL.md if schema changes needed
3. Implement backend (API + database)
4. Implement frontend
5. Add tests
6. Manual testing
7. Submit PR

## Common Decisions
- Q: New database table needed?
  A: Update DATA_MODEL.md, run migrations, update types

- Q: External API call needed?
  A: Add to INTEGRATIONS.md, configure in environment
```

## CLI Reference

### context-graph-generator init

Initialize context graph scaffolding in a project.

```bash
npx context-graph-generator init --dir /path/to/your/project [--force]
```

**Options**:

| Option | Description |
|--------|-------------|
| `--dir` | Path to your project directory (required) |
| `--force` | Overwrite existing context files |

**Output**:

- Creates `context/` directory structure
- Generates `AGENTS.md` template
- Generates `CLAUDE.md` and `.cursorrules` entry points

### context-graph-generator scan

Analyze your codebase and generate skeleton context files.

```bash
npx context-graph-generator scan --dir /path/to/your/project [--src] [--supabase] [--dry-run]
```

**Options**:

| Option | Description |
|--------|-------------|
| `--dir` | Path to your project directory (required) |
| `--src` | Source directory to scan (default: `src/`) |
| `--supabase` | Analyze Supabase schema (requires `supabase/migrations/`) |
| `--dry-run` | Show what would be generated without creating files |

**Output**:

- Detects tech stack
- Identifies business domains
- Generates skeleton context files with prompts
- Lists recommended next steps

### context-graph-generator verify

Verify context graph completeness and structure.

```bash
npx context-graph-generator verify --dir /path/to/your/project
```

**Options**:

| Option | Description |
|--------|-------------|
| `--dir` | Path to your project directory (required) |

**Checks**:

- Verifies required files exist
- Validates markdown structure
- Checks for broken cross-references
- Reports missing domains or patterns
- Validates AGENTS.md completeness

## AI Prompts

The `prompts/` directory contains 6 sequential prompts designed to be fed to Claude Code or Cursor. Each prompt builds on the previous one.

### 01-foundation.md

**Goal**: Create foundational context files

**Creates**:
- `AGENTS.md` - Root AI instructions and project overview
- `context/architecture/DATA_MODEL.md` - Database schema
- `context/README.md` - Navigation guide

**Prerequisite**: Run `context-graph-generator scan`

**Process**:
1. Copy prompt into Claude Code
2. Let Claude generate files
3. Review and commit
4. Move to next prompt

### 02-domains.md

**Goal**: Populate business domain contexts

**Creates**:
- `context/domains/{domain}/CONTEXT.md` for each identified domain
- Domain diagrams and relationships

**Prerequisite**: Complete `01-foundation.md`

### 03-architecture.md

**Goal**: Document system architecture and patterns

**Creates**:
- `context/architecture/API_DESIGN.md`
- `context/architecture/INTEGRATIONS.md`
- `context/architecture/INFRASTRUCTURE.md`

**Prerequisite**: Complete `02-domains.md`

### 04-patterns.md

**Goal**: Document reusable code patterns

**Creates**:
- `context/patterns/FORMS.md`
- `context/patterns/API_HANDLERS.md`
- `context/patterns/DATABASE_QUERIES.md`
- `context/patterns/ERROR_HANDLING.md`

**Prerequisite**: Complete `03-architecture.md`

### 05-workflows.md

**Goal**: Document development workflows

**Creates**:
- `context/workflows/FEATURE_DEVELOPMENT.md`
- `context/workflows/BUG_FIXING.md`
- `context/workflows/REFACTORING.md`

**Prerequisite**: Complete `04-patterns.md`

### 06-review.md

**Goal**: Verify completeness and add cross-linking

**Tasks**:
- Check all files for completeness
- Add cross-references between files
- Update AGENTS.md with final navigation map
- Review for clarity and accuracy
- Plan maintenance schedule

## Supported Tech Stack

context-graph-generator is built to work with modern full-stack JavaScript/TypeScript projects:

### Languages & Runtime

- TypeScript / JavaScript
- Node.js / Deno

### Frontend Frameworks

- React / React Native
- Next.js / Remix / SvelteKit
- Vue / Nuxt

### Backend & APIs

- Node.js / Express / Fastify
- GraphQL (Apollo, Yoga, Pothos)
- REST APIs
- tRPC / Zod validation

### Databases

- PostgreSQL / MySQL
- MongoDB
- Supabase (PostgreSQL + Auth + Storage)
- Firebase / Firestore
- Prisma ORM / Drizzle

### Data & State Management

- React Query / SWR
- Redux / Zustand / Jotai
- Tanstack Query

### Styling

- Tailwind CSS
- CSS Modules
- Styled Components
- Emotion

### Testing

- Jest / Vitest
- React Testing Library
- Cypress / Playwright

## Tool Compatibility

### Claude Code

Claude Code automatically reads your `CLAUDE.md` file and follows its instructions. The file acts as the entry point:

```markdown
# Claude Code Instructions

Read and follow the guidelines in @AGENTS.md

The AGENTS.md file contains comprehensive project context that will help you make better decisions.
```

### Cursor

Cursor automatically reads your `.cursorrules` file:

```
You are an expert developer on this codebase.

Read and follow the guidelines in @AGENTS.md

The AGENTS.md file contains comprehensive project context.
```

### Windsurf

Windsurf and other agents read `AGENTS.md` directly. Place it in your project root.

### Standalone Claude

Paste the contents of `AGENTS.md` into the beginning of any conversation with Claude:

```
Paste AGENTS.md content here, then start your task...
```

## Maintenance

A context graph is living documentation. It needs regular updates to stay useful.

### Weekly Review

Run through `context/WEEKLY_REVIEW.md` every Friday (takes 10 minutes):

```markdown
# Weekly Context Review

## Checklist
- [ ] Any new features added? Update AGENTS.md
- [ ] Any new patterns discovered? Add to context/patterns/
- [ ] Any business logic changes? Update domain context
- [ ] Any infrastructure changes? Update architecture docs
- [ ] Run `context-graph-generator verify`
- [ ] Create changelog entry if needed
```

### Monthly Updates

- Update `context/changelog/{YYYY-MM}.md` with significant changes
- Audit domain definitions for accuracy
- Review patterns for relevance
- Update AGENTS.md with any architectural changes

### After Major Changes

After significant feature development, refactoring, or architecture changes:

1. Update relevant domain contexts
2. Add new patterns if created
3. Update architecture documents
4. Run `context-graph-generator verify`
5. Create changelog entry
6. Update AGENTS.md navigation

### Integration with Development

Make context updates part of your PR process:

- Feature PRs → update domain context + add changelog entry
- Refactoring PRs → update patterns + architecture docs
- Infrastructure PRs → update architecture/INFRASTRUCTURE.md
- Bug fixes → update domain context if business logic clarified

## FAQ

**Q: How long does it take to set up?**

A: About 30 minutes to run the CLI and initial prompts, plus 30-60 minutes to populate context files with AI assistance.

**Q: Will I need to update context files constantly?**

A: No. Weekly reviews take 10 minutes. You update files after major changes, not for every commit.

**Q: What if my codebase is very large?**

A: context-graph-generator scales to large codebases by organizing context into domains and patterns. Start with your most critical 2-3 domains and expand.

**Q: Can I use this with an existing codebase?**

A: Yes! context-graph-generator works with projects at any stage. The CLI analyzes your existing code and generates appropriate skeleton files.

**Q: What about private repositories?**

A: context-graph-generator is entirely local. No code is sent anywhere. You commit the context graph to your own repository.

**Q: How do I add new domains?**

A: Create a new directory in `context/domains/{domain}/` and add `CONTEXT.md`. The `_DOMAIN_TEMPLATE.md` file shows the structure.

**Q: Can multiple team members maintain the context graph?**

A: Yes. Treat context files like any other documentation—review in PRs, discuss changes, keep it accurate.

## Contributing

We welcome contributions! This is an open-source project and we're excited to have community involvement.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** and add tests if applicable
4. **Commit with clear messages**: `git commit -m "feat: add new CLI command"`
5. **Push to your fork**: `git push origin feature/your-feature`
6. **Open a pull request** with a description of your changes

### Areas We'd Love Help With

- New prompt templates for different tech stacks
- CLI improvements and new commands
- Better tech stack detection
- Documentation and examples
- Bug reports and fixes
- Integration with other AI agent tools

### Development Setup

```bash
git clone https://github.com/yourusername/context-graph-generator.git
cd context-graph-generator
npm install

# Run tests
npm test

# Build
npm run build

# Test locally
npm link
npx context-graph-generator --help
```

### Code Standards

- TypeScript for all new code
- Clear variable and function names
- Add tests for new features
- Update README for user-facing changes
- Follow existing code style

## License

MIT License - See LICENSE file for details.

---

## Getting Started Now

Ready to give your AI agents a context map?

```bash
git clone https://github.com/yourusername/context-graph-generator.git
cd context-graph-generator
npm install
npx context-graph-generator init --dir /path/to/your/project
npx context-graph-generator scan --dir /path/to/your/project
```

Then follow the sequential prompts in `prompts/01-foundation.md` using Claude Code or Cursor.

## Resources

- **GitHub**: [github.com/yourusername/context-graph-generator](https://github.com/yourusername/context-graph-generator)
- **Issues & Discussions**: [GitHub Issues](https://github.com/yourusername/context-graph-generator/issues)
- **Documentation**: [Full docs](./context/README.md)

---

Built with care for AI-assisted development. Questions? Open an issue on GitHub.
