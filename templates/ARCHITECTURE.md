> **Type:** Architecture
> **Focus:** [critical/high/medium/low]
> **Owner:** [@team-member]
> **Status:** [draft/active/deprecated]

# [ArchitectureName] Architecture

## Overview

[2-3 sentence description of what this architecture document covers, its scope, and why it matters. E.g., "This document describes the authentication flow across the system, including OAuth2 integration, token management, and session handling. It covers both frontend and backend components required for secure user authentication."]

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `[VAR_NAME_1]` | ✓ | — | [What this controls] | `production` |
| `[VAR_NAME_2]` | ✓ | — | [What this controls] | `https://api.example.com` |
| `[VAR_NAME_3]` | ✗ | `false` | [What this controls] | `true` |
| `[VAR_NAME_4]` | ✓ | — | [What this controls] | `30000` |

### Vault Secrets

| Secret | Type | Usage | Rotation | Notes |
|--------|------|-------|----------|-------|
| `[SECRET_NAME_1]` | API Key | [Service] authentication | Monthly | Managed by [person/system] |
| `[SECRET_NAME_2]` | OAuth Credentials | [Service] integration | [Schedule] | Keep synced with provider |
| `[SECRET_NAME_3]` | Database Credentials | DB connection | On-demand | Only for production |

---

## Architecture

### System Diagram

<!-- Adapt this diagram for your architecture. Below is a generic template. -->

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  Web Browser     │  │  Mobile App      │  │  CLI/SDK     │   │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬──────┘   │
└───────────┼──────────────────────┼──────────────────────┼─────────┘
            │                      │                      │
            └──────────────────────┼──────────────────────┘
                                   │ HTTPS
            ┌──────────────────────▼──────────────────────┐
            │           API LAYER                         │
            │  [REST / GraphQL / tRPC / Server Actions]   │
            │  [API Routes / Edge Functions / Serverless]  │
            └──────────────────────┬──────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      │                            │                            │
      ▼                            ▼                            ▼
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ DATABASE     │       │ CACHE LAYER      │       │ EXTERNAL SERVICES│
│ [PostgreSQL /│       │ (Redis/Memcached/│       │                  │
│  MongoDB /   │       │  CDN)            │       │ [Service1]       │
│  SQLite]     │       │                  │       │ [Service2]       │
└──────────────┘       └──────────────────┘       └──────────────────┘

```

### Key Components

| Component | Type | Purpose | Technology | Owner |
|-----------|------|---------|-----------|-------|
| **[ComponentName1]** | Service | [What it does] | [Tech stack] | [@team] |
| **[ComponentName2]** | Service | [What it does] | [Tech stack] | [@team] |
| **[ComponentName3]** | Worker/Queue | [What it does] | [Tech stack] | [@team] |
| **[ComponentName4]** | Cache | [What it does] | [Tech stack] | [@team] |
| **[ComponentName5]** | Database | [What it does] | [Tech stack] | [@team] |

---

## Integration Details

### [IntegrationName1]: [ServiceName]

**Service Information:**
- **Provider:** [Company/Service]
- **Documentation:** [Link]
- **Account:** [Account ID/Email]
- **Environment:** [Production/Staging/Sandbox]

**Authentication Method:**
- Type: [API Key / OAuth2 / mTLS / JWT]
- Credentials Location: [Vault key name]
- Scope/Permissions: [Required permissions]
- Token Expiration: [Duration or "Never"]
- Refresh Strategy: [Manual / Automatic]

**API Endpoints:**
| Endpoint | Method | Purpose | Rate Limit | Timeout |
|----------|--------|---------|-----------|---------|
| `/v1/[resource]` | GET | [Description] | 100 req/min | 30s |
| `/v1/[resource]` | POST | [Description] | 100 req/min | 30s |

**Webhooks:**
| Event | Endpoint | Payload | Retry Policy | Notes |
|-------|----------|---------|--------------|-------|
| `[event.type]` | `POST /webhooks/[service]` | [Link to schema] | 3 retries, exponential backoff | Verify signature in middleware |

**Error Handling:**
- 4xx errors: [How to handle]
- 5xx errors: [How to handle]
- Network timeouts: [Strategy]
- Rate limiting: [Fallback strategy]

---

### [IntegrationName2]: [ServiceName]

[Follow same structure as above for each external integration]

---

## Code Locations

### Backend / API

<!-- Adapt to your stack: Supabase, Prisma, Firebase, custom Node server, Next.js API routes, etc. -->

| Component | Type | Location(s) | Notes |
|-----------|------|------------|-------|
| **API Layer** | Endpoints | `app/api/` · `pages/api/` · `src/server/` | REST, GraphQL, tRPC, or Server Actions |
| **Database** | Schema/Migrations | `prisma/` · `supabase/migrations/` · `drizzle/` · `src/db/` | Adapt to your ORM/database |
| **Authentication** | Module | `src/auth/` · `middleware.ts` | Auth strategies, JWT, session handling |
| **Integrations** | Module | `src/integrations/[service]/` · `src/services/` | External service clients |
| **Workers** | Services | `src/workers/` · `src/jobs/` | Background jobs, queues |
| **Types** | TypeScript | `src/types/` | Shared type definitions |
| **Middleware** | Middleware | `middleware.ts` · `src/middleware/` | Request/response processing |

### Frontend / Client

<!-- Adapt paths: Next.js uses app/ or pages/, React Native uses screens/, standard React uses src/ -->

| Component | Type | Location(s) | Notes |
|-----------|------|------------|-------|
| **Pages/Screens** | Route components | `app/` · `pages/` · `screens/` · `src/pages/` | Adapt to your router/framework |
| **Components** | UI components | `src/components/` · `components/` | Reusable UI components |
| **Hooks** | Custom Hooks | `src/hooks/` · `hooks/` | Custom React hooks |
| **Navigation** | Routing | `src/navigation/` · `app/layout.tsx` | React Navigation, file-based routing |
| **State** | State management | `src/stores/` · `src/context/` | Stores or Context providers |
| **Services** | Client | `src/services/` · `src/api/` | API/integration clients |
| **Types** | TypeScript | `src/types/` | Frontend type definitions |

---

## Database Schema

### Core Models / Tables

<!-- Use the format that matches your stack: SQL, Prisma, Mongoose, etc. -->

**SQL (PostgreSQL / Supabase / Drizzle):**
```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  [field1] VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Prisma:**
```prisma
model [ModelName] {
  id        String   @id @default(cuid())
  [field1]  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Mongoose / MongoDB:**
```typescript
const [ModelName]Schema = new Schema({
  [field1]: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Relationships

```mermaid
erDiagram
    [TABLE1] ||--o{ [TABLE2] : "relationship"
    [TABLE1] ||--o{ [TABLE3] : "relationship"
    [TABLE2] ||--o{ [TABLE4] : "relationship"
```

### Materialized Views (if applicable)

| View Name | Purpose | Refresh Schedule | Uses |
|-----------|---------|------------------|------|
| `[view_name]` | [What it aggregates] | Daily at 2am UTC | Dashboard reports |

---

## Error Handling

### Common Errors

| Error | Status | Cause | Resolution | Prevention |
|-------|--------|-------|-----------|-----------|
| `[ERROR_CODE]` | 400 | [Invalid input] | Validate input format | Use schema validation (Zod, Yup, etc.) |
| `[ERROR_CODE]` | 401 | [Auth required] | Provide valid token | Check token expiration |
| `[ERROR_CODE]` | 403 | [Permission denied] | Check access policies | Verify user role and permissions |
| `[ERROR_CODE]` | 429 | [Rate limit] | Exponential backoff | Implement request batching |
| `[ERROR_CODE]` | 500 | [Server error] | Retry after 30s | Check error logs |
| `[ERROR_CODE]` | 503 | [Service unavailable] | Use fallback | Implement circuit breaker |

### Graceful Degradation

| Failure Scenario | Behavior | Impact | Recovery |
|------------------|----------|--------|----------|
| Cache unavailable | Fall through to database | Slight latency increase | Auto-reconnect |
| [Service] offline | Use cached/stale data | Feature degraded | Health check triggers alert |
| Database read replica lag | Use primary database | Consistency maintained | No user impact |
| Rate limit exceeded | Queue requests | Delayed responses | Auto-retry with backoff |

---

## Common Gotchas

### [GotchaTitle1]
- **Symptom:** [What happens when you encounter this issue]
- **Cause:** [Why this happens]
- **Fix:** [How to resolve it]
- **Prevention:** [How to avoid it in the future]

### [GotchaTitle2]
- **Symptom:** [Observable problem]
- **Cause:** [Root cause]
- **Fix:** [Resolution]
- **Prevention:** [Proactive measures]

---

## Dependencies

### Upstream Dependencies
- **Architecture/Service:** [Name] - [reason]
- **External Service:** [ServiceName] - [reason]
- **Database:** [Database name] - [reason]

### Downstream Dependencies
- **Service:** [Consumer] - [what it uses]
- **Feature:** [Feature name] - [what depends on this]

---

## MCP Server Integration

### Available Servers

| Server | Purpose | Connection | Refresh |
|--------|---------|-----------|---------|
| `[mcp-name]` | [What it does] | `stdio` / `sse` | [Schedule] |
| `[mcp-name]` | [What it does] | `stdio` / `sse` | [Schedule] |

### Server Configuration

```json
{
  "mcpServers": {
    "[mcp-name]": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "API_KEY": "vault::[secret-key]",
        "API_URL": "[endpoint]"
      }
    }
  }
}
```

---

## Related Documentation

- [Link to Related Domain Document](./DOMAIN.md)
- [Link to Related Workflow](./WORKFLOW.md)
- [Link to Related Pattern](./PATTERN.md)
- [Link to External Architecture Docs]()
- [Infrastructure Documentation]()

---

*Created: YYYY-MM-DD*
*Last Updated: YYYY-MM-DD*
