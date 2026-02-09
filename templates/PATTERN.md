> **Type:** Pattern
> **Focus:** [critical/high/medium/low]
> **Owner:** [@team-member]
> **Status:** [draft/active/deprecated]

# [PatternName] Pattern

## Overview

[2-3 sentence description of what this pattern is, what problem it solves, and why it's useful. E.g., "The React Query pattern for data fetching provides consistent handling of async operations, caching, and error states. It separates data fetching logic from component rendering, making code more testable and maintainable."]

**Benefits:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Trade-offs:**
- [Trade-off 1]
- [Trade-off 2]

---

## When to Use / When NOT to Use

### When to Use This Pattern

✓ **Use this pattern when:**
- [Scenario 1 where pattern applies]
- [Scenario 2 where pattern applies]
- [Scenario 3 where pattern applies]
- [Condition that makes this pattern ideal]

### When NOT to Use This Pattern

✗ **Avoid this pattern when:**
- [Scenario where pattern is overkill]
- [Scenario where simpler solution exists]
- [Condition that makes pattern inappropriate]
- [Performance consideration that rules it out]

---

## Standard Implementation

### Basic Example

```typescript
// [Language-specific implementation]
// Example: React Query hook pattern

import { useQuery, useMutation } from '@tanstack/react-query';

export function use[EntityName]Query(id: string) {
  return useQuery({
    queryKey: ['[entity]', id],
    queryFn: async () => {
      const response = await fetch(`/api/[entities]/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function use[EntityName]Mutation() {
  return useMutation({
    mutationFn: async (data: [EntityType]) => {
      const response = await fetch('/api/[entities]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['[entity]'] });
    },
  });
}
```

### Usage in Component

```typescript
function [ComponentName]() {
  const { data, isLoading, error } = use[EntityName]Query(id);
  const { mutate, isPending } = use[EntityName]Mutation();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{data.name}</h1>
      <button
        onClick={() => mutate({ ...data, name: 'Updated' })}
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
```

---

## Variations

### Variation 1: [VariationName]

**When to use:** [Description of when to use this variation]

```typescript
// Implementation example
export function use[EntityName]QueryWithOptions(
  id: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: ['[entity]', id],
    queryFn: async () => { /* ... */ },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    refetchInterval: options?.refetchInterval,
  });
}
```

### Variation 2: [VariationName]

**When to use:** [Description of when to use this variation]

```typescript
// Implementation example
// [Code snippet showing alternative approach]
```

### Variation 3: [VariationName]

**When to use:** [Description of when to use this variation]

```typescript
// Implementation example
// [Code snippet showing alternative approach]
```

---

## Configuration Options

| Option | Type | Default | Description | Impact |
|--------|------|---------|-------------|--------|
| `[option1]` | `boolean` | `true` | [What it controls] | [Performance/behavior impact] |
| `[option2]` | `number` | `5000` | [What it controls] | [Performance/behavior impact] |
| `[option3]` | `string` | `'auto'` | [What it controls] | [Performance/behavior impact] |
| `[option4]` | `object` | `{}` | [What it controls] | [Performance/behavior impact] |

---

## Code Locations

### Standard Implementations

| Location | Purpose | Notes |
|----------|---------|-------|
| `src/patterns/[pattern-name]/` | Pattern definition | Core pattern code |
| `src/patterns/[pattern-name]/example.ts` | Basic example | Simple usage example |
| `src/patterns/[pattern-name]/advanced.ts` | Advanced example | Complex use case |

### Real-World Examples in Codebase

| File | Type | Example | Notes |
|------|------|---------|-------|
| `src/hooks/use[Feature]Query.ts` | Query hook | Data fetching with caching | Implements standard variation |
| `src/hooks/use[Feature]Mutation.ts` | Mutation hook | Create/update with optimistic updates | Implements variation with optimism |
| `src/components/[Feature]/Form.tsx` | Component | Form submission pattern | Uses mutation hook |
| `src/services/[service].ts` | Service | Batch operation pattern | Optimized for multiple operations |

---

## Best Practices

### Do ✓

- ✓ **Keep responsibilities clear** - Query for fetching, mutation for modifying
- ✓ **Handle all states** - Loading, success, error, empty
- ✓ **Invalidate appropriately** - Clear cache when data changes
- ✓ **Use composition** - Combine patterns for complex scenarios
- ✓ **Document assumptions** - Comment on expected data structure
- ✓ **Test state transitions** - Verify behavior in all states
- ✓ **Monitor performance** - Track query counts and cache hit rates

### Don't ✗

- ✗ **Don't mix fetching and business logic** - Keep them separate
- ✗ **Don't ignore error states** - Always show error UI
- ✗ **Don't over-cache** - Balance freshness and performance
- ✗ **Don't create side effects in renders** - Use proper lifecycle hooks
- ✗ **Don't update global state from effects** - Use context or state management
- ✗ **Don't hardcode API endpoints** - Use configuration or environment variables
- ✗ **Don't silently fail** - Log errors for debugging

---

## Anti-Patterns

### Anti-Pattern 1: Missing Error Boundaries

**Bad:**
```typescript
// No error handling - UI crashes on fetch failure
function BadComponent({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetch(`/api/items/${id}`).then(r => r.json()),
  });

  return <div>{data.name}</div>; // Crashes if data is undefined
}
```

**Good:**
```typescript
// Proper error handling
function GoodComponent({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorAlert error={error} />;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

### Anti-Pattern 2: Stale Data Without Invalidation

**Bad:**
```typescript
// Mutation doesn't invalidate query cache
const { mutate } = useMutation({
  mutationFn: updateItem,
  // Missing onSuccess invalidation
});
```

**Good:**
```typescript
// Mutation invalidates related queries
const { mutate } = useMutation({
  mutationFn: updateItem,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
    queryClient.invalidateQueries({ queryKey: ['item', id] });
  },
});
```

### Anti-Pattern 3: Race Conditions in Dependencies

**Bad:**
```typescript
// Dependent query doesn't disable when dependency unavailable
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
  queryKey: ['posts', user.id], // Runs with undefined user.id
  queryFn: () => fetchPosts(user.id),
});
```

**Good:**
```typescript
// Dependent query properly disabled
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: () => fetchPosts(user!.id),
  enabled: !!user?.id, // Only run when user loaded
});
```

---

## Error Handling

### Error Types and Strategies

| Error Type | Cause | Handling Strategy |
|-----------|-------|------------------|
| Network Error | Connection lost | Retry with exponential backoff |
| 4xx Error | Invalid request | Show validation error to user |
| 5xx Error | Server error | Retry with exponential backoff, fallback |
| Timeout | Request too slow | Use shorter timeout, increase for slow connections |
| Parsing Error | Invalid response format | Log and show generic error |

### Implementation Example

```typescript
export function use[EntityName]QueryWithErrorHandling(id: string) {
  return useQuery({
    queryKey: ['[entity]', id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/[entities]/${id}`, {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new NotFoundError('Entity not found');
          }
          throw new ApiError(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof TypeError) {
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times with exponential backoff
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## Testing

### Unit Test Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { use[EntityName]Query } from './use[EntityName]Query';

describe('use[EntityName]Query', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should fetch entity on mount', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      id: '123',
      name: 'Test Entity',
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => use[EntityName]Query('123'), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({
      id: '123',
      name: 'Test Entity',
    });
  });

  it('should handle errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => use[EntityName]Query('123'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});
```

### Mock Requirements

- Mock fetch/axios responses
- Mock error scenarios
- Mock network delays
- Mock authentication state
- Mock query client behavior

---

## Performance Considerations

### Memory Impact
- **Cache Size:** Configurable via `gcTime` (formerly `cacheTime`)
- **Optimization:** Set appropriate garbage collection time
- **Large Datasets:** Consider pagination or virtualization

### Network Impact
- **Request Frequency:** Controlled by `staleTime`
- **Optimization:** Batch requests when possible
- **Bandwidth:** Compression enabled by default in modern browsers

### CPU Impact
- **Query Normalization:** Dedup identical queries automatically
- **Optimization:** Avoid unnecessary re-renders with proper key selection

### Monitoring

```typescript
// Track query performance
useEffect(() => {
  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    console.log('Query event:', event.type, event.query.queryKey);
  });

  return () => unsubscribe();
}, []);
```

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

## Migration Guide

### From [OldPattern] to [PatternName]

**Step 1: Update imports**
```typescript
// Before
import { useOldFetch } from './hooks/useOldFetch';

// After
import { use[EntityName]Query } from './hooks/use[EntityName]Query';
```

**Step 2: Update hook configuration**
```typescript
// Before
const { data, loading } = useOldFetch('/api/endpoint', {
  cachePolicy: 'cache-and-network',
});

// After
const { data, isLoading } = use[EntityName]Query(id, {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
});
```

**Step 3: Update state handling**
```typescript
// Before
{loading && <Spinner />}
{error && <Error message={error.message} />}

// After
{isLoading && <Spinner />}
{error && <Error message={error.message} />}
```

**Testing migration:**
- Verify all tests still pass
- Check error boundary behavior
- Test loading states
- Verify cache invalidation

---

## Related Patterns

- **[RelatedPattern1]** - Pairs well with this pattern for [purpose]
- **[RelatedPattern2]** - Often used together for [purpose]
- **[RelatedPattern3]** - Alternative approach when [condition]

---

## Dependencies

### Requires
- `@tanstack/react-query` (if using React Query pattern)
- `typescript` v4.9+
- `react` v16.8+ (if using React hooks)

### Used By
- [ComponentName] - [purpose]
- [HookName] - [purpose]
- [ServiceName] - [purpose]

---

*Created: YYYY-MM-DD*
*Last Updated: YYYY-MM-DD*
