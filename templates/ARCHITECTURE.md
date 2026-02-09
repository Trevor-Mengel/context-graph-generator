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
            │      API GATEWAY / LOAD BALANCER            │
            │  (Rate limiting, request routing)           │
            └──────────────────────┬──────────────────────┘
                                   │
            ┌──────────────────────▼──────────────────────┐
            │        GRAPHQL API LAYER                    │
            │  ┌──────────────────────────────────────┐   │
            │  │  GraphQL Server / Apollo Server      │   │
            │  │  (Query, Mutation, Subscription)     │   │
            │  └──────────────────────────────────────┘   │
            └──────────────────────┬──────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      │                            │                            │
      ▼                            ▼                            ▼
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ DATABASE     │       │ CACHE LAYER      │       │ EXTERNAL SERVICES│
│              │       │ (Redis/Memcached)│       │                  │
│ Supabase     │       │                  │       │ [Service1]       │
│ PostgreSQL   │       │                  │       │ [Service2]       │
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

### Backend

| Component | Type | Location(s) | Notes |
|-----------|------|------------|-------|
| **API Server** | Application | `src/server/` | Main Node/GraphQL server |
| **Database** | Configuration | `supabase/migrations/` | Schema migrations |
| | | `supabase/functions/` | Edge functions |
| **Authentication** | Module | `src/auth/` | Auth strategies, JWT handling |
| **Integrations** | Module | `src/integrations/[service]/` | External service clients |
| **Workers** | Services | `src/workers/` | Background jobs, queues |
| **Types** | TypeScript | `src/types/` | Shared type definitions |
| **Utils** | Utilities | `src/utils/` | Helper functions |
| **Middleware** | Middleware | `src/middleware/` | Request/response processing |

### Frontend

| Component | Type | Location(s) | Notes |
|-----------|------|------------|-------|
| **Pages** | Components | `src/pages/` | Route-level components |
| **Components** | Components | `src/components/` | Reusable UI components |
| **Hooks** | Custom Hooks | `src/hooks/` | Custom React hooks |
| **Context** | State | `src/context/` | React Context providers |
| **Services** | Client | `src/services/` | API/integration clients |
| **Types** | TypeScript | `src/types/` | Frontend type definitions |
| **Utils** | Utilities | `src/utils/` | Helper functions |

---

## Database Schema

### Core Tables

```sql
-- Example table structure
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  [field1] VARCHAR(255) NOT NULL,
  [field2] TIMESTAMP DEFAULT now(),
  [field3] JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),

  -- Constraints
  UNIQUE([field1]),
  FOREIGN KEY([relation_id]) REFERENCES [related_table](id)
);

-- Indexes for performance
CREATE INDEX idx_[table_name]_[field1] ON [table_name]([field1]);
CREATE INDEX idx_[table_name]_created_at ON [table_name](created_at DESC);
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
| `[ERROR_CODE]` | 400 | [Invalid input] | Validate input format | Use GraphQL schema validation |
| `[ERROR_CODE]` | 401 | [Auth required] | Provide valid token | Check token expiration |
| `[ERROR_CODE]` | 403 | [Permission denied] | Check RLS policies | Verify user role |
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
