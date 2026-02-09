# TaskFlow Context Graph - Root Agent Instructions

## Project Summary

**TaskFlow** is a collaborative project management platform designed for remote teams. It enables teams to create projects, organize work into tasks, collaborate through comments and activity feeds, and manage file attachments. The platform emphasizes real-time collaboration, granular permissions, and seamless integration with external tools.

**Core Value Proposition**: Lightweight project management with real-time updates, powerful filtering/search, and team-based access control.

**Team**: 8 engineers, 2 product managers, 1 designer

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.2+ | UI framework with hooks |
| **Language** | TypeScript | 5.3+ | Type safety |
| **Build Tool** | Vite | 5.0+ | Fast development builds |
| **Styling** | Tailwind CSS | 3.3+ | Utility-first CSS framework |
| **State Management** | Zustand | 4.4+ | Global app state (UI, auth, filters) |
| **GraphQL Client** | Apollo Client | 3.8+ | Data fetching, caching, subscriptions |
| **Backend Database** | Supabase (PostgreSQL) | Latest | Primary data store with RLS |
| **Authentication** | Supabase Auth | - | Email/password, OAuth (Google, GitHub) |
| **File Storage** | Supabase Storage | - | File attachments (S3-compatible) |
| **Real-time** | Supabase Realtime | - | WebSocket subscriptions |
| **Email** | Resend | - | Notifications, digests |
| **Payments** | Stripe | - | Team subscription management |
| **Analytics** | PostHog | - | Product analytics |
| **Testing** | Vitest + React Testing Library | Latest | Unit and component tests |
| **E2E Testing** | Playwright | 1.40+ | End-to-end testing |
| **Package Manager** | pnpm | 8.0+ | Faster, disk-efficient |
| **Deployment** | Vercel | - | Frontend hosting |
| **Database Hosting** | Supabase Cloud | - | Managed PostgreSQL |

---

## Architectural Patterns

### 1. **Feature-Based Directory Organization**
The codebase is organized by feature/domain, not by layer. Each domain contains its own types, queries, components, and hooks.

```
src/
  features/
    projects/
      components/
      queries/
      hooks/
      types.ts
    tasks/
      components/
      queries/
      hooks/
      types.ts
```

**Rationale**: Easier to locate related code, better for team scalability, reduces merge conflicts.

### 2. **RLS-Based Multi-Tenancy**
All data isolation is handled at the database layer using PostgreSQL Row-Level Security policies. The frontend doesn't need to enforce permission checks; Supabase does.

```sql
-- Example: Users can only see tasks in projects they're members of
CREATE POLICY "users_see_project_tasks" ON tasks
  USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = auth.uid()
  ));
```

**Rationale**: Prevents authorization bugs, centralized security, scales better.

### 3. **GraphQL-First Data Layer**
All data fetching goes through Apollo Client with GraphQL queries/mutations. No raw API calls; no mixing of data sources.

```typescript
// Example
const TASKS_QUERY = gql`
  query GetTasks($projectId: UUID!) {
    tasks(where: { projectId: { eq: $projectId } }) {
      edges { node { id title status priority assigneeId } }
    }
  }
`;
```

**Rationale**: Type-safe, predictable, enables automatic caching.

### 4. **Zustand for UI State, Apollo for Data State**
- **Zustand**: UI state (sidebar open/closed, filter selections, active tabs)
- **Apollo Cache**: Server data (tasks, projects, users, comments)

Separation keeps concerns clear and prevents hydration mismatches.

**Rationale**: Clear state separation, easier to reason about, better debugging.

### 5. **Hooks-Based Component Architecture**
Heavy use of custom hooks to encapsulate logic. Components stay thin and focused on rendering.

```typescript
// hooks/useTaskFilters.ts
function useTaskFilters() {
  const filters = useAppStore(state => state.taskFilters);
  return filters;
}

// hooks/useAssignTask.ts
function useAssignTask() {
  const [assign, { loading }] = useMutation(ASSIGN_TASK_MUTATION);
  return { assign, loading };
}
```

**Rationale**: Reusability, easier testing, cleaner component files.

---

## Core Domains

### 1. **Projects**
- Containers for work
- Set-based access control (members have roles: owner, admin, member, guest)
- Visibility: private, team, public
- Has settings: name, description, color, icon, archived state

### 2. **Tasks**
- Atomic units of work within projects
- Full lifecycle: backlog → todo → in_progress → in_review → done → archived
- Properties: title, description, status, priority, assignee, due date, labels, story points
- Can have subtasks
- Support for bulk operations

### 3. **Comments**
- Narrative collaboration on tasks
- Rich text with @mentions, attachments
- Edit/delete with soft deletes
- Threaded replies

### 4. **Users**
- Workspace members with profiles
- Display name, avatar, email, status (online/offline)
- Preferences: theme, notifications, sidebar collapse

### 5. **Teams**
- Organization container
- Multiple projects per team
- Team-level roles and permissions
- Billing tied to team

### Supporting Systems

- **Notifications**: Email and in-app (mention, assignment, due date, status change)
- **Activity Feeds**: Task-level and project-level activity logs with filters
- **File Attachments**: Task and comment attachments, scanned for viruses

---

## Complete File Locations Tree

```
.
├── src/
│   ├── app.tsx                          # Root app component
│   ├── main.tsx                         # Entry point
│   ├── vite-env.d.ts                    # Vite type definitions
│   ├── index.css                        # Global styles
│   ├── hooks/                           # Shared hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── ...
│   ├── services/                        # Utility services (non-domain)
│   │   ├── apollo.ts                    # Apollo Client setup
│   │   ├── supabase.ts                  # Supabase client
│   │   ├── analytics.ts                 # PostHog integration
│   │   └── storage.ts                   # File storage helpers
│   ├── stores/                          # Zustand stores
│   │   ├── appStore.ts                  # Global app state
│   │   ├── authStore.ts                 # Auth state
│   │   └── filterStore.ts               # Filter state
│   ├── types/                           # Global types
│   │   ├── common.ts
│   │   └── graphql.ts                   # Generated GraphQL types
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── PasswordReset.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── SignupPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useSignup.ts
│   │   │   │   └── usePasswordReset.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectHeader.tsx
│   │   │   │   ├── ProjectSettings.tsx
│   │   │   │   └── ProjectMembersList.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ProjectsListPage.tsx
│   │   │   │   └── ProjectDetailPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProject.ts
│   │   │   │   ├── useProjectList.ts
│   │   │   │   ├── useCreateProject.ts
│   │   │   │   └── useProjectMembers.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── tasks/
│   │   │   ├── components/
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskDetailModal.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskBoard.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskFilters.tsx
│   │   │   │   ├── TaskStatusBadge.tsx
│   │   │   │   └── BulkTaskActions.tsx
│   │   │   ├── pages/
│   │   │   │   └── TasksPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTask.ts
│   │   │   │   ├── useTaskList.ts
│   │   │   │   ├── useTaskCreate.ts
│   │   │   │   ├── useTaskUpdate.ts
│   │   │   │   ├── useTaskFilters.ts
│   │   │   │   ├── useTaskBulkOps.ts
│   │   │   │   └── useTaskSearch.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── comments/
│   │   │   ├── components/
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   ├── CommentThread.tsx
│   │   │   │   ├── CommentForm.tsx
│   │   │   │   └── MentionAutocomplete.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useComments.ts
│   │   │   │   ├── useCreateComment.ts
│   │   │   │   ├── useEditComment.ts
│   │   │   │   └── useDeleteComment.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserAvatar.tsx
│   │   │   │   ├── UserCard.tsx
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   └── UserSettings.tsx
│   │   │   ├── pages/
│   │   │   │   └── ProfilePage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCurrentUser.ts
│   │   │   │   ├── useUserProfile.ts
│   │   │   │   └── useUpdateProfile.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── teams/
│   │   │   ├── components/
│   │   │   │   ├── TeamSwitcher.tsx
│   │   │   │   ├── TeamSettings.tsx
│   │   │   │   └── TeamMembersList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTeam.ts
│   │   │   │   ├── useTeamList.ts
│   │   │   │   └── useTeamMembers.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   │   ├── NotificationCenter.tsx
│   │   │   │   └── NotificationBell.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useNotifications.ts
│   │   │   │   └── useMarkAsRead.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── activity/
│   │   │   ├── components/
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── ActivityItem.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useActivityFeed.ts
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   └── files/
│   │       ├── components/
│   │       │   ├── FileUpload.tsx
│   │       │   ├── FileList.tsx
│   │       │   └── FilePreview.tsx
│   │       ├── hooks/
│   │       │   ├── useFileUpload.ts
│   │       │   └── useFileDelete.ts
│   │       ├── mutations.ts
│   │       └── types.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── components/                      # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── utils/
│   │   ├── cn.ts                        # classnames helper
│   │   ├── date.ts                      # Date formatting
│   │   ├── validation.ts                # Form validation
│   │   ├── colors.ts                    # Color utilities
│   │   └── ...
│   └── __tests__/
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── supabase/
│   ├── migrations/
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20240110000000_add_activity_logs.sql
│   │   ├── 20240120000000_add_notifications.sql
│   │   └── ...
│   ├── functions/
│   │   ├── create_activity_log/
│   │   │   └── index.ts
│   │   ├── send_notification/
│   │   │   └── index.ts
│   │   ├── process_attachments/
│   │   │   └── index.ts
│   │   └── ...
│   ├── seed.sql                         # Development seed data
│   ├── config.toml                      # Supabase config
│   └── .env.example
├── public/
│   └── ...
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── pnpm-lock.yaml
```

---

## Quick Reference

### Essential Commands

```bash
# Development
pnpm install
pnpm dev                    # Start dev server
pnpm dev:db                 # Start local Supabase

# Code generation
pnpm gen:types              # Generate GraphQL types from schema
pnpm gen:graphql            # Generate GraphQL operations

# Testing
pnpm test                   # Run unit tests
pnpm test:watch             # Watch mode
pnpm test:e2e               # Run Playwright E2E tests
pnpm test:coverage          # Coverage report

# Deployment
pnpm build                  # Production build
pnpm preview                # Preview production build

# Database
pnpm db:migrate             # Run pending migrations
pnpm db:seed                # Seed development data
pnpm db:reset               # Reset database (dev only)
```

### Key Zustand Stores

```typescript
// appStore - Global UI state
{
  sidebarOpen: boolean;
  activeTeamId: string | null;
  activeProjectId: string | null;
  theme: 'light' | 'dark';
  setSidebarOpen: (open: boolean) => void;
  setActiveTeam: (id: string) => void;
  setActiveProject: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// filterStore - Task/project filters
{
  taskFilters: {
    status?: TaskStatus[];
    priority?: Priority[];
    assigneeIds?: string[];
    labels?: string[];
    dueDateRange?: [Date, Date];
    searchText?: string;
  };
  setTaskFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
}

// authStore - Auth state
{
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}
```

### Common Hooks

```typescript
// Auth
useAuth()              // Current user + auth state
useLogout()            // Logout handler
useAuthGuard()         // Route guard wrapper

// Data fetching
useProject(id)         // Fetch single project
useProjectList()       // Fetch projects for current team
useTaskList(filters)   // Fetch tasks with filters
useComments(taskId)    // Fetch comments for task

// Mutations
useCreateTask()        // Create new task
useUpdateTask()        // Update task
useAssignTask()        // Assign task to user
useDeleteTask()        // Delete task

// Utilities
useLocalStorage(key)   // Persist state to localStorage
useDebounce(value)     // Debounced values
useAsync(fn)           // Async operation wrapper
```

---

## Coding Standards

### TypeScript

- **Strict mode enabled**: `strict: true` in `tsconfig.json`
- **No `any` types**: Use `unknown` and type guards instead
- **Explicit return types**: Always specify function return types
- **Type exports**: Export types from domain `types.ts` files

```typescript
// Good
export function processTask(task: Task): TaskViewModel {
  return { ...task, displayName: `${task.title} (${task.status})` };
}

// Bad - implicit return type, any parameter
export function processTask(task: any) {
  return { ...task };
}
```

### Component Naming

- **File names**: PascalCase for components, camelCase for hooks/utilities
- **Export as default**: Components exported as default from their files
- **Props interface**: Named as `${ComponentName}Props`

```typescript
// TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
}

export default function TaskCard({ task, onSelect }: TaskCardProps) {
  return <div onClick={() => onSelect?.(task)}>{task.title}</div>;
}
```

### GraphQL Operations

- **Fragment colocation**: Define fragments in the same file as the operation
- **Naming**: Prefix queries with `Get`, mutations with verbs (Create, Update, Delete)
- **Pagination**: Always include `pageInfo` for paginated results

```typescript
const TASKS_QUERY = gql`
  fragment TaskFields on Task {
    id
    title
    status
    priority
    assigneeId
  }

  query GetTasks($projectId: UUID!, $after: String) {
    tasks(projectId: $projectId, after: $after) {
      edges { node { ...TaskFields } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
```

### Error Handling

- **Try-catch for async**: Wrap async operations in try-catch
- **User feedback**: Show errors to users via toast notifications
- **Logging**: Log errors with context for debugging

```typescript
async function saveTask(task: Task) {
  try {
    await updateTaskMutation({ variables: { task } });
    toast.success('Task saved');
  } catch (error) {
    logger.error('Failed to save task', { task, error });
    toast.error('Failed to save task. Please try again.');
  }
}
```

### Testing

- **Unit tests**: For utilities, hooks, and business logic
- **Component tests**: Render and interact, test behavior not implementation
- **Mocking**: Mock Apollo Client and Supabase, not implementation details

```typescript
// Good: test behavior
render(<TaskCard task={mockTask} onSelect={onSelect} />);
fireEvent.click(screen.getByText(mockTask.title));
expect(onSelect).toHaveBeenCalledWith(mockTask);

// Bad: testing implementation
expect(component.state.isSelected).toBe(true);
```

---

## Context Navigation

### By Domain

| Domain | Purpose | Key Files | Owner |
|--------|---------|-----------|-------|
| **Auth** | Authentication & authorization | `src/features/auth/` | Backend team |
| **Projects** | Project management | `src/features/projects/` | Frontend team |
| **Tasks** | Task CRUD & lifecycle | `src/features/tasks/` | Full-stack team |
| **Comments** | Collaboration & threading | `src/features/comments/` | Frontend team |
| **Users** | User profiles & settings | `src/features/users/` | Frontend team |
| **Teams** | Organization & billing | `src/features/teams/` | Backend team |
| **Notifications** | Email & in-app alerts | `src/features/notifications/` | Backend team |
| **Activity** | Event logging & feeds | `src/features/activity/` | Backend team |
| **Files** | Attachment storage | `src/features/files/` | Backend team |

### By Type

| Type | Location | Purpose |
|------|----------|---------|
| **Pages** | `src/features/*/pages/` | Route-level components |
| **Components** | `src/features/*/components/` | Reusable UI pieces |
| **Hooks** | `src/features/*/hooks/` | Custom React hooks |
| **Queries** | `src/features/*/queries.ts` | GraphQL read operations |
| **Mutations** | `src/features/*/mutations.ts` | GraphQL write operations |
| **Types** | `src/features/*/types.ts` | TypeScript types/interfaces |
| **Migrations** | `supabase/migrations/` | Database schema changes |
| **Functions** | `supabase/functions/` | Server-side functions |

### By Concern

| Concern | Location | Notes |
|---------|----------|-------|
| **State Management** | `src/stores/` | Zustand stores for app state |
| **Data Fetching** | `src/services/apollo.ts` | Apollo Client setup |
| **Authentication** | `src/features/auth/` | Supabase Auth integration |
| **Database** | `supabase/migrations/` | PostgreSQL schema |
| **Styling** | `tailwind.config.js` + `src/index.css` | Tailwind configuration |
| **Type Definitions** | `src/types/` + `src/features/*/types.ts` | Global and domain types |
| **Testing** | `src/__tests__/` | Test files |

---

## Summary

TaskFlow uses a **feature-based architecture** with clear separation between UI (React), state (Zustand + Apollo), and data (Supabase). All team members should reference this guide when:

1. **Adding new features**: Follow the domain structure (create feature folder with components, hooks, queries)
2. **Querying data**: Use GraphQL via Apollo Client, never raw API calls
3. **Managing state**: UI state in Zustand, server data in Apollo cache
4. **Database changes**: Create migrations, ensure RLS policies
5. **Debugging**: Check Apollo DevTools, Supabase RLS logs, browser console

For more details, see domain-specific CONTEXT.md files in `src/features/*/CONTEXT.md`.
