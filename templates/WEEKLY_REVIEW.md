# Weekly Context Review Checklist

Use this checklist for weekly maintenance of the context graph documentation.

## When to Review

- End of each week (Friday recommended)
- After major feature releases
- After significant refactoring
- When onboarding new team members

---

## Accuracy Check

### Code Locations
- [ ] Spot check 5 file paths per domain - do they still exist?
- [ ] Verify function names in documentation match implementation
- [ ] Check that component locations are accurate

### Status Lifecycles
- [ ] Entity statuses match database schema definitions
- [ ] Status transitions match implementation
- [ ] Lifecycle diagrams are up to date

### Business Rules
- [ ] Access control rules documented correctly
- [ ] Status transition rules match database triggers
- [ ] Integration flows match actual implementation

### Integration Configs
- [ ] Environment variables list is current
- [ ] Webhook endpoints documented correctly
- [ ] API versions are up to date

---

## Completeness Check

### New Features
- [ ] All features merged this week have domain context updates
- [ ] New components have pattern documentation
- [ ] New hooks are documented in relevant files

### Gotchas
- [ ] Any bugs fixed this week added as gotchas?
- [ ] Edge cases discovered documented?
- [ ] Workarounds documented with reasoning?

### Patterns
- [ ] New coding patterns documented?
- [ ] Deprecated patterns marked?
- [ ] Examples up to date?

### Dependencies
- [ ] Upstream dependencies accurate?
- [ ] Downstream dependencies accurate?
- [ ] Integration dependencies current?

---

## Automation Check

### Scripts
- [ ] `npx context-graph-generator verify` passes with high score
- [ ] All context files have required sections

### Changelog
- [ ] This week's changes documented in changelog
- [ ] File paths in changelog are accurate
- [ ] Reasons for changes documented

---

## Quick Verification

Run these commands to verify context health:

```bash
# Verify context graph integrity
npx context-graph-generator verify

# Check for broken file references (sample)
grep -r "src/features" context/ | head -20

# List recent context changes
git log --oneline -10 -- context/
```

---

## Review Notes Template

Use this to document your weekly review:

```markdown
## Weekly Review: YYYY-MM-DD

### Reviewer
[Your name]

### Time Spent
[X minutes]

### Issues Found
- [ ] Issue 1: [description] - [action taken]
- [ ] Issue 2: [description] - [action taken]

### Updates Made
- Updated `context/domains/x/CONTEXT.md`: [reason]
- Updated `context/patterns/x.md`: [reason]

### Deferred Items
- [ ] [Item needing follow-up]: [reason for deferral]

### Notes
[Any observations or recommendations]
```

---

## Quarterly Deep Review

Every quarter, perform a deeper review:

- [ ] All context files verified for accuracy
- [ ] All code locations tested
- [ ] All business rules validated against implementation
- [ ] Integration documentation compared to actual configs
- [ ] Old changelog entries archived

---

## Related Files

- `context/workflows/DOCUMENTATION.md` - Documentation workflow
- `context/changelog/` - Changelog directory
