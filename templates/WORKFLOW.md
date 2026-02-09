> **Type:** Workflow
> **Focus:** [critical/high/medium/low]
> **Owner:** [@team-member]
> **Status:** [draft/active/deprecated]

# [WorkflowName] Workflow

## Overview

[2-3 sentence description of what this workflow covers, when it's used, and who performs it. E.g., "This workflow describes how to implement a new feature from planning through deployment. It covers code organization, testing, review, and release processes for a typical feature addition to the platform."]

**Goals:**
- [Goal 1]
- [Goal 2]
- [Goal 3]

**Time Estimate:** [X-Y hours] for typical scenario

---

## Prerequisites

### Required Knowledge

| Topic | Level | Resource |
|-------|-------|----------|
| [Topic1] | [Beginner/Intermediate/Advanced] | [Link to documentation] |
| [Topic2] | [Beginner/Intermediate/Advanced] | [Link to documentation] |
| [Topic3] | [Beginner/Intermediate/Advanced] | [Link to documentation] |
| [Topic4] | [Beginner/Intermediate/Advanced] | [Link to documentation] |

### Required Tools

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| Node.js | 18.x+ | Runtime | `brew install node` or [nvm](https://github.com/nvm-sh/nvm) |
| Git | 2.35+ | Version control | Pre-installed on most systems |
| [ToolName] | [version] | [purpose] | [installation instructions] |
| [ToolName] | [version] | [purpose] | [installation instructions] |

### Pre-workflow Checklist

- [ ] Development environment set up (`npm install`, `.env` configured)
- [ ] Latest branch pulled (`git pull origin main`)
- [ ] All tests passing locally (`npm test`)
- [ ] No uncommitted changes in working directory
- [ ] Access to required resources (databases, APIs, services)

---

## Quick Reference

### Common Commands

```bash
# Start local development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Build for production
npm run build

# Lint and format code
npm run lint
npm run format

# Create feature branch
git checkout -b feat/[feature-name]

# Commit changes
git commit -m "feat: [short description]"

# Push to remote
git push -u origin feat/[feature-name]
```

---

## Workflow Steps

### Step 1: [PreparationPhase]

**Purpose:** [Why this step is necessary]

**Actions:**
1. Create feature branch from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b [branch-type]/[branch-name]
   ```
2. [Action 2 with details]
3. [Action 3 with details]

**Verification:**
- [ ] Branch created successfully
- [ ] Branch name follows convention `[prefix]/[feature-name]`
- [ ] No merge conflicts

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Branch already exists | Local branch not deleted | `git branch -D [branch-name]` |
| Merge conflicts | Stale local main | `git pull origin main` again |

---

### Step 2: [ImplementationPhase]

**Purpose:** [Why this step is necessary]

**Actions:**
1. Implement feature in code
   - Create/update files: [List relevant file paths]
   - Follow [pattern/convention]
   - See code example below

2. Write/update tests
   - Unit tests for [component/function]
   - Integration tests for [workflow]
   - See test example below

3. Run validation
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

**Code Example:**
```typescript
// Implementation example
export function [FunctionName](input: [Type]): [ReturnType] {
  // Implementation
  return result;
}
```

**Test Example:**
```typescript
describe('[Feature]', () => {
  it('should [expected behavior]', () => {
    const result = [FunctionName]([input]);
    expect(result).toEqual([expectedOutput]);
  });
});
```

**Verification:**
- [ ] Code follows project style guide
- [ ] All tests passing locally
- [ ] No ESLint/TypeScript errors
- [ ] Build succeeds without warnings
- [ ] Database migrations (if needed) created

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Tests failing | Logic error | Debug with `npm test -- --verbose` |
| Lint errors | Code style | Run `npm run format` to auto-fix |
| Type errors | Missing types | Add type definitions |

---

### Step 3: [TestingPhase]

**Purpose:** [Why this step is necessary]

**Actions:**
1. Run full test suite
   ```bash
   npm test -- --coverage
   ```

2. Test in local environment
   - Start dev server: `npm run dev`
   - [Manual test procedure 1]
   - [Manual test procedure 2]

3. Test edge cases
   - [Edge case 1 and how to trigger]
   - [Edge case 2 and how to trigger]

**Verification:**
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code coverage above [X]%
- [ ] Manual testing confirms expected behavior
- [ ] Edge cases handled correctly
- [ ] No console errors/warnings in dev tools

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Intermittent test failures | Race condition | Use proper async/await handling |
| Coverage below threshold | Untested code paths | Add tests for [missing areas] |

---

### Step 4: [ReviewPhase]

**Purpose:** [Why this step is necessary]

**Actions:**
1. Create pull request
   ```bash
   git push -u origin [branch-name]
   # Navigate to GitHub and create PR
   ```

2. Fill out PR template
   - Title: Brief description of change
   - Description: Detailed explanation, screenshots if applicable
   - Related Issues: Link relevant issues
   - Testing: Describe manual testing performed

3. Request reviewers
   - Tag @[reviewer1] for [expertise area]
   - Tag @[reviewer2] for [expertise area]

4. Address review feedback
   - Respond to comments
   - Make requested changes
   - Push new commits (don't force push)
   - Request re-review

**PR Template:**
```markdown
## Description
[Brief description of what was changed and why]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #[issue-number]

## Testing
- [x] Unit tests added/updated
- [x] Manual testing completed
- [x] Edge cases tested

## Checklist
- [ ] Code follows style guide
- [ ] Tests passing locally
- [ ] No breaking changes
- [ ] Documentation updated
```

**Verification:**
- [ ] PR follows template
- [ ] CI checks passing (linting, tests, build)
- [ ] At least [X] approvals received
- [ ] No requested changes pending
- [ ] Ready for merge

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| CI failing | Code issue | Fix identified issues and push |
| Merge conflicts | Base branch changed | Rebase on latest main |

---

### Step 5: [DeploymentPhase]

**Purpose:** [Why this step is necessary]

**Actions:**
1. Merge to main
   ```bash
   # GitHub UI: Click "Squash and Merge" or "Merge"
   # Or command line:
   git checkout main
   git pull origin main
   git merge --no-ff [branch-name]
   git push origin main
   ```

2. Delete feature branch
   ```bash
   git branch -d [branch-name]
   git push origin --delete [branch-name]
   ```

3. Deploy to staging (if applicable)
   ```bash
   # Deployment commands or link to deployment docs
   npm run deploy:staging
   ```

4. Deploy to production (if applicable)
   ```bash
   npm run deploy:production
   ```

5. Verify deployment
   - Check [service/dashboard] for successful deployment
   - Run smoke tests in production
   - Monitor logs for errors

**Verification:**
- [ ] Feature branch merged to main
- [ ] Branch deleted locally and remotely
- [ ] Staging deployment successful
- [ ] Production deployment successful
- [ ] No errors in production logs
- [ ] Feature working as expected in production

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Deployment failed | Invalid configuration | Check deployment logs and retry |
| Rollback needed | Production error | Use deployment tools to rollback |

---

## Decision Points

### Decision: [DecisionPoint1Name]

**Question:** [What decision needs to be made?]

| Option | Pros | Cons | Recommendation |
|--------|------|------|-----------------|
| **[Option1]** | [Pro1], [Pro2] | [Con1] | Use when [condition] |
| **[Option2]** | [Pro1], [Pro2] | [Con1], [Con2] | Use when [condition] |
| **[Option3]** | [Pro1] | [Con1], [Con2], [Con3] | Avoid unless [special case] |

**Decision:** [Recommended option and why]

---

### Decision: [DecisionPoint2Name]

**Question:** [What decision needs to be made?]

| Option | Pros | Cons | Recommendation |
|--------|------|------|-----------------|
| **[Option1]** | [Pro1] | [Con1] | [Recommendation] |
| **[Option2]** | [Pro1] | [Con1] | [Recommendation] |

**Decision:** [Recommended option and why]

---

## Common Patterns

### Pattern 1: [CommonPattern1]

**When to use:** [When this pattern applies]

**Implementation:**
```typescript
// Code example
```

**Key points:**
- [Important point 1]
- [Important point 2]

---

### Pattern 2: [CommonPattern2]

**When to use:** [When this pattern applies]

**Implementation:**
```typescript
// Code example
```

**Key points:**
- [Important point 1]
- [Important point 2]

---

## Checklists

### Pre-Implementation Checklist

- [ ] Feature requirements understood
- [ ] Design/mockups reviewed
- [ ] Related domains/patterns documented
- [ ] Database schema changes identified (if needed)
- [ ] GraphQL schema changes identified (if needed)
- [ ] Breaking changes identified (if any)

### Implementation Checklist

- [ ] Code written following patterns
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Code reviewed by self (linting, types, logic)
- [ ] All tests passing locally
- [ ] Build succeeds
- [ ] Database migrations created (if applicable)
- [ ] Environment variables added to .env.example
- [ ] Documentation updated (README, inline comments)

### Pre-Review Checklist

- [ ] Latest main branch pulled and merged
- [ ] No merge conflicts
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] No console errors/warnings
- [ ] Commit messages are clear and descriptive
- [ ] PR title and description complete

### Pre-Deployment Checklist

- [ ] PR approved by reviewers
- [ ] All CI checks passing
- [ ] Tested in staging environment
- [ ] Stakeholders notified of deployment
- [ ] Rollback plan documented (if needed)
- [ ] Monitoring/alerts configured (if needed)

### Post-Deployment Checklist

- [ ] Deployment successful
- [ ] Smoke tests passing
- [ ] Logs monitored for errors
- [ ] Feature verified in production
- [ ] Performance metrics acceptable
- [ ] Documentation updated
- [ ] Team notified of completion

---

## Troubleshooting

### [TroubleName1]

**Symptom:** [What you observe]

**Possible Causes:**
- [Cause 1]
- [Cause 2]
- [Cause 3]

**Solutions:**
1. **Try First:**
   ```bash
   # Command to try first
   npm run [command]
   ```
   - Expected result: [What should happen]

2. **If That Doesn't Work:**
   ```bash
   # Next command to try
   npm run [other-command]
   ```
   - Expected result: [What should happen]

3. **Last Resort:**
   - Escalate to [@team-member]
   - Provide: [Information needed]

---

### [TroubleName2]

**Symptom:** [What you observe]

**Possible Causes:**
- [Cause 1]
- [Cause 2]

**Solutions:**
1. [Solution with steps]
2. [Solution with steps]

**Escalation:** [When to contact team]

---

## Best Practices

### Do ✓

- ✓ **Commit frequently** - Small, logical commits are easier to review
- ✓ **Write clear commit messages** - Use format: `[type]: [description]`
- ✓ **Test thoroughly** - Don't skip edge cases
- ✓ **Ask for help** - Questions are better than mistakes
- ✓ **Document as you go** - Don't leave it for the end
- ✓ **Review your own code first** - Catch obvious issues before review
- ✓ **Respond to feedback promptly** - Keep reviews moving

### Don't ✗

- ✗ **Don't work on main branch** - Always use feature branches
- ✗ **Don't skip tests** - Tests catch bugs before production
- ✗ **Don't commit commented-out code** - Remove it or create an issue
- ✗ **Don't merge without review** - Even one approval is important
- ✗ **Don't force push to main** - Use normal merge/rebase
- ✗ **Don't deploy without staging test** - Always test staging first
- ✗ **Don't ignore warnings** - Fix them or document why they're ok

---

## Automation

### Available Scripts

| Script | Purpose | Command | Notes |
|--------|---------|---------|-------|
| `dev` | Start dev server | `npm run dev` | Hot reload enabled |
| `test` | Run all tests | `npm test` | Watch mode with `-- --watch` |
| `lint` | Check code style | `npm run lint` | Fix with `npm run format` |
| `build` | Production build | `npm run build` | Check for errors |
| `type-check` | TypeScript check | `npm run type-check` | Runs tsc without emit |

### CI/CD Pipeline

| Stage | Trigger | Actions | Status |
|-------|---------|---------|--------|
| Lint | On PR/Push | ESLint, Prettier | Must pass |
| Test | On PR/Push | Jest, E2E tests | Must pass |
| Build | On PR/Push | Production build | Must pass |
| Deploy (Staging) | On merge to main | Build and deploy | Automatic |
| Deploy (Production) | Manual trigger | Build and deploy | Manual approval |

---

## Time Estimates

| Phase | Best Case | Average | Worst Case | Notes |
|-------|-----------|---------|-----------|-------|
| Setup/Preparation | 5 min | 15 min | 30 min | Includes branch creation |
| Implementation | 30 min | 2 hrs | 1 day | Highly variable by task |
| Testing | 15 min | 1 hr | 2 hrs | Includes manual testing |
| Review Cycle | 1 hr | 4 hrs | 1+ days | Depends on reviewer availability |
| Deployment | 10 min | 30 min | 2 hrs | Includes verification |
| **Total** | **1 hr** | **8 hrs** | **2+ days** | For typical feature |

---

## Examples

### Example 1: Simple Change

**Scenario:** Fix a typo in error message

**Time:** ~30 minutes

**Steps:**
1. Create branch: `git checkout -b fix/error-message-typo`
2. Edit file: `src/messages/errors.ts`
3. Run tests: `npm test`
4. Commit: `git commit -m "fix: correct typo in error message"`
5. Push: `git push -u origin fix/error-message-typo`
6. Create PR and get approval
7. Merge to main

---

### Example 2: Complex Feature

**Scenario:** Add new user permission system

**Time:** 2-3 days

**Steps:**
1. Create feature branch: `git checkout -b feat/user-permissions`
2. Update database schema
   - Create migration: `supabase migration new add_permissions_table`
   - Write schema changes
   - Test migration: `npm run migrate`
3. Update GraphQL
   - Add types and resolvers
   - Update RLS policies
4. Update frontend
   - Add React components
   - Add hooks and queries
   - Add routes
5. Comprehensive testing
   - Unit tests for utils
   - Component tests
   - Integration tests
   - Manual testing of workflows
6. Create PR with detailed description
7. Address review feedback
8. Merge after approval
9. Deploy to staging
10. Verify in staging
11. Deploy to production

---

## Context Files to Reference

| Document | Relevant For | Link |
|----------|--------------|------|
| [DOMAIN.md](./DOMAIN.md) | Understanding affected domains | [Link] |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design questions | [Link] |
| [PATTERN.md](./PATTERN.md) | Code organization | [Link] |
| [DATABASE_GUIDE.md]() | Schema changes | [Link] |
| [TESTING_GUIDE.md]() | Writing tests | [Link] |
| [STYLE_GUIDE.md]() | Code style | [Link] |

---

## Related Workflows

- **[RelatedWorkflow1]** - Use before this workflow for [purpose]
- **[RelatedWorkflow2]** - Use after this workflow for [purpose]
- **[RelatedWorkflow3]** - Alternative approach for [purpose]

---

## MCP Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `git` | Version control | Branch management, commits |
| `npm` | Package management | Install, run scripts |
| `node` | Runtime | Execute JavaScript |
| `[custom-tool]` | [Purpose] | [How to use] |

---

*Created: YYYY-MM-DD*
*Last Updated: YYYY-MM-DD*
