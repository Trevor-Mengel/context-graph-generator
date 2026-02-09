# Prompt 02: Domains - Populate Domain Context Files

## Overview

This prompt populates domain-specific context files describing:
- Purpose and business value
- Key entities with all field definitions
- Status lifecycles with Mermaid diagrams
- GraphQL operations or REST endpoints
- Database policies and security rules
- Code locations and dependencies
- Common patterns and gotchas

This prompt should run **after 01-foundation is complete** and **can run per-domain** for incremental updates.

---

## Before you start

Ensure you have access to:
- [ ] Complete `src/` directory
- [ ] `context/domains/` directory structure
- [ ] Database schema file (`schema.prisma` or SQL)
- [ ] Domain source code (components, hooks, queries, services)
- [ ] `AGENTS.md` (to understand domains listed)

---

## Instructions

You are an expert technical documentation AI. Your task is to read actual source code and database schemas, then populate detailed domain context files reflecting how the system actually works.

**Important:** Extract real information from the codebase. Do not generate placeholders.

### Step 1: For Each Domain

**Gather Source Information:**

1. **Read type definitions** - Find `src/types/[domain]/` or types referenced in schema
2. **Extract database schema** - All tables/models for this domain
3. **Find GraphQL/API operations** - Queries, mutations, endpoints
4. **Read business logic** - Services, hooks, validation rules
5. **Identify components** - Major UI components in domain
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

**Code Locations** - Types, business logic, queries/mutations, components, hooks, database schema

**GraphQL Operations** or **REST Endpoints** - All operations with inputs/outputs/authorization/code location

**Database Policies (RLS)** - If applicable, document actual policies

**Dependencies** - Upstream (domains used), downstream (domains using this)

**Common Patterns** - How typical operations work with code examples

**Authentication & Authorization** - Who can access, enforcement locations

**Common Gotchas** - Tricky aspects with fixes

**Testing Considerations** - Key test scenarios

**Performance Notes** - Caching, pagination, rate limiting

**Related Context** - Links to architecture, patterns, workflows

Populate with real extracted information. If GraphQL operations don't exist, document REST or internal services instead.

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
- [ ] GraphQL/REST operations listed with actual code locations
- [ ] Code locations reference existing files
- [ ] Dependencies link to other domains
- [ ] At least one real code example shown
- [ ] RLS policies documented with actual SQL
- [ ] No placeholder content remaining

---

## Next Steps

1. Commit: `git add context/domains && git commit -m "Populate domain contexts"`
2. Review each domain file
3. Run 03-architecture.md next

**Prompt 02 complete!**
