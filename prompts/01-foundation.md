# Prompt 01: Foundation - Build the Master Context Files

## Overview

This prompt generates the root documentation for your project:
- **AGENTS.md** - The master instruction file that all AI agents reference
- **context/architecture/SYSTEM_OVERVIEW.md** - Complete system architecture
- **context/architecture/DATA_MODEL.md** - Database schema documentation

This prompt should run **only once** and should be the **first** in the sequence.

---

## Before you start

Ensure you have access to:
- [ ] Complete `src/` directory (or equivalent source root)
- [ ] `package.json` file
- [ ] `tsconfig.json` or equivalent type configuration
- [ ] Database schema files (schema.prisma, Supabase SQL, or equivalent)
- [ ] `context/` directory structure (created by scaffold script)
- [ ] `.env.example` or environment variable documentation

---

## Instructions

You are an expert documentation AI assistant for a modern web application. Your task is to scan the codebase and generate foundational context documentation.

**Key approach:** Extract actual information from real files. Do not generate placeholder content. If information is missing, note it in a TODO rather than creating generic text.

### Step 1: Analyze the Project

1. **Read package.json** - Extract project name, description, dependencies, scripts
2. **Read tsconfig.json** - Extract TypeScript configuration, path aliases
3. **Read src/ structure** - Understand directory organization and main modules
4. **Read database schema** - Extract models/tables, fields, relationships
5. **Read .env.example** - List all environment variables

### Step 2: Create AGENTS.md in project root

This is the master reference file. Populate it with:
- **Project Summary** - 2-3 sentences describing the project
- **Technology Stack** - Table with framework, database, libraries and versions
- **Architecture Patterns** - How frontend, backend, database are organized
- **Core Domains** - List of main business areas with locations
- **Project File Locations** - Directory structure reference
- **Quick Reference** - Common commands from package.json
- **Coding Standards** - TypeScript, security, components, styling, data fetching, forms, integrations rules
- **Naming Conventions** - File, variable, database naming patterns
- **Task Navigation** - Map task types to relevant context files
- **Key Files to Know** - Table pointing to important docs

Use actual values from the codebase, not placeholders.

### Step 3: Create context/architecture/SYSTEM_OVERVIEW.md

Document:
- **Architecture Diagram** - Text-based flow diagram
- **Directory Structure** - Complete src/ tree
- **Core Components** - Frontend, backend, database, external services
- **Deployment Architecture** - Where/how it's deployed
- **Request/Data Flow** - How data moves through system
- **Performance & Security** - Key optimizations and boundaries
- **Scaling Considerations** - How system scales

All based on actual project structure.

### Step 4: Create context/architecture/DATA_MODEL.md

Document:
- **Database Schema** - Each table with fields, types, constraints
- **Entity Relationships** - Describe 1:N, N:N relationships
- **Relationships Diagram** - ASCII diagram showing table connections
- **Enums and Custom Types** - Any special types defined
- **Migration Strategy** - How migrations are managed
- **Business Rules** - Constraints enforced in schema
- **Data Lifecycle** - Creation, updates, deletion, archival

Extract from actual schema.prisma or SQL, not generic examples.

---

## Verification

After completing, verify:
- [ ] AGENTS.md exists with real content (not placeholders)
- [ ] All package.json scripts listed in Common Commands
- [ ] All domains in Core Domains have real src/ locations
- [ ] Technology stack versions match package.json
- [ ] SYSTEM_OVERVIEW.md has actual architecture diagram
- [ ] DATA_MODEL.md documents all real database tables
- [ ] No placeholder text like "[TODO]" or "[Description]"
- [ ] All file paths reference existing files

---

## Next Steps

1. Commit: `git add context/ AGENTS.md && git commit -m "Initialize context foundation"`
2. Review AGENTS.md - it's your master reference
3. Run 02-domains.md next

**Prompt 01 complete!**
