# Prompt 03: Architecture - Document Cross-Cutting Concerns

## Overview

This prompt documents architectural concerns spanning multiple domains:
- Security and authentication strategy
- Multitenancy design (if applicable)
- Infrastructure and deployment
- Third-party integrations
- Database migrations and backups
- Real-time communication (if applicable)

This prompt should run **after domains are documented**.

---

## Before you start

Ensure you have access to:
- [ ] `context/domains/` (to understand dependencies)
- [ ] `context/architecture/` directory
- [ ] Auth/middleware source code
- [ ] Database schema and migrations
- [ ] `.env.example` - environment variables
- [ ] Infrastructure/deployment configuration
- [ ] CI/CD workflow files
- [ ] Integration client code

---

## Instructions

You are an expert technical architect. Document architectural patterns that affect the entire system.

### Step 1: Identify Applicable Areas

Determine which of these apply to your project:
- [ ] Security - Authentication, authorization, encryption, secrets
- [ ] Multitenancy - If system serves multiple organizations
- [ ] Infrastructure - Deployment, environments, scaling
- [ ] Integrations - Third-party services (payments, email, etc.)
- [ ] Real-time - WebSockets, subscriptions, live updates
- [ ] Caching - Redis, CDN, application-level caching
- [ ] Search - Elasticsearch, full-text search
- [ ] Background Jobs - Queues, scheduled tasks, edge functions

### Step 2: Create context/architecture/SECURITY.md

Document:

**Authentication** - Strategy (JWT/sessions/OAuth/MFA), flow, token management, database schema

**Authorization** - Strategy (RLS/middleware/permissions/Firebase Rules), roles with permissions, actual access control implementation

**Encryption** - Data in transit (HTTPS/TLS), data at rest, field-level encryption, secrets management

**Input Validation & Output Encoding** - Validation framework, CSRF protection, output encoding

**Common Security Patterns** - Real code examples showing auth checks, encryption, validation

**Security Checklist** - Items to verify security is maintained

All based on actual implementation in the codebase.

### Step 3: Create Other Architecture Files

As applicable:

**MULTITENANCY.md** - Multitenancy model, tenant identification, row-level isolation, context in code

**INFRASTRUCTURE.md** - Environments, hosting provider, database service, connection pooling, migrations, CI/CD pipeline, monitoring, scaling strategy, disaster recovery

**INTEGRATIONS_OVERVIEW.md** - List all services integrated, status, configuration needed

**Per-integration files** (context/architecture/integrations/[SERVICE].md) - Configuration, API endpoints, webhooks, error handling, rate limiting, testing

---

## Verification

After completing, verify:

- [ ] SECURITY.md complete with actual auth/authz implementation
- [ ] All access control policies documented (RLS, middleware, Firebase Rules, etc.)
- [ ] INFRASTRUCTURE.md documents real deployment
- [ ] All environment variables listed
- [ ] INTEGRATIONS_OVERVIEW.md lists all services
- [ ] Per-integration files created for major services
- [ ] All code locations reference existing files
- [ ] No placeholder content remaining

---

## Next Steps

1. Commit: `git add context/architecture && git commit -m "Document architecture concerns"`
2. Review for completeness
3. Run 04-patterns.md next

**Prompt 03 complete!**
