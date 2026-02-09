# Prompt 06: Review - Final Verification and Cross-Linking

## Overview

This is the final prompt. It performs comprehensive review to ensure:
- All context files are populated (not placeholders)
- Cross-references are correct
- File paths actually exist
- Dependencies are complete
- Changelog entry is created
- Context graph is ready for use

This prompt should run **last**, after all other prompts are complete.

---

## Before you start

Ensure you have completed:
- [ ] Prompt 01-foundation.md
- [ ] Prompt 02-domains.md
- [ ] Prompt 03-architecture.md
- [ ] Prompt 04-patterns.md
- [ ] Prompt 05-workflows.md

---

## Instructions

You are a meticulous technical reviewer. Verify the context graph is complete, consistent, and ready.

### Step 1: Verify File Completeness

Check that all files exist and are populated (not templates):

**Root level:**
- [ ] AGENTS.md - Real project name, description, versions, domains, commands

**Architecture:**
- [ ] SYSTEM_OVERVIEW.md - Real architecture diagram, directory structure, deployment details
- [ ] DATA_MODEL.md - All database tables/models documented
- [ ] SECURITY.md - Auth/authz strategy, RLS policies with SQL
- [ ] Other architecture files complete

**Domains:**
- [ ] Each domain has CONTEXT.md with entities, status lifecycles, operations, code locations

**Patterns:**
- [ ] Each pattern file has real code examples from src/
- [ ] Anti-patterns documented with fixes
- [ ] README lists all patterns

**Workflows:**
- [ ] Each workflow file complete with real commands
- [ ] CI/CD pipeline documented
- [ ] Migration procedure matches actual setup

### Step 2: Verify Cross-References

Check all internal links:

**From AGENTS.md:**
- [ ] Domain names match context/domains/[name]/CONTEXT.md files
- [ ] Technology versions match package.json
- [ ] Commands exist in package.json scripts
- [ ] File locations exist in project

**Between files:**
- [ ] Domain dependencies link to actual domain files
- [ ] Pattern references point to existing pattern files
- [ ] Architecture references are consistent
- [ ] Workflow references are valid

### Step 3: Verify File Paths

For each file path mentioned in context:
- [ ] Check path exists: `find . -path "[filepath]"`
- [ ] If not found, update reference to actual location
- [ ] All paths are relative to project root

### Step 4: Check Dependencies

Verify relationships between domains:
- [ ] If domain A says "depends on B", check B's downstream lists A
- [ ] All bidirectional references are consistent

### Step 5: Create WEEKLY_REVIEW.md

Create `context/WEEKLY_REVIEW.md` with checklist for maintaining context graph:
- Code changes to document
- Consistency checks
- Freshness verification
- Documentation quality
- Sign-off and review tracking

### Step 6: Create/Update CHANGELOG.md

Add entry documenting initial context graph creation:
```
## Unreleased

### Added
- Initial context graph documentation system
  - AGENTS.md master instructions
  - context/architecture/ - Architecture docs
  - context/domains/ - Domain-specific docs
  - context/patterns/ - Code patterns
  - context/workflows/ - Workflows and procedures
  - context/WEEKLY_REVIEW.md - Maintenance checklist
```

### Step 7: Final Checklist

Verify:
- [ ] No placeholder text remaining (no "[TODO]", "[X]", "[Description]")
- [ ] All code examples use actual file paths
- [ ] All commands are real (exist in package.json)
- [ ] All database references match actual schema
- [ ] Technology versions match package.json
- [ ] All links are valid

### Step 8: Generate Health Report

Create summary:
- Total files: [NUMBER]
- Populated: [NUMBER]
- Completeness: [%]
- Issues found and fixed: [LIST]

---

## Verification

After completing, verify:

- [ ] All 18+ context files exist and populated
- [ ] No placeholder text in any file
- [ ] All cross-references valid
- [ ] All file paths exist
- [ ] WEEKLY_REVIEW.md created
- [ ] CHANGELOG.md updated
- [ ] Health report generated

### Common Issues and Fixes

**"File not found when clicking link"**
- Verify path is relative to project root
- Check file actually exists
- Update to correct path

**"Code example doesn't match actual code"**
- Find real implementation
- Update example with actual code
- Verify file path

**"Domain listed in AGENTS.md has no context file"**
- Create missing context file, or
- Remove domain if it doesn't exist

---

## Final Commit

When complete:

```bash
git add context/ AGENTS.md CHANGELOG.md
git commit -m "Complete context graph documentation

- Created AGENTS.md master instructions
- Documented all domains
- Documented architecture and integrations  
- Documented code patterns
- Documented development workflows
- Added WEEKLY_REVIEW.md for maintenance
- Verified all cross-references and paths"
```

---

## Success Criteria

Your context graph is complete when:

1. All 6 prompts have run
2. All files exist and are populated
3. No placeholder text remains
4. All cross-references are valid
5. All code examples match actual code
6. All file paths verified
7. WEEKLY_REVIEW.md ready for use
8. Changes committed to git
9. Team notified of context graph

---

## Next Steps

Now that context graph is complete:

1. **Share with team** - Add link to AGENTS.md in README
2. **Establish review cadence** - Weekly reviews using WEEKLY_REVIEW.md
3. **Update as code changes** - Keep context fresh during development
4. **Use in AI interactions** - Reference context when prompting agents
5. **Iterate and improve** - Refine based on feedback

---

## Related Resources

- See `context/AGENTS.md` - Master project instructions
- See `context/WEEKLY_REVIEW.md` - Maintenance checklist
- Run: `npx context-graph-generator verify` - Automated verification

---

**Prompt 06 complete! Context graph is now ready for use.**
