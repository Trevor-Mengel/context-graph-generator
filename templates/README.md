# Context Graph Generator Templates

A comprehensive set of markdown templates for documenting TypeScript/React/Node/GraphQL/Supabase projects. These templates are designed to work with any project and provide a structured, maintainable way to keep architectural and domain documentation up-to-date.

---

## Available Templates

| Template | Purpose | When to Use | Audience |
|----------|---------|------------|----------|
| **[DOMAIN.md](./DOMAIN.md)** | Document a business domain or feature area | For each major feature/domain in your application | Engineers, Product Managers, Designers |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Document system design and integrations | For major systems, services, or external integrations | Engineers, Architects, Infra Team |
| **[PATTERN.md](./PATTERN.md)** | Document reusable code patterns | For patterns used across the codebase | Engineers, Code Reviewers |
| **[WORKFLOW.md](./WORKFLOW.md)** | Document development processes | For common tasks and processes | Engineers, New Team Members |
| **[CHANGELOG_ENTRY.md](./CHANGELOG_ENTRY.md)** | Track monthly changes and progress | Monthly documentation updates | Entire Team, Stakeholders |
| **[README.md](./README.md)** | Guide for using these templates | To understand the template system | Entire Team |

---

## How to Use

### Step 1: Choose a Template

Decide which type of documentation you need based on the table above.

### Step 2: Copy the Template

```bash
# Copy the template file to your documentation directory
cp templates/DOMAIN.md docs/domains/[DomainName].md

# Or for other templates:
cp templates/ARCHITECTURE.md docs/architecture/[ArchitectureName].md
cp templates/PATTERN.md docs/patterns/[PatternName].md
cp templates/WORKFLOW.md docs/workflows/[WorkflowName].md
cp templates/CHANGELOG_ENTRY.md docs/changelog/CHANGELOG-YYYY-MM.md
```

### Step 3: Fill in the Metadata

Edit the metadata block at the top of the file:

```markdown
> **Type:** [Domain/Architecture/Pattern/Workflow/Changelog]
> **Focus:** [critical/high/medium/low]
> **Owner:** [@your-github-handle]
> **Status:** [draft/active/deprecated]
```

### Step 4: Replace Placeholders

Find and replace all placeholders in the template:

```bash
# Find all placeholders (bash example)
grep -n "\[.*\]" docs/domains/[DomainName].md

# Common placeholders:
# [DomainName] → Your domain name
# [EntityName] → Your entity name
# [ComponentName] → Your component name
# [YourProject] → Your project name
# YYYY-MM-DD → Current date
```

### Step 5: Add Content

Follow each section's instructions and fill in real information from your codebase.

### Step 6: Verify Completeness

Run verification before committing:

```bash
# Check for remaining placeholders
grep "\[.*\]" docs/domains/[DomainName].md

# Validate markdown syntax
npm run lint:markdown docs/domains/[DomainName].md

# Add to git
git add docs/domains/[DomainName].md
git commit -m "docs: add [DomainName] documentation"
```

---

## Metadata Configuration

### Type Values

| Value | Description | Uses |
|-------|-------------|------|
| `Domain` | Business domain or feature area | DOMAIN.md |
| `Architecture` | System design and integrations | ARCHITECTURE.md |
| `Pattern` | Reusable code pattern | PATTERN.md |
| `Workflow` | Development process | WORKFLOW.md |
| `Changelog` | Monthly change tracking | CHANGELOG_ENTRY.md |

### Focus Values

Priority order (from highest to lowest). Choose one value:

| Value | Description | When to Use |
|-------|-------------|------------|
| `critical` | Essential to system operation | Core payment, auth, security features |
| `high` | Important business value | Major features, frequently used |
| `medium` | Moderate importance | Secondary features, utilities |
| `low` | Nice to have | Legacy features, experimental areas |

### Owner Values

Document owner and primary maintainer:

```
> **Owner:** [@john-doe]
```

- Use GitHub handle format with `@`
- Choose person most familiar with the topic
- Update when ownership changes
- Consider team co-ownership with multiple names: `[@john-doe, @jane-smith]`

### Status Values

| Value | Meaning | When to Use |
|-------|---------|------------|
| `draft` | Work in progress | Initial documentation, incomplete sections |
| `active` | Current and maintained | Production systems, active features |
| `deprecated` | No longer used | Old patterns, removed features |
| `under-review` | Waiting for approval | New documentation pending review |

---

## Naming Conventions

Follow these conventions for consistent documentation:

### File Naming

```
# Domains (one per feature/domain)
docs/domains/
  Authentication.md
  UserPermissions.md
  DataProcessing.md

# Architecture (one per system/integration)
docs/architecture/
  GraphQLLayer.md
  PaymentIntegration.md
  CacheStrategy.md

# Patterns (one per pattern type)
docs/patterns/
  ReactQueryHook.md
  FormValidation.md
  ErrorHandling.md

# Workflows (one per process)
docs/workflows/
  FeatureImplementation.md
  BugFixing.md
  DeploymentProcess.md

# Changelogs (one per month)
docs/changelog/
  CHANGELOG-2024-01.md
  CHANGELOG-2024-02.md
```

### Section Headers

Use consistent header hierarchy:
- `# ` - Document title (one per file)
- `## ` - Major sections (Purpose, Key Entities, etc.)
- `### ` - Subsections (Rules, Examples, etc.)
- `#### ` - Details (Code examples, edge cases)

### Code Examples

```typescript
// Label your code examples with language
// Bad
function example() { }

// Good
// src/hooks/useExample.ts
function example() { }

// With line numbers (in markdown)
// src/components/Example.tsx (lines 10-25)
function ExampleComponent() { }
```

### Links to Other Docs

Use relative paths for internal documentation:

```markdown
# Bad - absolute paths
[Authentication](https://github.com/org/repo/blob/main/docs/domains/Authentication.md)

# Good - relative paths
[Authentication Domain](./Authentication.md)
[Pattern Guide](../patterns/ReactQueryHook.md)

# For docs in other directories
[Architecture Overview](../architecture/SystemArchitecture.md)
```

---

## Verification Instructions

Before considering documentation complete, verify:

### Content Verification

- [ ] **Metadata complete** - All fields in metadata block filled
- [ ] **No placeholders remain** - Search for `[...]` patterns
- [ ] **All sections filled** - No empty sections with just instructions
- [ ] **Links valid** - All cross-references point to existing docs
- [ ] **Code examples executable** - Snippets work in your environment
- [ ] **Tables formatted** - Proper markdown table syntax
- [ ] **Consistent style** - Matches other documents

### Technical Verification

```bash
# 1. Check markdown syntax
npm run lint:markdown docs/[path]/[filename].md

# 2. Check for broken links (if you have a link checker)
npm run check:links docs/[path]/[filename].md

# 3. Verify code examples (if you have a code verifier)
npm run lint:code-examples docs/[path]/[filename].md

# 4. Quick manual check
cat docs/[path]/[filename].md | grep "\[.*\]"
```

### Quality Verification

Ask yourself:

- [ ] **Completeness** - Would a new developer understand this?
- [ ] **Accuracy** - Is this information current and correct?
- [ ] **Clarity** - Are explanations clear and jargon minimized?
- [ ] **Examples** - Are examples relevant and working?
- [ ] **Maintenance** - Can someone else update this easily?

---

## Tips for Maintaining Quality

### Keep Documentation Close to Code

```bash
# Organize docs alongside code when possible
src/
  domains/
    authentication/
      DOMAIN.md          # Documentation in the domain folder
      hooks/
      components/
      types/
```

### Update Documentation When Code Changes

- **When you commit code changes:**
  - Update related DOMAIN.md if business logic changed
  - Update related PATTERN.md if implementation pattern changed
  - Update ARCHITECTURE.md if interfaces changed

- **Monthly:** Create/update CHANGELOG_ENTRY.md

- **When creating new features:** Create new DOMAIN.md

### Use Version Control Effectively

```bash
# Good commit message for documentation
git commit -m "docs(domain): update User permissions business rules

- Added new rule for batch operations
- Updated status lifecycle diagram
- Added gotcha about concurrent modifications"
```

### Regular Review Schedule

| Frequency | Task | Owner |
|-----------|------|-------|
| Weekly | Review and update active docs | Domain owner |
| Monthly | Create changelog entry | Tech lead |
| Quarterly | Review all documentation | Team |
| Yearly | Update deprecated docs | Documentation owner |

### Create Documentation Ownership

Assign owners to minimize documentation debt:

| Document | Owner | Last Updated |
|----------|-------|--------------|
| Authentication Domain | @john-doe | 2024-01-15 |
| GraphQL Architecture | @jane-smith | 2024-01-10 |
| React Query Pattern | @bob-johnson | 2024-01-20 |

### Sync Documentation with Code Reviews

```
PR Review Checklist:
- [ ] Code changes follow existing patterns
- [ ] Documentation updated if needed:
  - [ ] DOMAIN.md updated (business rules changed)
  - [ ] ARCHITECTURE.md updated (interfaces changed)
  - [ ] PATTERN.md updated (new pattern introduced)
  - [ ] WORKFLOW.md updated (process changed)
  - [ ] Code comments added (complex logic)
```

### Use Template Checklist

When creating a new document:

```bash
cat > .github/DOCUMENTATION_CHECKLIST.md << 'EOF'
# Documentation Checklist

- [ ] Chose appropriate template
- [ ] Copied template to correct location
- [ ] Updated metadata block (Type, Focus, Owner, Status)
- [ ] Replaced all placeholders
- [ ] Filled all sections with real content
- [ ] Added code examples from codebase
- [ ] Verified markdown syntax
- [ ] Checked for broken links
- [ ] Verified with team that content is accurate
- [ ] Committed with clear message
- [ ] Updated related documents
EOF
```

---

## Integration with Development Workflow

### During Feature Development

```bash
# Create feature branch
git checkout -b feat/new-feature

# Create domain documentation
cp templates/DOMAIN.md docs/domains/NewFeature.md
# ... fill in documentation ...

# Create or update related pattern docs
cp templates/PATTERN.md docs/patterns/NewPattern.md
# ... fill in documentation ...

# Commit with feature code
git add src/features/new-feature/
git add docs/domains/NewFeature.md
git commit -m "feat: implement new feature with documentation"
```

### During Code Review

```
Review checklist:
- [ ] Feature works as designed
- [ ] Code follows documented patterns
- [ ] New DOMAIN.md accurate
- [ ] Updated docs are complete
- [ ] Examples are correct
```

### During Release

```bash
# Create changelog entry for release
cp templates/CHANGELOG_ENTRY.md docs/changelog/CHANGELOG-2024-02.md
# ... fill in monthly summary ...

git add docs/changelog/CHANGELOG-2024-02.md
git commit -m "docs: add February changelog"
```

---

## Advanced Features

### Creating Templates

If you want to extend the system, create a new template:

1. Copy `DOMAIN.md` (most flexible base)
2. Modify sections for your needs
3. Document when to use your template
4. Add to this README's template table

### Automating Placeholder Detection

```bash
#!/bin/bash
# find-placeholders.sh - Find unfilled placeholders in docs

for file in docs/**/*.md; do
  placeholders=$(grep -c "\[.*\]" "$file")
  if [ "$placeholders" -gt 0 ]; then
    echo "$file has $placeholders placeholders:"
    grep "\[.*\]" "$file"
  fi
done
```

### Using with CI/CD

```yaml
# .github/workflows/docs-check.yml
name: Documentation Check

on: [pull_request]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for unfilled placeholders
        run: |
          if grep -r "\[.*\]" docs/ | grep -v "node_modules"; then
            echo "Error: Unfilled placeholders found in docs"
            exit 1
          fi
      - name: Lint markdown
        run: npm run lint:markdown docs/
```

---

## Template Evolution

These templates are living documents. As you use them:

- Note what works well and what's confusing
- Update sections that don't match your workflow
- Share improvements with your team
- Version your templates with `TEMPLATES_VERSION: 2.0` in metadata

---

## FAQ

### Q: How detailed should documentation be?

**A:** Document enough that someone unfamiliar with the code can:
1. Understand why the system exists (purpose)
2. Find where code lives (locations)
3. Know how to make changes (patterns, workflows)
4. Avoid common mistakes (gotchas)

### Q: How often should I update documentation?

**A:** Ideally when you commit code changes affecting that area. Minimum: monthly for active systems.

### Q: Can I combine templates?

**A:** Yes! A complex feature might need both DOMAIN.md and ARCHITECTURE.md. Cross-link them.

### Q: What if my project doesn't use GraphQL?

**A:** Remove GraphQL sections and add sections for your actual tech stack (REST API, tRPC, etc.).

### Q: How do I handle deprecated documentation?

**A:** Change status to `deprecated` and note what to use instead:

```markdown
> **Status:** deprecated

> This pattern has been replaced by [NewPattern](./NewPattern.md).
> See [Migration Guide](./PATTERN.md#migration-guide) for upgrade instructions.
```

### Q: Should documentation live in code or separate repo?

**A:** Prefer keeping docs in the code repo:
- Version controlled with code
- Updated in same PRs
- Easier to keep in sync

### Q: How do I enforce documentation standards?

**A:** Use PR checks:
- Block PRs that modify code without updating docs
- Require documentation review from code owner
- Use linting tools for markdown consistency

---

## Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Plain Language Guidelines](https://www.plainlanguage.gov/)
- [Technical Writing Best Practices](https://google.github.io/styleguide/docguide/)
- [Architecture Decision Records](https://adr.github.io/)

---

## Contributing

When you improve these templates:

1. Update the template file
2. Document your changes in the file
3. Update this README with new guidance
4. Share with your team

Example improvement commit:

```bash
git commit -m "docs(templates): add API integration section to ARCHITECTURE.md

- Add new 'Integration Details' section structure
- Include webhook configuration table
- Add error handling patterns table
- Update ARCHITECTURE template with examples"
```

---

*Created: YYYY-MM-DD*
*Last Updated: YYYY-MM-DD*
