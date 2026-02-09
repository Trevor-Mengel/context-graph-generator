# Prompt 05: Workflows - Document Development and Deployment Processes

## Overview

This prompt documents workflows and procedures for:
- Local development setup
- Feature development process
- Bug fixing process
- Testing workflow
- Code review process
- Deployment procedures
- Database migrations
- Troubleshooting

This prompt should run **after patterns are documented**.

---

## Before you start

Ensure you have access to:
- [ ] `package.json` (for scripts)
- [ ] CI/CD configuration (GitHub Actions, etc.)
- [ ] Database migration files
- [ ] `context/workflows/` directory
- [ ] README or existing documentation
- [ ] Deployment configuration

---

## Instructions

You are an expert technical writer. Document actual workflows and procedures used in this project.

**Key approach:** Extract real commands from package.json, real steps from actual procedures, real CI/CD configuration.

### Step 1: For Each Workflow

Create files in `context/workflows/`:

**LOCAL_DEVELOPMENT.md** - Prerequisites, initial setup, running locally, development workflow, debugging, environment variables

**FEATURE_DEVELOPMENT.md** - Steps for building features, code review process, testing requirements

**BUG_FIXING.md** - Process for finding and fixing bugs

**TESTING.md** - How to run tests, test structure, coverage goals

**CODE_REVIEW.md** - Code review checklist, process, standards

**DEPLOYMENT.md** - Deployment steps, CI/CD pipeline, rollback procedure

**DATABASE_MIGRATIONS.md** - Creating migrations, running in dev/staging/prod, rollback

**TROUBLESHOOTING.md** - Common issues and solutions, debugging techniques

### Step 2: For Each File

Document with:
- Prerequisites and dependencies
- Step-by-step procedures
- Real commands from package.json (not generic examples)
- Code examples from actual project
- Helpful tables and checklists
- Troubleshooting tips

Extract actual scripts from package.json. Show real deployment configuration. Reference actual CI/CD workflows.

### Step 3: Cross-Reference

Link workflows to:
- Patterns in `context/patterns/`
- Domains in `context/domains/`
- Architecture in `context/architecture/`

---

## Verification

After completing, verify:

- [ ] All 8 workflow files created
- [ ] All commands from package.json documented
- [ ] All file paths reference existing files
- [ ] CI/CD pipeline accurately documented
- [ ] Database migration procedure matches actual setup
- [ ] Environment variables listed and explained
- [ ] Troubleshooting covers common issues
- [ ] No placeholder content remaining

---

## Next Steps

1. Commit: `git add context/workflows && git commit -m "Document development workflows"`
2. Review for accuracy and completeness
3. Run 06-review.md next for final verification

**Prompt 05 complete!**
