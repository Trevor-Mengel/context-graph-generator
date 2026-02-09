# TaskFlow System Overview

## Project Overview

TaskFlow is a modern collaborative project management platform built for remote teams. It combines a responsive React 18 frontend deployed on Vercel with a serverless backend powered by Supabase (PostgreSQL + Auth + Realtime). The architecture emphasizes real-time collaboration, type safety, and scalable multi-tenancy using database Row-Level Security.

**Key Characteristics**:
- **Feature-based monorepo**: One codebase for frontend and database (Supabase migrations)
- **Type-safe end-to-end**: TypeScript throughout, with generated GraphQL types
- **Real-time updates**: WebSocket subscriptions via Supabase Realtime
- **RLS-enforced security**: Database-level access control, not application-level
- **Stateful frontend**: Zustand for UI state, Apollo for data state
- **Serverless backend**: PostgreSQL + Edge Functions, no container management

---

## Technology Stack (with versions)

### Frontend Framework & Tooling

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework with hooks and concurrent features |
| TypeScript | 5.3.3 | Type safety and IDE support |
| Vite | 5.0.8 | Lightning-fast build tool and dev server |
| Tailwind CSS | 3.3.6 | Utility-first CSS framework |
| PostCSS | 8.4.31 | CSS processing (for Tailwind) |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 4.4.7 | Global UI state (sidebar, filters, theme) |
| Apollo Client | 3.8.4 | GraphQL client + data caching |
| @apollo/client/cache | 3.8.4 | In-memory cache with normalized queries |

### Data & Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase (PostgreSQL) | Latest | Primary database with RLS |
| Supabase Auth | - | Authentication (email, OAuth) |
| Supabase Realtime | - | WebSocket subscriptions |
| Supabase Storage | - | File attachment storage (S3) |
| GraphQL (code-first) | Apollo Server | Resolvers in Edge Functions |

### Third-Party Services

| Service | Version | Purpose |
|---------|---------|---------|
| Vercel | - | Frontend hosting + serverless functions |
| Supabase Cloud | - | Managed PostgreSQL database |
| Resend | - | Transactional email (notifications, digests) |
| Stripe | - | Payment processing for team subscriptions |
| PostHog | - | Product analytics and feature flags |

### Testing & Quality

| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | 1.0.4 | Unit/integration test runner |
| React Testing Library | 14.1.2 | Component testing utilities |
| Playwright | 1.40.1 | End-to-end browser testing |
| @testing-library/user-event | 14.5.1 | Simulating user interactions |

### Package Management & Deployment

| Tool | Version | Purpose |
|------|---------|---------|
| pnpm | 8.13.1 | Fast, disk-efficient package manager |
| Node | 20 LTS | Runtime environment |
| npm | 10+ | Dependency management |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER / CLIENT                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ React 18 SPA (Vite + Tailwind + TypeScript)                           │ │
│  │                                                                        │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │ │
│  │  │ Components       │  │ Zustand Stores   │  │ Apollo Client       │ │ │
│  │  │ (TaskCard,       │  │ (UI State)       │  │ (Data + Cache)      │ │ │
│  │  │  TaskBoard,      │  │ - sidebarOpen    │  │ - Queries           │ │ │
│  │  │  TaskForm,       │  │ - activeProject  │  │ - Mutations         │ │ │
│  │  │  Comments,       │  │ - theme          │  │ - Subscriptions     │ │ │
│  │  │  UserProfile)    │  │ - filters        │  │ (GraphQL over WS)   │ │ │
│  │  └──────────────────┘  └──────────────────┘  └─────────────────────┘ │ │
│  │                                                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Custom Hooks Layer                                               │ │ │
│  │  │ - useTask, useTaskList, useTaskCreate, useTaskUpdate            │ │ │
│  │  │ - useProject, useProjectList                                    │ │ │
│  │  │ - useComments, useCreateComment                                 │ │ │
│  │  │ - useAuth, useCurrentUser                                       │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                             GraphQL Queries/Mutations                        │
│                             + WebSocket Subscriptions                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ HTTPS/WSS
                ┌──────────────────┴─────────────────┐
                │                                    │
       ┌────────▼────────┐              ┌───────────▼──────────┐
       │  VERCEL EDGE    │              │ SUPABASE POSTGRES    │
       │  (Frontend CDN) │              │ + Realtime + Auth    │
       └────────┬────────┘              └───────────┬──────────┘
                │                                    │
                │ GraphQL Resolver                   │
                │ + RLS Enforcement                  │
                │                                    │
                └───────────────────────┬────────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                     │
           ┌─────────▼────────┐            ┌──────────────▼────────┐
           │ Supabase Auth    │            │ PostgreSQL Schema    │
           │ - Email/Password │            │ - projects           │
           │ - OAuth (Google, │            │ - tasks              │
           │   GitHub)        │            │ - comments           │
           │ - Sessions       │            │ - users              │
           │ - MFA            │            │ - teams              │
           └──────────────────┘            │ - activity_logs      │
                                           │ - attachments        │
                                           │ - notifications      │
                                           └──────────────────────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                          ┌─────────▼──────┐  ┌─────▼──────────┐  ┌──▼──────────┐
                          │ Supabase       │  │ Supabase       │  │ PostgreSQL  │
                          │ Storage        │  │ Realtime       │  │ Indexes +   │
                          │ (S3)           │  │ (WebSocket)    │  │ Triggers    │
                          │ Attachments    │  │ Real-time      │  │ RLS         │
                          │                │  │ Subscriptions  │  │ Policies    │
                          └────────────────┘  └────────────────┘  └─────────────┘
                                                     │
                ┌────────────────────────────────────┼────────────────────────────────┐
                │                                    │                                │
        ┌───────▼─────────┐             ┌───────────▼──────────┐      ┌──────────────▼──────┐
        │ Resend          │             │ Stripe              │      │ PostHog             │
        │ (Email)         │             │ (Payments)          │      │ (Analytics)         │
        │ - Notifications │             │ - Subscriptions     │      │ - Events            │
        │ - Digests       │             │ - Team plans        │      │ - Feature flags     │
        │ - Invitations   │             │ - Invoices          │      │ - Funnels           │
        └─────────────────┘             └─────────────────────┘      └─────────────────────┘
```

---

## Directory Structure

### Frontend (`src/`)

```
src/
├── main.tsx                             # Entry point
├── app.tsx                              # Root App component, routing setup
├── index.css                            # Global styles (Tailwind directives)
├── vite-env.d.ts                        # Vite type definitions

├── hooks/                               # Shared/utility hooks
│   ├── useAuth.ts                       # Auth status and current user
│   ├── useLocalStorage.ts               # Persist state to localStorage
│   ├── useDebounce.ts                   # Debounce hook
│   ├── useAsync.ts                      # Async operation wrapper
│   ├── useWindowResize.ts               # Viewport/window size tracking
│   └── useKeyboardShortcut.ts           # Global keyboard handler

├── services/                            # Singleton services (non-domain)
│   ├── apollo.ts                        # Apollo Client initialization
│   │                                    # - Auth token injection
│   │                                    # - Error handling
│   │                                    # - Cache config
│   ├── supabase.ts                      # Supabase client instance
│   │                                    # - Auth listeners
│   │                                    # - Real-time subscriptions
│   ├── analytics.ts                     # PostHog integration
│   ├── storage.ts                       # Supabase Storage helpers
│   └── logger.ts                        # Error/event logging

├── stores/                              # Zustand global state
│   ├── appStore.ts                      # App UI state
│   │   export { useAppStore }
│   │   - sidebarOpen: boolean
│   │   - activeTeamId: string | null
│   │   - activeProjectId: string | null
│   │   - theme: 'light' | 'dark'
│   ├── authStore.ts                     # Auth state
│   │   export { useAuthStore }
│   │   - user: User | null
│   │   - isLoading: boolean
│   │   - setUser, setLoading
│   └── filterStore.ts                   # Task/project filters
│       export { useFilterStore }
│       - taskFilters, projectFilters
│       - setTaskFilters, clearFilters

├── types/                               # Global TypeScript definitions
│   ├── common.ts                        # Shared types (UUID, Enum, etc.)
│   ├── graphql.ts                       # Generated from schema (auto-generated)
│   └── api.ts                           # API response types

├── utils/                               # Utility functions
│   ├── cn.ts                            # classnames helper for Tailwind
│   ├── date.ts                          # Date parsing, formatting, timezone
│   ├── validation.ts                    # Form validation (email, required, etc.)
│   ├── colors.ts                        # Color utilities for priority, status
│   ├── truncate.ts                      # String truncation
│   └── debounce.ts                      # Debounce function

├── components/                          # Shared/global UI components
│   ├── Button.tsx                       # Variants: primary, secondary, danger
│   ├── Input.tsx                        # Input field with validation
│   ├── Modal.tsx                        # Modal dialog wrapper
│   ├── Dropdown.tsx                     # Dropdown/select menu
│   ├── Badge.tsx                        # Tag/badge display
│   ├── Avatar.tsx                       # User avatar with fallback
│   ├── Loading.tsx                      # Loading spinner
│   ├── Toast.tsx                        # Toast notification container
│   ├── ErrorBoundary.tsx                # Error boundary wrapper
│   ├── Pagination.tsx                   # Pagination controls
│   ├── Tooltip.tsx                      # Tooltip component
│   └── Dialog.tsx                       # Confirm dialog

├── layouts/                             # Layout components (not feature-specific)
│   ├── MainLayout.tsx                   # Main authenticated layout
│   │   - Sidebar, Header, MainContent
│   ├── AuthLayout.tsx                   # Login/signup layout
│   │   - No sidebar, minimal header
│   ├── Sidebar.tsx                      # Navigation sidebar
│   ├── Header.tsx                       # Top header bar
│   ├── Footer.tsx                       # Footer (optional)
│   └── NotFoundLayout.tsx               # 404 page layout

├── features/                            # Feature-based domain folders
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx            # Email/password login
│   │   │   ├── SignupForm.tsx           # User registration
│   │   │   └── PasswordReset.tsx        # Reset flow
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── ResetPage.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useSignup.ts
│   │   │   └── usePasswordReset.ts
│   │   ├── queries.ts                   # Auth queries (GET_CURRENT_USER)
│   │   ├── mutations.ts                 # Auth mutations (LOGIN, SIGNUP)
│   │   └── types.ts                     # AuthUser, LoginInput, etc.
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectHeader.tsx
│   │   │   ├── ProjectSettings.tsx
│   │   │   └── ProjectMembersList.tsx
│   │   ├── pages/
│   │   │   ├── ProjectsListPage.tsx     # All projects for active team
│   │   │   └── ProjectDetailPage.tsx    # Single project view
│   │   ├── hooks/
│   │   │   ├── useProject.ts            # Fetch single project
│   │   │   ├── useProjectList.ts        # Fetch projects for team
│   │   │   ├── useCreateProject.ts      # Create mutation
│   │   │   └── useProjectMembers.ts     # Team members in project
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskDetailModal.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskBoard.tsx            # Kanban board view
│   │   │   ├── TaskList.tsx             # Table view
│   │   │   ├── TaskFilters.tsx          # Filter UI
│   │   │   ├── TaskStatusBadge.tsx
│   │   │   └── BulkTaskActions.tsx
│   │   ├── pages/
│   │   │   └── TasksPage.tsx            # Main tasks view
│   │   ├── hooks/
│   │   │   ├── useTask.ts
│   │   │   ├── useTaskList.ts
│   │   │   ├── useTaskCreate.ts
│   │   │   ├── useTaskUpdate.ts
│   │   │   ├── useTaskFilters.ts
│   │   │   ├── useTaskBulkOps.ts
│   │   │   └── useTaskSearch.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── comments/
│   │   ├── components/
│   │   │   ├── CommentSection.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── MentionAutocomplete.tsx
│   │   ├── hooks/
│   │   │   ├── useComments.ts
│   │   │   ├── useCreateComment.ts
│   │   │   └── useEditComment.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   │   ├── UserAvatar.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserSettings.tsx
│   │   ├── pages/
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/
│   │   │   ├── useCurrentUser.ts
│   │   │   ├── useUserProfile.ts
│   │   │   └── useUpdateProfile.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── teams/
│   │   ├── components/
│   │   │   ├── TeamSwitcher.tsx
│   │   │   ├── TeamSettings.tsx
│   │   │   └── TeamMembersList.tsx
│   │   ├── hooks/
│   │   │   ├── useTeam.ts
│   │   │   ├── useTeamList.ts
│   │   │   └── useTeamMembers.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── NotificationCenter.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── hooks/
│   │   │   ├── useNotifications.ts
│   │   │   └── useMarkAsRead.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts
│   │
│   ├── activity/
│   │   ├── components/
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── ActivityItem.tsx
│   │   ├── hooks/
│   │   │   └── useActivityFeed.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   │
│   └── files/
│       ├── components/
│       │   ├── FileUpload.tsx
│       │   ├── FileList.tsx
│       │   └── FilePreview.tsx
│       ├── hooks/
│       │   ├── useFileUpload.ts
│       │   └── useFileDelete.ts
│       ├── mutations.ts
│       └── types.ts

└── __tests__/                           # Test files (mirror src structure)
    ├── unit/
    │   ├── utils/
    │   │   ├── date.test.ts
    │   │   └── validation.test.ts
    │   └── hooks/
    │       ├── useAuth.test.ts
    │       └── useTaskFilters.test.ts
    ├── integration/
    │   ├── tasks.test.ts                # End-to-end task flows
    │   └── auth.test.ts
    └── e2e/                             # Playwright E2E tests
        ├── login.spec.ts
        ├── task-create.spec.ts
        └── task-filter.spec.ts
```

### Backend (`supabase/`)

```
supabase/
├── config.toml                          # Supabase project config
│                                        # - JWT settings
│                                        # - RLS defaults
│                                        # - Studio URL

├── migrations/                          # PostgreSQL migrations (run in order)
│   ├── 20240101000000_initial_schema.sql
│   │   - CREATE TABLE users
│   │   - CREATE TABLE teams
│   │   - CREATE TABLE projects
│   │   - CREATE TABLE tasks
│   │   - CREATE TABLE comments
│   │   - CREATE TABLE project_members
│   ├── 20240102000000_add_indexes.sql
│   │   - CREATE INDEX for performance
│   │   - Composite indexes for common queries
│   ├── 20240103000000_add_rls_policies.sql
│   │   - Row-Level Security policies
│   │   - Organization-based access
│   ├── 20240104000000_add_triggers.sql
│   │   - Audit triggers (created_at, updated_at)
│   │   - Notification triggers
│   ├── 20240110000000_add_activity_logs.sql
│   │   - Activity table schema
│   │   - Trigger to log changes
│   ├── 20240115000000_add_attachments.sql
│   │   - Attachments table
│   │   - File metadata storage
│   ├── 20240120000000_add_notifications.sql
│   │   - Notifications table
│   │   - Email queue table
│   └── ... (incremental improvements)

├── functions/                           # Supabase Edge Functions
│   ├── create_activity_log/
│   │   └── index.ts                     # Log task/project changes
│   │                                    # Triggered by database trigger
│   ├── send_task_notification/
│   │   └── index.ts                     # Send email on assignment
│   ├── process_task_mentions/
│   │   └── index.ts                     # Parse comment for @mentions
│   ├── bulk_update_tasks/
│   │   └── index.ts                     # Bulk operations handler
│   ├── calculate_task_stats/
│   │   └── index.ts                     # Update materialized views
│   ├── process_attachments/
│   │   └── index.ts                     # Scan, validate uploads
│   └── send_digest_email/
│       └── index.ts                     # Daily digest of activity

├── seed.sql                             # Development seed data
│   - Mock users, teams, projects, tasks
│   - For local development/testing

├── .env.example                         # Example env vars
│   - SUPABASE_URL
│   - SUPABASE_SERVICE_KEY (server-only)
│   - STRIPE_SECRET_KEY
│   - RESEND_API_KEY
│   - POSTHOG_API_KEY

└── .gitignore                           # Ignore secrets, node_modules
```

---

## Key Architectural Patterns

### 1. Feature-Based Organization

Code is organized by **feature/domain**, not by layer (components, services, etc.).

```
❌ Bad: Layer-based organization
src/
  components/       # All components mixed together
  services/         # All services mixed together
  hooks/           # All hooks mixed together

✅ Good: Feature-based organization
src/features/
  tasks/           # All task-related code together
    components/
    hooks/
    mutations.ts
  projects/        # All project-related code together
    components/
    hooks/
    mutations.ts
```

**Benefits**:
- Find all related code in one folder
- Easy to delete/refactor a feature
- Better for team scaling (one team owns one feature)

### 2. RLS-Based Multi-Tenancy

All data isolation happens at the **database layer** using PostgreSQL Row-Level Security (RLS), not in the application.

```sql
-- Database enforces: users can only see tasks in projects they're members of
CREATE POLICY "users_see_project_tasks" ON tasks
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );
```

**Benefits**:
- Prevents authorization bugs
- Can't accidentally leak data
- Scales better (frontend doesn't check permissions)
- Easier to audit/debug

### 3. GraphQL-First Data Layer

All data fetching goes through **GraphQL** via Apollo Client. No raw API calls or data mixing.

```typescript
// ✅ Good: Use GraphQL
const { data } = useQuery(GET_TASKS_QUERY, { variables: { projectId } });

// ❌ Bad: Raw fetch calls
const data = await fetch(`/api/tasks?projectId=${projectId}`).then(r => r.json());
```

**Benefits**:
- Type-safe (generated from schema)
- Automatic caching
- Predictable data flow
- Easier refactoring

### 4. Zustand for UI State, Apollo for Data State

Clear separation:
- **Zustand**: Ephemeral UI state (sidebar open, theme, active tab)
- **Apollo**: Server data (tasks, projects, users)

```typescript
// UI state - Zustand (resets on page refresh)
const sidebarOpen = useAppStore(s => s.sidebarOpen);

// Data state - Apollo (persists via cache)
const { data: tasks } = useQuery(GET_TASKS);
```

**Benefits**:
- Clear responsibility
- Easier debugging
- No hydration mismatches
- Better performance

### 5. Hooks-Based Component Architecture

Heavy use of custom hooks encapsulates logic. Components stay thin.

```typescript
// Hook encapsulates logic
function useTaskUpdate() {
  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);
  return { updateTask, loading, error };
}

// Component just renders
function TaskCard({ task }) {
  const { updateTask } = useTaskUpdate();
  return (
    <button onClick={() => updateTask({ id: task.id, status: 'done' })}>
      Mark Done
    </button>
  );
}
```

**Benefits**:
- Reusable logic
- Easier to test
- Cleaner components

### 6. Error Handling & Toast Notifications

All mutations wrap errors and show user feedback.

```typescript
async function saveTask(task) {
  try {
    await updateTask({ variables: { task } });
    toast.success('Task saved');
  } catch (error) {
    logger.error('Failed to save task', { task, error });
    toast.error('Failed to save. Please try again.');
  }
}
```

**Benefits**:
- Consistent UX
- Easier debugging (all errors logged)
- User always knows what happened

---

## Environment Configuration

### Frontend Environment Variables (VITE_*)

Frontend only sees variables prefixed with `VITE_`:

```bash
# .env.development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJ...  # Public anon key only!
VITE_APOLLO_ENDPOINT=http://localhost:3000/graphql
VITE_POSTHOG_API_KEY=phc_xxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

```bash
# .env.production
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APOLLO_ENDPOINT=https://taskflow.api.com/graphql
VITE_POSTHOG_API_KEY=phc_yyy
VITE_STRIPE_PUBLIC_KEY=pk_live_yyy
```

**Access in code**:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

### Backend Environment Variables (Server-only)

Backend/functions access all env vars (no VITE_ prefix):

```bash
# Supabase Edge Functions (run server-side)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # Private! Never expose to frontend
STRIPE_SECRET_KEY=sk_test_xxx       # Private!
RESEND_API_KEY=re_xxx               # Private!
POSTHOG_API_KEY=phc_xxx
```

**Access in functions**:
```typescript
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
```

### Environment Configuration Table

| Variable | Frontend | Backend | Purpose | Notes |
|----------|----------|---------|---------|-------|
| `VITE_SUPABASE_URL` | ✅ | - | Supabase project URL | Public |
| `VITE_SUPABASE_ANON_KEY` | ✅ | - | Supabase anon key | Public, RLS-protected |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ | Supabase admin key | PRIVATE! Bypass RLS |
| `VITE_APOLLO_ENDPOINT` | ✅ | - | GraphQL endpoint | Public |
| `VITE_POSTHOG_API_KEY` | ✅ | ✅ | Analytics API key | Public |
| `VITE_STRIPE_PUBLIC_KEY` | ✅ | - | Stripe public key | Public |
| `STRIPE_SECRET_KEY` | ❌ | ✅ | Stripe secret key | PRIVATE! |
| `RESEND_API_KEY` | ❌ | ✅ | Email service API key | PRIVATE! |

---

## NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server (hot reload) |
| `dev:db` | `supabase start` | Start local Supabase instance |
| `build` | `vite build` | Production build (minified) |
| `preview` | `vite preview` | Preview production build locally |
| `type-check` | `tsc --noEmit` | Check TypeScript without emitting |
| `lint` | `eslint src --fix` | Lint and fix code |
| `test` | `vitest` | Run unit tests |
| `test:watch` | `vitest --watch` | Watch mode for tests |
| `test:ui` | `vitest --ui` | Open test UI in browser |
| `test:coverage` | `vitest --coverage` | Generate coverage report |
| `test:e2e` | `playwright test` | Run E2E tests (Playwright) |
| `test:e2e:ui` | `playwright test --ui` | Open E2E test UI |
| `db:migrate` | `supabase migration up` | Run pending migrations |
| `db:reset` | `supabase db reset` | Reset local DB (dev only) |
| `db:seed` | `psql ... < seed.sql` | Seed dev data |
| `gen:types` | `supabase gen types typescript` | Generate TS types from schema |
| `gen:graphql` | `graphql-codegen` | Generate GraphQL types |

---

## Deployment

### Frontend (Vercel)

```bash
# Automatic deployment on push to main
1. Push to main branch
2. Vercel builds: pnpm install && pnpm build
3. Output: dist/ folder
4. Deploy to CDN
5. DNS: taskflow.com → Vercel CDN

# Environment variables set in Vercel dashboard
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_APOLLO_ENDPOINT
- VITE_POSTHOG_API_KEY
- VITE_STRIPE_PUBLIC_KEY
```

### Backend (Supabase Cloud)

```bash
# Supabase Cloud hosts everything:
1. PostgreSQL database (auto-scaled)
2. Auth service (email/OAuth)
3. Realtime (WebSocket subscriptions)
4. Storage (S3-compatible)
5. Edge Functions (serverless)

# Migrations auto-run
- Committed to supabase/migrations/
- Run in order on deploy
```

### Environments

| Environment | Frontend | Backend | Purpose |
|-------------|----------|---------|---------|
| **Development** | Local (localhost:5173) | Local Supabase (docker) | Day-to-day work |
| **Staging** | Vercel preview deploy | Staging Supabase project | QA + testing before prod |
| **Production** | taskflow.com (Vercel CDN) | Production Supabase | Live users |

**Local Development**:
```bash
# Start everything locally
pnpm install
pnpm dev:db                 # Start local Supabase (port 54321)
pnpm dev                    # Start frontend (port 5173)

# Navigate to http://localhost:5173
```

---

## Code Locations Reference

| Layer | Location | Files |
|-------|----------|-------|
| **Pages** | `src/features/*/pages/` | Route-level components |
| **Components** | `src/features/*/components/` | UI pieces |
| **Hooks** | `src/features/*/hooks/` | Custom React hooks |
| **GraphQL Queries** | `src/features/*/queries.ts` | Read operations |
| **GraphQL Mutations** | `src/features/*/mutations.ts` | Write operations |
| **Domain Types** | `src/features/*/types.ts` | TypeScript interfaces |
| **Global Types** | `src/types/` | Shared type definitions |
| **Shared Hooks** | `src/hooks/` | App-wide hooks |
| **Services** | `src/services/` | Apollo, Supabase, Analytics clients |
| **Zustand Stores** | `src/stores/` | Global state (appStore, authStore) |
| **Utils** | `src/utils/` | Helper functions |
| **Shared Components** | `src/components/` | Button, Modal, Badge, etc. |
| **Tests** | `src/__tests__/` | Unit, integration, E2E tests |
| **Database Schema** | `supabase/migrations/` | PostgreSQL DDL |
| **Database RLS** | `supabase/migrations/*_rls.sql` | Row-Level Security policies |
| **Backend Functions** | `supabase/functions/` | Edge Functions (TypeScript) |
| **Database Triggers** | `supabase/migrations/*_triggers.sql` | Audit, notifications, etc. |

---

## Common Gotchas

### 1. RLS Policy Failures (403 Forbidden)

**Symptom**: Query works locally but fails in production with 403.

**Root Cause**: RLS policy doesn't match your user's permissions.

**Fix**:
```sql
-- Debug: Check which policy is blocking
-- In Supabase dashboard:
-- 1. Go to SQL Editor
-- 2. Check auth.uid() = <your-user-id>
-- 3. Verify project_members has your user

SELECT * FROM auth.users WHERE id = auth.uid();
SELECT * FROM project_members WHERE user_id = auth.uid();
```

### 2. Apollo Cache Inconsistencies

**Symptom**: Update mutation succeeds but UI doesn't update; stale data shown.

**Root Cause**: Apollo cache not updated with mutation result.

**Fix**:
```typescript
// In mutation, include refetchQueries:
const [updateTask] = useMutation(UPDATE_TASK, {
  refetchQueries: [
    { query: GET_TASKS, variables: { projectId } }
  ]
});

// Or manually update cache:
update(cache, { data }) {
  cache.modify({
    fields: {
      tasks(existing) {
        return existing.map(t => t.id === data.updateTask.id ? data.updateTask : t);
      }
    }
  });
}
```

### 3. Timezone Issues with Due Dates

**Symptom**: Due date shows as "Feb 10" but user expects "Feb 9".

**Root Cause**: Storing UTC DATE but not converting to user timezone.

**Fix**:
```typescript
// Store timezone with the date
const dueDate = new Date('2024-02-10T00:00:00Z');
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: userTimezone,  // e.g., 'America/Los_Angeles'
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});
return formatter.format(dueDate);
```

### 4. VITE_ Variables Undefined

**Symptom**: `import.meta.env.VITE_SUPABASE_URL` is undefined.

**Root Cause**: Variable not prefixed with `VITE_` in .env file.

**Fix**:
```bash
# .env
VITE_SUPABASE_URL=...     # ✅ Visible to frontend
SUPABASE_URL=...          # ❌ Not visible to Vite
```

### 5. Circular Dependencies in Hooks

**Symptom**: "Module not found" or import errors.

**Root Cause**: Hook imports component that imports hook → circular dependency.

**Fix**: Move shared logic to a utility function instead of hook.

```typescript
// ❌ Bad: Circular
// hooks/useTask.ts imports TaskCard.tsx
// TaskCard.tsx imports hooks/useTask.ts

// ✅ Good: Use utility
// utils/taskHelpers.ts (no hooks, no components)
// Hooks import from utils, components import hooks
```

---

## Summary

TaskFlow is a **type-safe, real-time collaborative platform** built on modern technologies. The architecture emphasizes:
- **Developer productivity** (TypeScript, GraphQL, type generation)
- **User experience** (real-time updates, responsive UI)
- **Security** (RLS at database layer, never bypass)
- **Scalability** (serverless backend, stateless frontend)

For detailed information about specific domains, see the `domains/*/CONTEXT.md` files.
