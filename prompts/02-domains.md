# Prompt 02: Domains - Populate Domain Context Files

## Overview

This prompt populates domain-specific context files describing:
- Purpose and business value
- Key entities with all field definitions
- Status lifecycles with Mermaid diagrams
- API operations (GraphQL, REST, tRPC, Server Actions, etc.)
- Access control and security rules
- Code locations and dependencies
- Common patterns and gotchas

This prompt should run **after 01-foundation is complete** and **can run per-domain** for incremental updates.

---

## Before you start

Ensure you have access to:
- [ ] Complete source directory (`src/`, `app/`, `screens/`, or equivalent)
- [ ] `context/domains/` directory structure
- [ ] Database schema file (`schema.prisma`, SQL, Mongoose models, or equivalent)
- [ ] Domain source code (components, screens, hooks, queries, services)
- [ ] `AGENTS.md` (to understand domains listed)

---

## Instructions

You are an expert technical documentation AI. Your task is to read actual source code and database schemas, then populate detailed domain context files reflecting how the system actually works.

**Important:** Extract real information from the codebase. Do not generate placeholders.

### Step 1: For Each Domain

**Gather Source Information:**

1. **Read type definitions** - Find types in `src/types/`, co-located types, or types referenced in schema
2. **Extract database schema** - All tables/models/collections for this domain
3. **Find API operations** - REST endpoints, GraphQL queries/mutations, tRPC routers, Server Actions, etc.
4. **Read business logic** - Services, hooks, validation rules
5. **Identify components/screens** - Major UI components or screens in domain
6. **Review tests** - Test cases revealing business rules

### Step 2: Create context/domains/[domain-name]/CONTEXT.md

For each domain, populate:

**Purpose** - What this domain does and why it exists

**Key Entities** - For each entity:
- Name and purpose
- Database table reference
- Full field table (name, type, required, notes)
- Relationships to other entities
- TypeScript interface example

**Status Lifecycle** - If entity has status/state:
- Mermaid state diagram showing transitions
- Status values table
- Business rules for transitions

**Business Rules and Validations** - Field-level and entity-level rules extracted from code

**Code Locations** - Types, business logic, API operations, components/screens, hooks, database schema

**API Operations** - All endpoints/queries/mutations/actions with inputs/outputs/authorization/code location. Document in the format your project uses (REST, GraphQL, tRPC, Server Actions, etc.)

**Access Control** - Document actual access control implementation (RLS policies, middleware, auth guards, Firebase Security Rules, etc.)

**Dependencies** - Upstream (domains used), downstream (domains using this)

**Common Patterns** - How typical operations work with code examples

**Authentication & Authorization** - Who can access, enforcement locations

**Common Gotchas** - Tricky aspects with fixes

**Testing Considerations** - Key test scenarios

**Performance Notes** - Caching, pagination, rate limiting

**Related Context** - Links to architecture, patterns, workflows

Populate with real extracted information. Document API operations in whatever format the project uses (REST, GraphQL, tRPC, Server Actions, etc.).

### Step 3: Process All Domains

For each domain listed in AGENTS.md:
- Extract all real information
- Verify code locations exist
- Add actual code examples
- Document status transitions with Mermaid
- List actual RLS policies if using
- Cross-link to other domains

---

## Verification

For each domain context file, verify:
- [ ] File exists at correct path
- [ ] All entity types documented with actual fields
- [ ] Database tables all documented
- [ ] Status lifecycles have Mermaid diagrams
- [ ] API operations listed with actual code locations
- [ ] Code locations reference existing files
- [ ] Dependencies link to other domains
- [ ] At least one real code example shown
- [ ] Access control policies documented
- [ ] No placeholder content remaining

---

## Next Steps

1. Commit: `git add context/domains && git commit -m "Populate domain contexts"`
2. Review each domain file
3. Run 03-architecture.md next

**Prompt 02 complete!**
