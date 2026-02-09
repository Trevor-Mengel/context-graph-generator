# Prompt 04: Patterns - Document Code Patterns and Best Practices

## Overview

This prompt identifies and documents recurring code patterns:
- Authentication and authorization patterns
- GraphQL/API operation patterns  
- State management patterns
- Component creation patterns
- Form handling patterns
- Error handling patterns
- Testing patterns
- Status lifecycle patterns

This prompt should run **after architecture documentation is complete**.

---

## Before you start

Ensure you have access to:
- [ ] Complete `src/` directory
- [ ] `context/patterns/` directory
- [ ] Multiple source files showing real patterns
- [ ] Test files
- [ ] `context/domains/` for reference

---

## Instructions

You are an expert code analyzer. Identify and document patterns used throughout the project.

**Critical:** Extract real code examples from the actual codebase. Do not create abstract examples.

### Step 1: Scan for Patterns

Identify which patterns exist in your project:
- [ ] Authentication
- [ ] Authorization
- [ ] GraphQL Operations (if using GraphQL)
- [ ] REST Patterns (if using REST)
- [ ] State Management
- [ ] Components
- [ ] Forms
- [ ] Navigation
- [ ] Error Handling
- [ ] Caching
- [ ] Real-time (if applicable)
- [ ] Testing
- [ ] Status Lifecycle

### Step 2: For Each Pattern

Create `context/patterns/[PATTERN].md` documenting:

**Overview** - What the pattern is and how it's used

**Strategy** - The approach taken (e.g., "JWT-based authentication")

**Code Examples** - Real code from the project with exact file paths showing:
- How the pattern is implemented
- Common usage scenarios
- Client and server implementations

**Anti-patterns** - Common mistakes with clear explanations and corrections

**Related Patterns** - Links to other pattern files

**Files Using Pattern** - List of actual files in src/ using this pattern

### Step 3: Create Pattern README

Create `context/patterns/README.md` with:
- Overview of all patterns
- Status of each (Complete/Partial/TODO)
- Quick reference guide
- When/where to use each pattern

---

## Verification

After completing, verify:

- [ ] At least 8 core patterns documented
- [ ] Each pattern has real code examples (not generic)
- [ ] All code file paths exist in project
- [ ] Anti-patterns show actual problems and fixes
- [ ] All related pattern references are valid
- [ ] README lists all patterns with status
- [ ] No placeholder content remaining

---

## Next Steps

1. Commit: `git add context/patterns && git commit -m "Document code patterns"`
2. Review for accuracy
3. Run 05-workflows.md next

**Prompt 04 complete!**
