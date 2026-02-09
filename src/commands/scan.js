import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import chalk from "chalk";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Scan a codebase and generate skeleton context files
 * @param {Object} options - Command options
 * @param {string} options.dir - Project root directory
 * @param {string} options.src - Source directory relative to project root
 * @param {string} options.supabase - Supabase directory relative to project root
 * @param {boolean} options.dryRun - Preview without writing files
 */
export async function scan(options) {
  const {
    dir = ".",
    src = "src",
    supabase = "supabase",
    dryRun = false,
  } = options;

  const projectRoot = path.resolve(dir);
  const srcPath = path.join(projectRoot, src);
  const supabasePath = path.join(projectRoot, supabase);
  const contextPath = path.join(projectRoot, "context");

  // Validate project structure
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      chalk.red("✗ package.json not found in project root")
    );
    process.exit(1);
  }

  const spinner = ora().start();

  try {
    // ==========================================
    // Step 1: Detect Technology Stack
    // ==========================================
    spinner.text = "Detecting technology stack...";

    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    );
    const stack = detectTechStack(packageJson);

    spinner.succeed("Technology stack detected");

    // ==========================================
    // Step 2: Scan Source Directory
    // ==========================================
    spinner.start();
    spinner.text = "Scanning source directory...";

    const sourceStructure = {
      features: [],
      components: [],
      hooks: [],
      stores: [],
      graphql: [],
      types: [],
    };

    if (fs.existsSync(srcPath)) {
      await scanSourceDirectory(srcPath, sourceStructure, src);
    }

    spinner.succeed("Source directory scanned");

    // ==========================================
    // Step 3: Scan Supabase Directory
    // ==========================================
    spinner.start();
    spinner.text = "Scanning Supabase directory...";

    const supabaseStructure = {
      schemas: [],
      edgeFunctions: [],
      migrations: [],
    };

    if (fs.existsSync(supabasePath)) {
      await scanSupabaseDirectory(supabasePath, supabaseStructure);
    }

    spinner.succeed("Supabase directory scanned");

    // ==========================================
    // Step 4: Generate Skeleton Context Files
    // ==========================================
    spinner.start();
    spinner.text = "Generating skeleton context files...";

    const generatedFiles = [];

    if (!dryRun) {
      ensureContextDirectory(contextPath);
    }

    // Generate domain context files
    for (const domain of sourceStructure.features) {
      const filePath = path.join(
        contextPath,
        "domains",
        domain,
        "CONTEXT.md"
      );
      const content = generateDomainContext(domain, stack);
      generatedFiles.push({ path: filePath, type: "domain", content });
    }

    // Generate architecture files
    const systemOverviewPath = path.join(
      contextPath,
      "architecture",
      "SYSTEM_OVERVIEW.md"
    );
    const systemOverviewContent = generateSystemOverview(
      stack,
      sourceStructure,
      supabaseStructure
    );
    generatedFiles.push({
      path: systemOverviewPath,
      type: "architecture",
      content: systemOverviewContent,
    });

    // Generate data model if Supabase schemas exist
    if (supabaseStructure.schemas.length > 0) {
      const dataModelPath = path.join(
        contextPath,
        "architecture",
        "DATA_MODEL.md"
      );
      const dataModelContent = generateDataModel(supabaseStructure);
      generatedFiles.push({
        path: dataModelPath,
        type: "architecture",
        content: dataModelContent,
      });
    }

    // Generate infrastructure skeleton
    const infrastructurePath = path.join(
      contextPath,
      "architecture",
      "INFRASTRUCTURE.md"
    );
    const infrastructureContent = generateInfrastructure(stack, supabaseStructure);
    generatedFiles.push({
      path: infrastructurePath,
      type: "architecture",
      content: infrastructureContent,
    });

    // Generate patterns documentation
    const componentsPath = path.join(
      contextPath,
      "patterns",
      "COMPONENTS.md"
    );
    const componentsContent = generateComponentsPattern(
      stack,
      sourceStructure
    );
    generatedFiles.push({
      path: componentsPath,
      type: "patterns",
      content: componentsContent,
    });

    const formsPath = path.join(contextPath, "patterns", "FORMS.md");
    const formsContent = generateFormsPattern(stack);
    generatedFiles.push({
      path: formsPath,
      type: "patterns",
      content: formsContent,
    });

    const stateManagementPath = path.join(
      contextPath,
      "patterns",
      "STATE_MANAGEMENT.md"
    );
    const stateManagementContent = generateStateManagementPattern(
      stack,
      sourceStructure
    );
    generatedFiles.push({
      path: stateManagementPath,
      type: "patterns",
      content: stateManagementContent,
    });

    // Generate/update AGENTS.md
    const agentsPath = path.join(contextPath, "AGENTS.md");
    const agentsContent = generateAgentsMD(stack, sourceStructure, generatedFiles.length);
    generatedFiles.push({
      path: agentsPath,
      type: "root",
      content: agentsContent,
    });

    // Write files if not dry run
    if (!dryRun) {
      for (const file of generatedFiles) {
        const dir = path.dirname(file.path);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(file.path, file.content, "utf-8");
      }
    }

    spinner.succeed("Skeleton context files generated");

    // ==========================================
    // Print Summary
    // ==========================================
    printSummary(
      stack,
      sourceStructure,
      supabaseStructure,
      generatedFiles,
      dryRun
    );
  } catch (error) {
    spinner.fail(`Error during scan: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Detect technology stack from package.json
 */
function detectTechStack(packageJson) {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const stack = {
    framework: null,
    typescript: !!deps.typescript,
    react: deps.react ? deps.react.replace("^", "").replace("~", "") : null,
    buildTool: null,
    stateManagement: [],
    apiLayer: [],
    uiLibrary: [],
    testing: [],
    css: [],
    backend: [],
  };

  // Framework detection
  if (deps.next) stack.buildTool = "Next.js";
  else if (deps.vite) stack.buildTool = "Vite";
  else if (deps["react-scripts"]) stack.buildTool = "Create React App";

  // State management
  if (deps.zustand) stack.stateManagement.push("Zustand");
  if (deps.redux || deps["@reduxjs/toolkit"])
    stack.stateManagement.push("Redux");
  if (deps.mobx) stack.stateManagement.push("MobX");
  if (deps.jotai) stack.stateManagement.push("Jotai");
  if (deps.recoil) stack.stateManagement.push("Recoil");

  // API layer
  if (deps["@apollo/client"]) stack.apiLayer.push("Apollo Client");
  if (deps["react-query"] || deps["@tanstack/react-query"])
    stack.apiLayer.push("React Query");
  if (deps.trpc || deps["@trpc/client"]) stack.apiLayer.push("tRPC");
  if (deps.axios) stack.apiLayer.push("Axios");
  if (deps.graphql) stack.apiLayer.push("GraphQL");

  // UI Libraries
  if (deps["@shadcn/ui"]) stack.uiLibrary.push("shadcn/ui");
  if (deps["@mui/material"]) stack.uiLibrary.push("Material-UI");
  if (deps["@chakra-ui/react"]) stack.uiLibrary.push("Chakra UI");
  if (deps.antd) stack.uiLibrary.push("Ant Design");

  // Testing
  if (deps.vitest) stack.testing.push("Vitest");
  if (deps.jest) stack.testing.push("Jest");
  if (deps["@playwright/test"]) stack.testing.push("Playwright");
  if (deps.cypress) stack.testing.push("Cypress");

  // CSS
  if (deps.tailwindcss) stack.css.push("Tailwind CSS");
  if (deps["styled-components"]) stack.css.push("Styled Components");
  if (deps["@emotion/react"]) stack.css.push("Emotion");
  if (deps.sass) stack.css.push("SASS/SCSS");

  // Backend
  if (deps["@supabase/supabase-js"]) stack.backend.push("Supabase");
  if (deps.firebase) stack.backend.push("Firebase");
  if (deps["@prisma/client"]) stack.backend.push("Prisma");

  return stack;
}

/**
 * Scan source directory for features, components, hooks, etc.
 */
async function scanSourceDirectory(srcPath, structure, srcDir) {
  // Scan for feature domains
  const featurePaths = [
    path.join(srcPath, "features"),
    path.join(srcPath, "modules"),
    path.join(srcPath, "domains"),
  ];

  for (const featurePath of featurePaths) {
    if (fs.existsSync(featurePath)) {
      const entries = fs.readdirSync(featurePath);
      for (const entry of entries) {
        const fullPath = path.join(featurePath, entry);
        if (fs.statSync(fullPath).isDirectory()) {
          structure.features.push(entry);
        }
      }
      break; // Use first existing directory
    }
  }

  // Scan for pages (Next.js style)
  const pagesPath = path.join(srcPath, "pages");
  if (fs.existsSync(pagesPath)) {
    const entries = fs.readdirSync(pagesPath);
    for (const entry of entries) {
      if (
        entry !== "_app.tsx" &&
        entry !== "_document.tsx" &&
        !entry.startsWith("_")
      ) {
        const name = entry.replace(/\.(tsx?|jsx?)$/, "");
        if (!structure.features.includes(name)) {
          structure.features.push(name);
        }
      }
    }
  }

  // Scan for components
  const componentsPath = path.join(srcPath, "components");
  if (fs.existsSync(componentsPath)) {
    const files = await glob(`${componentsPath}/**/*.{tsx,ts,jsx,js}`, {
      nodir: true,
    });
    structure.components = files
      .map((f) => path.relative(componentsPath, f))
      .filter((f) => !f.includes("index"))
      .slice(0, 10); // Limit to first 10
  }

  // Scan for hooks
  const hooksPaths = [
    path.join(srcPath, "hooks"),
    path.join(srcPath, "hooks-next"),
  ];
  for (const hooksPath of hooksPaths) {
    if (fs.existsSync(hooksPath)) {
      const files = await glob(`${hooksPath}/**/*.{tsx,ts,jsx,js}`, {
        nodir: true,
      });
      structure.hooks = files
        .map((f) => path.basename(f, path.extname(f)))
        .filter((f) => f.startsWith("use"));
      break;
    }
  }

  // Scan for stores
  const storePaths = [
    path.join(srcPath, "stores"),
    path.join(srcPath, "store"),
  ];
  for (const storePath of storePaths) {
    if (fs.existsSync(storePath)) {
      const files = await glob(`${storePath}/**/*.{tsx,ts,jsx,js}`, {
        nodir: true,
      });
      structure.stores = files
        .map((f) => path.basename(f, path.extname(f)))
        .filter((f) => f !== "index");
      break;
    }
  }

  // Scan for GraphQL files
  const graphqlPatterns = [
    `${srcPath}/**/*.graphql`,
    `${srcPath}/**/*.gql`,
    `${srcPath}/**/graphql.ts`,
    `${srcPath}/**/queries.ts`,
    `${srcPath}/**/mutations.ts`,
  ];
  for (const pattern of graphqlPatterns) {
    const files = await glob(pattern);
    if (files.length > 0) {
      structure.graphql = files.map((f) => path.relative(srcPath, f));
    }
  }

  // Scan for type definitions
  const typeFiles = await glob(`${srcPath}/**/*.types.ts`);
  structure.types = typeFiles.map((f) => path.relative(srcPath, f));
}

/**
 * Scan Supabase directory for schemas, functions, and migrations
 */
async function scanSupabaseDirectory(supabasePath, structure) {
  // Scan for schemas
  const schemasPath = path.join(supabasePath, "schemas");
  if (fs.existsSync(schemasPath)) {
    const entries = fs.readdirSync(schemasPath);
    structure.schemas = entries.filter((e) => fs.statSync(path.join(schemasPath, e)).isDirectory());
  }

  // Scan for edge functions
  const functionsPath = path.join(supabasePath, "functions");
  if (fs.existsSync(functionsPath)) {
    const entries = fs.readdirSync(functionsPath);
    structure.edgeFunctions = entries
      .filter((e) => fs.statSync(path.join(functionsPath, e)).isDirectory())
      .map((e) => e);
  }

  // Scan for migrations
  const migrationsPath = path.join(supabasePath, "migrations");
  if (fs.existsSync(migrationsPath)) {
    const files = await glob(`${migrationsPath}/**/*.sql`);
    structure.migrations = files.map((f) =>
      path.basename(f, path.extname(f))
    );
  }
}

/**
 * Ensure context directory exists
 */
function ensureContextDirectory(contextPath) {
  const dirs = [
    contextPath,
    path.join(contextPath, "domains"),
    path.join(contextPath, "architecture"),
    path.join(contextPath, "patterns"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Generate domain context file
 */
function generateDomainContext(domain, stack) {
  const timestamp = new Date().toISOString();

  return `# ${capitalizeWords(domain)} Domain Context

Generated: ${timestamp}

## Overview

The **${capitalizeWords(domain)}** domain encapsulates all functionality related to ${domain}.

## Key Concepts

- Primary responsibility: Define what this domain owns
- Data model: Describe main entities
- Key behaviors: List primary operations

## Domain Components

### Entity Models

Define core data structures for this domain.

### Stores/State

Describe state management for this domain.

### API Endpoints

Document GraphQL/REST endpoints for this domain.

### Business Rules

- Rule 1: Describe important invariants
- Rule 2: Describe validation rules

## Dependencies

### Internal Dependencies

- List other domains this depends on

### External Dependencies

- ${stack.backend.length > 0 ? stack.backend.join(", ") : "Backend services"}
- ${stack.apiLayer.length > 0 ? stack.apiLayer.join(", ") : "API clients"}

## Testing Strategy

- Unit tests: Focus on business logic
- Integration tests: Domain interactions
- E2E tests: User workflows

## Future Improvements

- [ ] Document planned features
- [ ] Note technical debt
- [ ] Link to related issues/discussions

---

Last updated: ${timestamp}
`;
}

/**
 * Generate system overview
 */
function generateSystemOverview(stack, sourceStructure, supabaseStructure) {
  const timestamp = new Date().toISOString();
  const domains = sourceStructure.features
    .map((d) => `- ${capitalizeWords(d)}`)
    .join("\n") || "- (No domains detected)";

  return `# System Overview

Generated: ${timestamp}

## Technology Stack

### Core Framework
- **Framework**: ${stack.buildTool || "Not detected"}
- **React**: ${stack.react || "Not detected"}
- **TypeScript**: ${stack.typescript ? "Yes" : "No"}

### State Management
${stack.stateManagement.length > 0 ? stack.stateManagement.map((s) => `- ${s}`).join("\n") : "- No state management library detected"}

### API Layer
${stack.apiLayer.length > 0 ? stack.apiLayer.map((a) => `- ${a}`).join("\n") : "- Using plain fetch or custom implementation"}

### UI Library
${stack.uiLibrary.length > 0 ? stack.uiLibrary.map((u) => `- ${u}`).join("\n") : "- No component library detected"}

### Styling
${stack.css.length > 0 ? stack.css.map((c) => `- ${c}`).join("\n") : "- CSS modules or inline styles"}

### Testing
${stack.testing.length > 0 ? stack.testing.map((t) => `- ${t}`).join("\n") : "- Testing framework not detected"}

### Backend Services
${stack.backend.length > 0 ? stack.backend.map((b) => `- ${b}`).join("\n") : "- Backend integration not detected"}

## Project Structure

### Domains
${domains}

### Key Directories
- **components**: Shared React components
- **hooks**: Custom React hooks
- **stores**: State management stores
- **types**: TypeScript type definitions
- **utils**: Utility functions

## Key Patterns

### Component Architecture
Describe component hierarchy and patterns used.

### Data Flow
Explain how data flows through the application.

### State Management Pattern
Document how state is managed across domains.

## Integration Points

### External APIs
Document external service integrations.

### Authentication
Describe auth mechanism and flow.

### Database
${supabaseStructure.schemas.length > 0 ? "Supabase schemas are documented in DATA_MODEL.md" : "Database not configured"}

## Performance Considerations

- Document performance optimizations
- Note key metrics to monitor
- Identify potential bottlenecks

---

Last updated: ${timestamp}
`;
}

/**
 * Generate data model documentation
 */
function generateDataModel(supabaseStructure) {
  const timestamp = new Date().toISOString();
  const schemas = supabaseStructure.schemas
    .map((s) => `- **${capitalizeWords(s)}**: Document schema tables and relationships`)
    .join("\n") || "- No schemas detected";

  const migrations = supabaseStructure.migrations
    .slice(0, 5)
    .map((m) => `- ${m}`)
    .join("\n") || "- No migrations found";

  return `# Data Model

Generated: ${timestamp}

## Schemas

${schemas}

## Tables & Relationships

### Schema Overview

Document the primary entities and their relationships.

\`\`\`
Entity1 --hasMany--> Entity2
Entity1 --hasOne--> Entity3
\`\`\`

## Key Entities

### Entity 1

- **Fields**: id, name, created_at
- **Relationships**: References to other entities
- **Indexes**: Optimization notes

### Entity 2

- **Fields**: List fields
- **Relationships**: Document relationships
- **Constraints**: Describe business constraints

## Recent Migrations

${migrations}

## Migration Strategy

- Document migration approach
- Note any pending migrations
- Describe rollback procedures

## Data Integrity Rules

- Primary keys and uniqueness constraints
- Foreign key relationships
- Check constraints and validations

## Backup & Recovery

- Document backup strategy
- Recovery procedures
- Point-in-time recovery options

---

Last updated: ${timestamp}
`;
}

/**
 * Generate infrastructure documentation
 */
function generateInfrastructure(stack, supabaseStructure) {
  const timestamp = new Date().toISOString();
  const edgeFunctions = supabaseStructure.edgeFunctions
    .slice(0, 5)
    .map((f) => `- ${f}: Document function purpose`)
    .join("\n") || "- No edge functions detected";

  return `# Infrastructure

Generated: ${timestamp}

## Deployment

### Environments

- **Development**: Local environment setup
- **Staging**: Staging environment details
- **Production**: Production deployment info

### Build & Release

- Build process documentation
- Release procedure
- Rollback procedures

## Backend Services

${stack.backend.map((b) => `### ${b}\n- Configuration\n- Key endpoints\n- Authentication`).join("\n\n")}

## Edge Functions

${edgeFunctions}

## Monitoring & Logging

- Application metrics
- Error tracking
- Performance monitoring
- Log aggregation

## Security

- Authentication mechanism
- Authorization & RBAC
- Secrets management
- Compliance requirements

## Scaling & Performance

- Horizontal scaling strategy
- Caching strategy
- Database optimization
- API rate limiting

---

Last updated: ${timestamp}
`;
}

/**
 * Generate components pattern documentation
 */
function generateComponentsPattern(stack, sourceStructure) {
  const timestamp = new Date().toISOString();
  const componentList = sourceStructure.components
    .slice(0, 5)
    .map((c) => `- **${path.basename(c, path.extname(c))}**: ${path.dirname(c)}`)
    .join("\n") || "- No components scanned";

  return `# Component Patterns

Generated: ${timestamp}

## Component Architecture

### Shared Components

${componentList}

### Component Composition

Document how components are composed together.

## Naming Conventions

- Component file naming: \`ComponentName.tsx\`
- Props interface naming: \`ComponentNameProps\`
- Test file naming: \`ComponentName.test.tsx\`

## Props Pattern

\`\`\`typescript
interface ComponentProps {
  // Required props
  required: string;
  // Optional props
  optional?: string;
  // Event handlers
  onAction?: () => void;
}
\`\`\`

## Styling Approach

${stack.css.map((s) => `- ${s}: Styling methodology`).join("\n")}

## UI Library Patterns

${stack.uiLibrary.length > 0 ? stack.uiLibrary.map((lib) => `- ${lib}: Component usage patterns`).join("\n") : "- No UI library detected"}

## Reusable Component Categories

### Atomic Components
- Basic building blocks

### Composite Components
- Complex, reusable components

### Layout Components
- Page structure and layout

## Component Best Practices

- Keep components small and focused
- Use composition over inheritance
- Separate presentational from container components
- Document prop types clearly

---

Last updated: ${timestamp}
`;
}

/**
 * Generate forms pattern documentation
 */
function generateFormsPattern(stack) {
  const timestamp = new Date().toISOString();

  return `# Forms Pattern

Generated: ${timestamp}

## Form Handling

### Form State Management

Document how form state is managed:
- Local component state
- External state management (${stack.stateManagement.join(", ") || "None detected"})
- Form library patterns

### Form Libraries

- Form library choices and rationale
- Integration patterns
- Custom form hooks

## Validation

### Validation Strategy

- Client-side validation
- Server-side validation
- Real-time vs on-submit validation

### Common Patterns

\`\`\`typescript
// Validation schema pattern
const schema = {
  email: { required: true, pattern: 'email' },
  password: { required: true, minLength: 8 }
};
\`\`\`

## Form Component Structure

### Input Components

- Text inputs
- Selects/dropdowns
- Checkboxes and radio buttons
- Date pickers
- File uploads

### Layout Patterns

- Label positioning
- Error message display
- Helper text
- Required field indicators

## Error Handling

- Error message display
- Field-level error handling
- Form-level error handling
- Server error mapping

## Submission Flow

1. Validate form
2. Show loading state
3. Submit to server
4. Handle success/error
5. Update UI accordingly

## Accessibility

- Label associations
- ARIA attributes
- Keyboard navigation
- Error announcements

---

Last updated: ${timestamp}
`;
}

/**
 * Generate state management pattern documentation
 */
function generateStateManagementPattern(stack, sourceStructure) {
  const timestamp = new Date().toISOString();
  const stores = sourceStructure.stores
    .slice(0, 5)
    .map((s) => `- **${capitalizeWords(s)}**: Describe store purpose`)
    .join("\n") || "- No stores detected";

  const stateLib = stack.stateManagement.length > 0
    ? stack.stateManagement.join(", ")
    : "No state management detected";

  return `# State Management Pattern

Generated: ${timestamp}

## State Management Library

Using: ${stateLib}

## Store Architecture

### Stores
${stores}

## Store Structure

### Store Definition

\`\`\`typescript
interface StoreState {
  // State properties
}

interface StoreActions {
  // Action methods
}
\`\`\`

### Store Selectors

- Selector pattern for state access
- Memoization strategy
- Performance optimization

## Global State

Document what goes into global state:
- User/auth state
- App configuration
- Theme preferences
- Global UI state

## Local State vs Global State

### When to use local state
- Component-specific data
- Temporary UI state
- Form data

### When to use global state
- User information
- Authentication state
- Shared domain data
- App preferences

## Async Operations

### Data Fetching

- Loading state management
- Error handling
- Data caching
- Refetching strategy

### Side Effects

- Action triggers
- Event listeners
- Cleanup patterns

## Debugging

- Redux DevTools integration (if applicable)
- Time-travel debugging
- State inspection tools
- Logging strategy

---

Last updated: ${timestamp}
`;
}

/**
 * Generate AGENTS.md file
 */
function generateAgentsMD(stack, sourceStructure, fileCount) {
  const timestamp = new Date().toISOString();

  return `# Agent Context Configuration

Generated: ${timestamp}

## Quick Start for AI Agents

This context graph enables Claude, Cursor, and other AI agents to understand your codebase structure, architecture, and patterns.

### What's Documented

- **System Overview** (\`architecture/SYSTEM_OVERVIEW.md\`): High-level architecture and tech stack
- **Data Model** (\`architecture/DATA_MODEL.md\`): Database schema and data relationships
- **Infrastructure** (\`architecture/INFRASTRUCTURE.md\`): Deployment, services, and operations
- **Component Patterns** (\`patterns/COMPONENTS.md\`): React component architecture
- **Form Patterns** (\`patterns/FORMS.md\`): Form handling and validation
- **State Management** (\`patterns/STATE_MANAGEMENT.md\`): State management patterns
- **Domain Contexts** (\`domains/{domain}/CONTEXT.md\`): Feature domain documentation

### Technology Stack

**Framework & Build**
- Build Tool: ${stack.buildTool || "Not detected"}
- React: ${stack.react || "Not detected"}
- TypeScript: ${stack.typescript ? "Yes" : "No"}

**State Management**
${stack.stateManagement.length > 0 ? stack.stateManagement.map((s) => `- ${s}`).join("\n") : "- Not configured"}

**API Layer**
${stack.apiLayer.length > 0 ? stack.apiLayer.map((a) => `- ${a}`).join("\n") : "- Using default fetch/axios"}

**UI & Styling**
${stack.uiLibrary.length > 0 ? stack.uiLibrary.map((u) => `- ${u}`).join("\n") : "- Component library not configured"}

${stack.css.length > 0 ? "\n**CSS**\n" + stack.css.map((c) => `- ${c}`).join("\n") : ""}

**Testing**
${stack.testing.length > 0 ? stack.testing.map((t) => `- ${t}`).join("\n") : "- Testing framework not configured"}

**Backend**
${stack.backend.length > 0 ? stack.backend.map((b) => `- ${b}`).join("\n") : "- Backend not configured"}

### Project Domains

The following feature domains have been identified:

${sourceStructure.features.length > 0
  ? sourceStructure.features.map((f) => `- **${capitalizeWords(f)}** (\`domains/${f}/CONTEXT.md\`)`).join("\n")
  : "- No feature domains detected"
}

### Key Patterns to Know

1. **Component Organization**: Shared components in \`src/components/\`, domain-specific in domain folders
2. **State Pattern**: ${stack.stateManagement.length > 0 ? stack.stateManagement[0] : "Custom implementation"}
3. **API Communication**: ${stack.apiLayer.length > 0 ? stack.apiLayer[0] : "Fetch/Axios"}
4. **Styling**: ${stack.css.length > 0 ? stack.css[0] : "CSS modules"}

### Before Making Changes

When an agent encounters a task:

1. **Understand the Domain**: Read the relevant \`domains/{domain}/CONTEXT.md\`
2. **Check Architecture**: Review \`architecture/SYSTEM_OVERVIEW.md\` for big picture
3. **Follow Patterns**: Use \`patterns/*.md\` to understand coding conventions
4. **Check Data Model**: Review \`architecture/DATA_MODEL.md\` for data structures
5. **Look for Examples**: Search existing code in the specified domain

### File Structure Generated

Total context files generated: ${fileCount}

Generated: ${timestamp}

---

**Note**: Update this file manually as your architecture evolves. Run \`context-graph-generator scan\` to refresh detected tech stack and domains.
`;
}

/**
 * Print summary of scan results
 */
function printSummary(stack, sourceStructure, supabaseStructure, generatedFiles, dryRun) {
  console.log("\n");
  console.log(chalk.bold("========================================"));
  console.log(chalk.bold.cyan("  Context Graph Generator Scan Summary"));
  console.log(chalk.bold("========================================"));

  console.log("\n" + chalk.bold("Technology Stack:"));
  console.log(`  Framework: ${chalk.cyan(stack.buildTool || "Not detected")}`);
  console.log(`  React: ${chalk.cyan(stack.react || "Not detected")}`);
  console.log(`  TypeScript: ${chalk.cyan(stack.typescript ? "Yes" : "No")}`);

  if (stack.stateManagement.length > 0) {
    console.log(
      `  State Management: ${chalk.cyan(stack.stateManagement.join(", "))}`
    );
  }
  if (stack.apiLayer.length > 0) {
    console.log(`  API Layer: ${chalk.cyan(stack.apiLayer.join(", "))}`);
  }
  if (stack.uiLibrary.length > 0) {
    console.log(`  UI Library: ${chalk.cyan(stack.uiLibrary.join(", "))}`);
  }
  if (stack.backend.length > 0) {
    console.log(`  Backend: ${chalk.cyan(stack.backend.join(", "))}`);
  }

  console.log("\n" + chalk.bold("Source Structure:"));
  console.log(
    `  Features/Domains: ${chalk.cyan(sourceStructure.features.length)} found`
  );
  sourceStructure.features.forEach((f) => {
    console.log(`    - ${f}`);
  });

  console.log(
    `  Components: ${chalk.cyan(sourceStructure.components.length)} found`
  );
  console.log(`  Hooks: ${chalk.cyan(sourceStructure.hooks.length)} found`);
  console.log(`  Stores: ${chalk.cyan(sourceStructure.stores.length)} found`);
  console.log(
    `  GraphQL: ${chalk.cyan(supabaseStructure.schemas.length)} files found`
  );

  console.log("\n" + chalk.bold("Supabase Structure:"));
  console.log(
    `  Schemas: ${chalk.cyan(supabaseStructure.schemas.length)} found`
  );
  console.log(
    `  Edge Functions: ${chalk.cyan(supabaseStructure.edgeFunctions.length)} found`
  );
  console.log(
    `  Migrations: ${chalk.cyan(supabaseStructure.migrations.length)} found`
  );

  console.log("\n" + chalk.bold("Generated Files:"));
  console.log(`  Total files: ${chalk.cyan(generatedFiles.length)}`);

  const byType = {};
  for (const file of generatedFiles) {
    byType[file.type] = (byType[file.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(byType)) {
    console.log(`    ${type}: ${chalk.cyan(count)}`);
  }

  if (!dryRun) {
    console.log("\n" + chalk.green("✓ Context files written to ./context/"));
  } else {
    console.log("\n" + chalk.yellow("(DRY RUN - no files written)"));
  }

  console.log("\n" + chalk.bold("Next Steps:"));
  console.log(
    "  1. Review generated files in ./context/architecture/ and ./context/domains/"
  );
  console.log("  2. Fill in template sections with actual documentation");
  console.log("  3. Run 'context-graph-generator verify' to check completeness");
  console.log(
    "  4. Use AGENTS.md as the entry point for AI agent context\n"
  );
}

/**
 * Capitalize each word in a string
 */
function capitalizeWords(str) {
  return str
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
