# Agent Instructions

> Root context file for AI agents working on this codebase.

## Overview

This is the root context file for AI agents working on this project. It provides orientation and links to detailed context files for each domain, architectural decision, code pattern, and development workflow.

## Project Summary

<!-- Replace with your project's description -->
[Your project] is a [type of application] that [core purpose]. It serves [target users] by [key value proposition].

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [e.g., React 18 + TypeScript + Vite] |
| Styling | [e.g., Tailwind CSS + shadcn/ui] |
| State | [e.g., Apollo Client + Zustand] |
| Backend | [e.g., Supabase (PostgreSQL + Auth + Realtime + Storage)] |
| API | [e.g., GraphQL via pg_graphql] |
| Edge Functions | [e.g., Deno (Supabase Edge Functions)] |

## Key Architectural Patterns

1. **[Pattern 1]**: Brief description
2. **[Pattern 2]**: Brief description
3. **[Pattern 3]**: Brief description
4. **[Pattern 4]**: Brief description
5. **[Pattern 5]**: Brief description

## Core Domains

### Business Entities
- **[Domain 1]** - Brief description
- **[Domain 2]** - Brief description
- **[Domain 3]** - Brief description

### Supporting Systems
- **[System 1]** - Brief description
- **[System 2]** - Brief description

## File Locations

```
/
├── src/                    # Frontend code
│   ├── components/         # Shared components
│   ├── features/           # Domain features
│   ├── pages/              # Route components
│   ├── stores/             # State stores
│   ├── gql/                # Generated GraphQL (if applicable)
│   └── hooks/              # Custom hooks
├── supabase/               # Backend (if using Supabase)
│   ├── schemas/            # SQL schema files
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database migrations
├── context/                # AI context files
│   ├── architecture/       # System design docs
│   ├── domains/            # Domain context files
│   ├── patterns/           # Code pattern docs
│   ├── workflows/          # Development process docs
│   ├── changelog/          # Change history
│   ├── templates/          # Context file templates
│   └── WEEKLY_REVIEW.md    # Weekly review checklist
└── package.json            # Dependencies
```

## Quick Reference

### Common Commands
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run test             # Run tests
npm run lint             # Lint code
npm run typecheck        # Type check
```

### Key Stores / Hooks
- `[storeName]` - Purpose
- `[hookName]` - Purpose

## Coding Standards

### TypeScript
- NEVER use `any`
- ALWAYS define interfaces for component props
- ALWAYS use strict TypeScript configuration
- Export types alongside components

### Security
- Validate inputs with Zod (or your validation library)
- Sanitize user-generated content
- Use RLS for database access (if applicable)
- Handle auth errors gracefully
- Never expose sensitive data client-side

### Component Creation
- Use `React.forwardRef` for reusable components
- Set `displayName` on all forwarded-ref components
- Use `cn()` for className merging (if using Tailwind)
- Extract props interface into separate types
- Use barrel exports (`index.ts`)

### Styling
- Utility-first CSS (Tailwind)
- `cn()` for conditional classes
- Component library (shadcn/ui) as base
- Theme colors via CSS variables

### Data Fetching
- Use lazy queries for conditional fetching
- Handle loading states
- Implement error handling
- Memoize computed values

### Form Handling
- React Hook Form + Zod validation
- Loading states on submit
- Server error handling via `form.setError()`
- TypeScript inference from Zod schemas

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase` | `UserProfile` |
| Hooks | `camelCase` with `use` prefix | `useAuth` |
| Utilities | `camelCase` | `formatDate` |
| Directories | `kebab-case` | `user-profile` |
| DB fields | `snake_case` | `created_at` |
| Env vars | `SCREAMING_SNAKE_CASE` | `SUPABASE_URL` |
| TS interfaces/types | `PascalCase` | `UserProfile` |
| CSS classes | `kebab-case` | `user-avatar` |

## Context Navigation

### Starting a New Task

| Task Type | Primary Context | Related |
|-----------|-----------------|---------|
| New feature | `context/workflows/FEATURE_DEVELOPMENT.md` | Domain CONTEXT.md |
| Bug fix | `context/workflows/BUG_FIXING.md` | `context/patterns/ERROR_HANDLING.md` |
| DB changes | `context/workflows/DATABASE_MIGRATION.md` | `context/architecture/DATA_MODEL.md` |
| Testing | `context/workflows/TESTING.md` | `context/patterns/TESTING.md` |
| Deployment | `context/workflows/DEPLOYMENT.md` | `context/architecture/INFRASTRUCTURE.md` |
| Code review | `context/workflows/CODE_REVIEW.md` | Relevant patterns |
| Local setup | `context/workflows/LOCAL_DEVELOPMENT.md` | System overview |
| Documentation | `context/workflows/DOCUMENTATION.md` | `context/templates/` |

### Domain Deep Dives

| Domain | Context File |
|--------|--------------|
| [Domain 1] | `context/domains/[domain-1]/CONTEXT.md` |
| [Domain 2] | `context/domains/[domain-2]/CONTEXT.md` |

### Architecture & Integrations

| Topic | Context File |
|-------|--------------|
| System Overview | `context/architecture/SYSTEM_OVERVIEW.md` |
| Data Model | `context/architecture/DATA_MODEL.md` |
| Security | `context/architecture/SECURITY.md` |
| Infrastructure | `context/architecture/INFRASTRUCTURE.md` |

### Code Patterns

| Pattern | Context File |
|---------|--------------|
| Authentication | `context/patterns/AUTHENTICATION.md` |
| Components | `context/patterns/COMPONENTS.md` |
| Forms | `context/patterns/FORMS.md` |
| State Management | `context/patterns/STATE_MANAGEMENT.md` |
| Error Handling | `context/patterns/ERROR_HANDLING.md` |

### Creating New Context Files

Use templates in `context/templates/` when adding documentation:

| Template | Use For |
|----------|---------|
| `context/templates/DOMAIN.md` | New business domain |
| `context/templates/ARCHITECTURE.md` | System/infrastructure docs |
| `context/templates/PATTERN.md` | Code patterns |
| `context/templates/WORKFLOW.md` | Development processes |
| `context/templates/CHANGELOG_ENTRY.md` | Changelog entries |

## Final Rule

When in doubt, follow the patterns established in this codebase. If asked to violate a convention, request explicit confirmation and justification.
