import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import chalk from "chalk";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Scan a codebase and generate skeleton context files.
 * Supports: Next.js (App Router & Pages Router), React Native, Expo,
 * Supabase, Prisma, Drizzle, Firebase, MongoDB, and standard React apps.
 *
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
      screens: [],
      apiRoutes: [],
      navigation: [],
      services: [],
      pages: [],
    };

    // Scan primary source directory (src/)
    if (fs.existsSync(srcPath)) {
      await scanSourceDirectory(srcPath, sourceStructure, src);
    }

    // Scan project root for framework-specific directories
    await scanFrameworkDirectories(projectRoot, sourceStructure, stack);

    spinner.succeed("Source directory scanned");

    // ==========================================
    // Step 3: Scan Backend / Database Directory
    // ==========================================
    spinner.start();
    spinner.text = "Scanning backend and database directories...";

    const backendStructure = {
      schemas: [],
      edgeFunctions: [],
      migrations: [],
      prismaModels: [],
      apiRoutes: [],
      serverActions: [],
      backendType: null, // supabase | prisma | drizzle | firebase | custom
    };

    // Scan Supabase directory
    if (fs.existsSync(supabasePath)) {
      await scanSupabaseDirectory(supabasePath, backendStructure);
      backendStructure.backendType = "supabase";
    }

    // Scan Prisma schema
    const prismaSchemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    if (fs.existsSync(prismaSchemaPath)) {
      backendStructure.backendType = backendStructure.backendType || "prisma";
      const prismaContent = fs.readFileSync(prismaSchemaPath, "utf-8");
      const modelMatches = prismaContent.match(/model\s+(\w+)\s*\{/g);
      if (modelMatches) {
        backendStructure.prismaModels = modelMatches.map((m) => m.replace(/model\s+/, "").replace(/\s*\{/, ""));
      }
      // Scan Prisma migrations
      const prismaMigrationsPath = path.join(projectRoot, "prisma", "migrations");
      if (fs.existsSync(prismaMigrationsPath)) {
        const entries = fs.readdirSync(prismaMigrationsPath);
        backendStructure.migrations = entries.filter((e) =>
          fs.statSync(path.join(prismaMigrationsPath, e)).isDirectory()
        );
      }
    }

    // Scan Drizzle schema
    const drizzlePaths = [
      path.join(projectRoot, "drizzle"),
      path.join(projectRoot, "src", "db"),
      path.join(projectRoot, "src", "schema"),
    ];
    for (const dp of drizzlePaths) {
      if (fs.existsSync(dp)) {
        backendStructure.backendType = backendStructure.backendType || "drizzle";
        break;
      }
    }

    // Scan Next.js API routes
    const apiRoutePaths = [
      path.join(projectRoot, "app", "api"),
      path.join(projectRoot, "src", "app", "api"),
      path.join(projectRoot, "pages", "api"),
      path.join(projectRoot, "src", "pages", "api"),
    ];
    for (const apiPath of apiRoutePaths) {
      if (fs.existsSync(apiPath)) {
        const files = await glob(`${apiPath}/**/*.{ts,tsx,js,jsx}`, { nodir: true });
        backendStructure.apiRoutes = files.map((f) => path.relative(projectRoot, f));
        break;
      }
    }

    spinner.succeed("Backend and database directories scanned");

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
      backendStructure
    );
    generatedFiles.push({
      path: systemOverviewPath,
      type: "architecture",
      content: systemOverviewContent,
    });

    // Generate data model if database schemas/models exist
    const hasDataModel = backendStructure.schemas.length > 0 ||
      backendStructure.prismaModels.length > 0 ||
      stack.database.length > 0;
    if (hasDataModel) {
      const dataModelPath = path.join(
        contextPath,
        "architecture",
        "DATA_MODEL.md"
      );
      const dataModelContent = generateDataModel(backendStructure, stack);
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
    const infrastructureContent = generateInfrastructure(stack, backendStructure);
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
      backendStructure,
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
    platform: "web", // web | mobile | universal
    typescript: !!deps.typescript,
    react: deps.react ? deps.react.replace("^", "").replace("~", "") : null,
    buildTool: null,
    stateManagement: [],
    apiLayer: [],
    uiLibrary: [],
    testing: [],
    css: [],
    backend: [],
    navigation: [],
    database: [],
  };

  // Framework detection (order matters: most specific first)
  if (deps["react-native"] && deps.expo) {
    stack.framework = "Expo";
    stack.platform = deps["react-native-web"] ? "universal" : "mobile";
  } else if (deps.expo) {
    stack.framework = "Expo";
    stack.platform = deps["react-native-web"] ? "universal" : "mobile";
  } else if (deps["react-native"]) {
    stack.framework = "React Native";
    stack.platform = deps["react-native-web"] ? "universal" : "mobile";
  } else if (deps.next) {
    stack.framework = "Next.js";
    stack.platform = "web";
  }

  // Build tool (separate from framework)
  if (deps.next) stack.buildTool = "Next.js";
  else if (deps.vite) stack.buildTool = "Vite";
  else if (deps["react-scripts"]) stack.buildTool = "Create React App";
  else if (deps.expo) stack.buildTool = "Expo CLI";
  else if (deps["@expo/metro-runtime"] || deps["metro"]) stack.buildTool = "Metro";

  // Navigation (critical for mobile and Next.js)
  if (deps["@react-navigation/native"]) stack.navigation.push("React Navigation");
  if (deps["@react-navigation/stack"]) stack.navigation.push("Stack Navigator");
  if (deps["@react-navigation/bottom-tabs"]) stack.navigation.push("Bottom Tabs");
  if (deps["@react-navigation/drawer"]) stack.navigation.push("Drawer Navigator");
  if (deps["expo-router"]) stack.navigation.push("Expo Router");
  if (deps.next) stack.navigation.push("Next.js File-based Routing");

  // State management
  if (deps.zustand) stack.stateManagement.push("Zustand");
  if (deps.redux || deps["@reduxjs/toolkit"])
    stack.stateManagement.push("Redux");
  if (deps.mobx) stack.stateManagement.push("MobX");
  if (deps.jotai) stack.stateManagement.push("Jotai");
  if (deps.recoil) stack.stateManagement.push("Recoil");
  if (deps["@legendapp/state"]) stack.stateManagement.push("Legend State");

  // API layer
  if (deps["@apollo/client"]) stack.apiLayer.push("Apollo Client");
  if (deps["react-query"] || deps["@tanstack/react-query"])
    stack.apiLayer.push("React Query");
  if (deps.trpc || deps["@trpc/client"]) stack.apiLayer.push("tRPC");
  if (deps.axios) stack.apiLayer.push("Axios");
  if (deps.graphql) stack.apiLayer.push("GraphQL");
  if (deps.swr) stack.apiLayer.push("SWR");

  // UI Libraries (web)
  if (deps["@shadcn/ui"]) stack.uiLibrary.push("shadcn/ui");
  if (deps["@mui/material"]) stack.uiLibrary.push("Material-UI");
  if (deps["@chakra-ui/react"]) stack.uiLibrary.push("Chakra UI");
  if (deps.antd) stack.uiLibrary.push("Ant Design");

  // UI Libraries (mobile)
  if (deps["react-native-paper"]) stack.uiLibrary.push("React Native Paper");
  if (deps["native-base"] || deps["@gluestack-ui/themed"]) stack.uiLibrary.push("GlueStack UI");
  if (deps.tamagui) stack.uiLibrary.push("Tamagui");
  if (deps["@rneui/themed"]) stack.uiLibrary.push("React Native Elements");
  if (deps["react-native-elements"]) stack.uiLibrary.push("React Native Elements");

  // Testing
  if (deps.vitest) stack.testing.push("Vitest");
  if (deps.jest) stack.testing.push("Jest");
  if (deps["@playwright/test"]) stack.testing.push("Playwright");
  if (deps.cypress) stack.testing.push("Cypress");
  if (deps["@testing-library/react-native"]) stack.testing.push("React Native Testing Library");
  if (deps["@testing-library/react"]) stack.testing.push("React Testing Library");
  if (deps.detox) stack.testing.push("Detox");
  if (deps.maestro) stack.testing.push("Maestro");

  // CSS / Styling
  if (deps.tailwindcss) stack.css.push("Tailwind CSS");
  if (deps.nativewind) stack.css.push("NativeWind");
  if (deps["styled-components"]) stack.css.push("Styled Components");
  if (deps["@emotion/react"]) stack.css.push("Emotion");
  if (deps.sass) stack.css.push("SASS/SCSS");
  if (deps["react-native-unistyles"]) stack.css.push("Unistyles");

  // Backend services
  if (deps["@supabase/supabase-js"]) stack.backend.push("Supabase");
  if (deps.firebase || deps["@react-native-firebase/app"]) stack.backend.push("Firebase");
  if (deps["@prisma/client"]) stack.backend.push("Prisma");
  if (deps.express) stack.backend.push("Express");
  if (deps.fastify) stack.backend.push("Fastify");
  if (deps.hono) stack.backend.push("Hono");
  if (deps["@aws-sdk/client-dynamodb"]) stack.backend.push("AWS DynamoDB");
  if (deps.mongoose) stack.backend.push("Mongoose/MongoDB");
  if (deps.drizzle) stack.backend.push("Drizzle ORM");
  if (deps["drizzle-orm"]) stack.backend.push("Drizzle ORM");

  // Database (ORM / direct)
  if (deps["@prisma/client"]) stack.database.push("Prisma");
  if (deps["drizzle-orm"]) stack.database.push("Drizzle");
  if (deps["@supabase/supabase-js"]) stack.database.push("Supabase (PostgreSQL)");
  if (deps.mongoose) stack.database.push("MongoDB");
  if (deps.typeorm) stack.database.push("TypeORM");
  if (deps.knex) stack.database.push("Knex.js");
  if (deps["expo-sqlite"]) stack.database.push("Expo SQLite");
  if (deps["@nozbe/watermelondb"]) stack.database.push("WatermelonDB");
  if (deps.realm) stack.database.push("Realm");

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
 * Scan framework-specific directories at project root
 * Handles Next.js app/ and pages/, React Native screens/, Expo Router app/, etc.
 */
async function scanFrameworkDirectories(projectRoot, structure, stack) {
  // Next.js App Router: root-level app/ directory
  const appDirPaths = [
    path.join(projectRoot, "app"),
    path.join(projectRoot, "src", "app"),
  ];
  for (const appDir of appDirPaths) {
    if (fs.existsSync(appDir)) {
      const entries = fs.readdirSync(appDir);
      for (const entry of entries) {
        const fullPath = path.join(appDir, entry);
        if (
          fs.statSync(fullPath).isDirectory() &&
          !entry.startsWith("_") &&
          !entry.startsWith(".") &&
          !entry.startsWith("(") && // route groups
          entry !== "api" &&
          entry !== "components" &&
          entry !== "lib" &&
          entry !== "utils"
        ) {
          if (!structure.features.includes(entry)) {
            structure.features.push(entry);
          }
          structure.pages.push(entry);
        }
      }
      break;
    }
  }

  // Next.js Pages Router: root-level pages/ directory (not under src/)
  const rootPagesPath = path.join(projectRoot, "pages");
  if (fs.existsSync(rootPagesPath)) {
    const entries = fs.readdirSync(rootPagesPath);
    for (const entry of entries) {
      if (
        entry !== "_app.tsx" &&
        entry !== "_app.ts" &&
        entry !== "_app.js" &&
        entry !== "_document.tsx" &&
        entry !== "_document.ts" &&
        entry !== "_document.js" &&
        !entry.startsWith("_") &&
        entry !== "api"
      ) {
        const name = entry.replace(/\.(tsx?|jsx?)$/, "");
        if (
          !structure.features.includes(name) &&
          fs.statSync(path.join(rootPagesPath, entry)).isDirectory()
        ) {
          structure.features.push(name);
          structure.pages.push(name);
        }
      }
    }
  }

  // React Native / Expo: screens/ directory
  const screensPaths = [
    path.join(projectRoot, "screens"),
    path.join(projectRoot, "src", "screens"),
  ];
  for (const screensPath of screensPaths) {
    if (fs.existsSync(screensPath)) {
      const entries = fs.readdirSync(screensPath);
      for (const entry of entries) {
        const fullPath = path.join(screensPath, entry);
        if (fs.statSync(fullPath).isDirectory()) {
          structure.screens.push(entry);
          if (!structure.features.includes(entry)) {
            structure.features.push(entry);
          }
        } else if (entry.match(/\.(tsx?|jsx?)$/)) {
          const name = entry.replace(/\.(tsx?|jsx?)$/, "").replace(/Screen$/, "");
          structure.screens.push(name);
        }
      }
      break;
    }
  }

  // React Native: navigation/ directory
  const navPaths = [
    path.join(projectRoot, "navigation"),
    path.join(projectRoot, "src", "navigation"),
  ];
  for (const navPath of navPaths) {
    if (fs.existsSync(navPath)) {
      const files = await glob(`${navPath}/**/*.{tsx,ts,jsx,js}`, { nodir: true });
      structure.navigation = files.map((f) => path.relative(projectRoot, f));
      break;
    }
  }

  // General: services/ directory
  const servicesPaths = [
    path.join(projectRoot, "services"),
    path.join(projectRoot, "src", "services"),
  ];
  for (const servicesPath of servicesPaths) {
    if (fs.existsSync(servicesPath)) {
      const files = await glob(`${servicesPath}/**/*.{tsx,ts,jsx,js}`, { nodir: true });
      structure.services = files.map((f) => path.relative(projectRoot, f));
      break;
    }
  }
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
function generateSystemOverview(stack, sourceStructure, backendStructure) {
  const timestamp = new Date().toISOString();
  const domains = sourceStructure.features
    .map((d) => `- ${capitalizeWords(d)}`)
    .join("\n") || "- (No domains detected)";

  // Build platform-specific directory list
  let keyDirectories = "";
  if (stack.platform === "mobile" || stack.platform === "universal") {
    keyDirectories = `- **screens**: Screen-level components
- **navigation**: Navigation configuration and navigators
- **components**: Shared React Native components
- **hooks**: Custom React hooks
- **services**: API and business logic services
- **stores**: State management stores
- **types**: TypeScript type definitions
- **utils**: Utility functions`;
  } else if (stack.framework === "Next.js") {
    keyDirectories = `- **app/** or **pages/**: Route-level pages and layouts
- **components**: Shared React components
- **lib**: Utility functions and shared logic
- **hooks**: Custom React hooks
- **stores**: State management stores
- **types**: TypeScript type definitions
- **api/**: API routes (server-side endpoints)`;
  } else {
    keyDirectories = `- **components**: Shared React components
- **hooks**: Custom React hooks
- **stores**: State management stores
- **types**: TypeScript type definitions
- **utils**: Utility functions`;
  }

  // Build database section
  let databaseSection = "";
  if (backendStructure.schemas.length > 0 || backendStructure.prismaModels.length > 0) {
    databaseSection = "Database schema is documented in DATA_MODEL.md";
  } else if (stack.database.length > 0) {
    databaseSection = `Using: ${stack.database.join(", ")}. See DATA_MODEL.md for details.`;
  } else {
    databaseSection = "Database integration not detected";
  }

  // Build navigation section for mobile
  let navigationSection = "";
  if (stack.navigation.length > 0) {
    navigationSection = `\n### Navigation
${stack.navigation.map((n) => `- ${n}`).join("\n")}\n`;
  }

  return `# System Overview

Generated: ${timestamp}

## Technology Stack

### Core Framework
- **Framework**: ${stack.framework || "Not detected"}
- **Platform**: ${stack.platform}
- **React**: ${stack.react || "Not detected"}
- **TypeScript**: ${stack.typescript ? "Yes" : "No"}
- **Build Tool**: ${stack.buildTool || "Not detected"}
${navigationSection}
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

### Database
${stack.database.length > 0 ? stack.database.map((d) => `- ${d}`).join("\n") : "- Database not detected"}

## Project Structure

### Domains
${domains}

### Key Directories
${keyDirectories}

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
${databaseSection}

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
function generateDataModel(backendStructure, stack) {
  const timestamp = new Date().toISOString();

  // Build schemas section based on what was detected
  let schemasSection = "";
  if (backendStructure.prismaModels.length > 0) {
    schemasSection = `### Prisma Models\n\n${backendStructure.prismaModels.map((m) => `- **${m}**: Document model fields and relationships`).join("\n")}`;
  } else if (backendStructure.schemas.length > 0) {
    schemasSection = `### Database Schemas\n\n${backendStructure.schemas.map((s) => `- **${capitalizeWords(s)}**: Document schema tables and relationships`).join("\n")}`;
  } else if (stack.database.length > 0) {
    schemasSection = `### Database\n\nUsing: ${stack.database.join(", ")}\n\nDocument your data models below.`;
  }

  const migrations = backendStructure.migrations
    .slice(0, 5)
    .map((m) => `- ${m}`)
    .join("\n") || "- No migrations found";

  // Determine if SQL or NoSQL
  const isNoSQL = stack.database.some((d) => d.includes("MongoDB") || d.includes("Realm") || d.includes("WatermelonDB"));

  return `# Data Model

Generated: ${timestamp}

## ${isNoSQL ? "Collections & Documents" : "Schemas"}

${schemasSection}

## ${isNoSQL ? "Document Structure & References" : "Tables & Relationships"}

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

${isNoSQL ? `- Document-level validation rules
- Reference integrity patterns
- Index configuration` : `- Primary keys and uniqueness constraints
- Foreign key relationships
- Check constraints and validations`}

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
function generateInfrastructure(stack, backendStructure) {
  const timestamp = new Date().toISOString();
  const edgeFunctions = backendStructure.edgeFunctions
    .slice(0, 5)
    .map((f) => `- ${f}: Document function purpose`)
    .join("\n") || "- No serverless/edge functions detected";

  // Build deployment section based on platform
  let deploymentNotes = "";
  if (stack.platform === "mobile" || stack.platform === "universal") {
    deploymentNotes = `### Mobile Deployment

- **iOS**: App Store submission process
- **Android**: Google Play submission process
- **OTA Updates**: Over-the-air update strategy${stack.framework === "Expo" ? " (EAS Updates)" : ""}
- **Build System**: ${stack.framework === "Expo" ? "EAS Build" : "Xcode / Gradle"}
- **Beta Distribution**: TestFlight (iOS), Internal Testing (Android)`;
  } else if (stack.framework === "Next.js") {
    deploymentNotes = `### Web Deployment

- **Hosting**: Document hosting platform (Vercel, AWS, self-hosted)
- **Build Command**: \`next build\`
- **Static Generation**: Document ISR/SSG strategy if used
- **Edge Functions**: Document edge runtime usage if any`;
  } else {
    deploymentNotes = `### Web Deployment

- **Hosting**: Document hosting platform
- **Build process**: Document build pipeline
- **CDN**: Document CDN configuration if used`;
  }

  // Build API routes section if detected
  let apiRoutesSection = "";
  if (backendStructure.apiRoutes.length > 0) {
    const routes = backendStructure.apiRoutes
      .slice(0, 10)
      .map((r) => `- \`${r}\``)
      .join("\n");
    apiRoutesSection = `\n## API Routes\n\n${routes}\n`;
  }

  return `# Infrastructure

Generated: ${timestamp}

## Deployment

### Environments

- **Development**: Local environment setup
- **Staging**: Staging environment details
- **Production**: Production deployment info

${deploymentNotes}

### Build & Release

- Build process documentation
- Release procedure
- Rollback procedures

## Backend Services

${stack.backend.length > 0 ? stack.backend.map((b) => `### ${b}\n- Configuration\n- Key endpoints\n- Authentication`).join("\n\n") : "- No backend services detected"}
${apiRoutesSection}
## Serverless / Edge Functions

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

  // Build component organization note based on platform
  let componentOrgNote = "";
  if (stack.platform === "mobile" || stack.platform === "universal") {
    componentOrgNote = "Screens in `screens/`, shared components in `components/`, navigation in `navigation/`";
  } else if (stack.framework === "Next.js") {
    componentOrgNote = "Pages/routes in `app/` or `pages/`, shared components in `components/`";
  } else {
    componentOrgNote = "Shared components in `src/components/`, domain-specific in domain folders";
  }

  // Navigation section for mobile
  let navigationSection = "";
  if (stack.navigation.length > 0) {
    navigationSection = `\n**Navigation**\n${stack.navigation.map((n) => `- ${n}`).join("\n")}\n`;
  }

  // Database section
  let databaseSection = "";
  if (stack.database.length > 0) {
    databaseSection = `\n**Database**\n${stack.database.map((d) => `- ${d}`).join("\n")}\n`;
  }

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

**Framework & Platform**
- Framework: ${stack.framework || "Not detected"}
- Platform: ${stack.platform}
- Build Tool: ${stack.buildTool || "Not detected"}
- React: ${stack.react || "Not detected"}
- TypeScript: ${stack.typescript ? "Yes" : "No"}
${navigationSection}
**State Management**
${stack.stateManagement.length > 0 ? stack.stateManagement.map((s) => `- ${s}`).join("\n") : "- Not configured"}

**API Layer**
${stack.apiLayer.length > 0 ? stack.apiLayer.map((a) => `- ${a}`).join("\n") : "- Using default fetch/axios"}

**UI & Styling**
${stack.uiLibrary.length > 0 ? stack.uiLibrary.map((u) => `- ${u}`).join("\n") : "- Component library not configured"}

${stack.css.length > 0 ? "\n**CSS / Styling**\n" + stack.css.map((c) => `- ${c}`).join("\n") : ""}

**Testing**
${stack.testing.length > 0 ? stack.testing.map((t) => `- ${t}`).join("\n") : "- Testing framework not configured"}

**Backend**
${stack.backend.length > 0 ? stack.backend.map((b) => `- ${b}`).join("\n") : "- Backend not configured"}
${databaseSection}
### Project Domains

The following feature domains have been identified:

${sourceStructure.features.length > 0
  ? sourceStructure.features.map((f) => `- **${capitalizeWords(f)}** (\`domains/${f}/CONTEXT.md\`)`).join("\n")
  : "- No feature domains detected"
}

### Key Patterns to Know

1. **Component Organization**: ${componentOrgNote}
2. **State Pattern**: ${stack.stateManagement.length > 0 ? stack.stateManagement[0] : "Custom implementation"}
3. **API Communication**: ${stack.apiLayer.length > 0 ? stack.apiLayer[0] : "Fetch/Axios"}
4. **Styling**: ${stack.css.length > 0 ? stack.css[0] : "CSS modules or platform default"}

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
function printSummary(stack, sourceStructure, backendStructure, generatedFiles, dryRun) {
  console.log("\n");
  console.log(chalk.bold("========================================"));
  console.log(chalk.bold.cyan("  Context Graph Generator Scan Summary"));
  console.log(chalk.bold("========================================"));

  console.log("\n" + chalk.bold("Technology Stack:"));
  console.log(`  Framework: ${chalk.cyan(stack.framework || "Not detected")}`);
  console.log(`  Platform: ${chalk.cyan(stack.platform)}`);
  console.log(`  Build Tool: ${chalk.cyan(stack.buildTool || "Not detected")}`);
  console.log(`  React: ${chalk.cyan(stack.react || "Not detected")}`);
  console.log(`  TypeScript: ${chalk.cyan(stack.typescript ? "Yes" : "No")}`);

  if (stack.navigation.length > 0) {
    console.log(
      `  Navigation: ${chalk.cyan(stack.navigation.join(", "))}`
    );
  }
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
  if (stack.database.length > 0) {
    console.log(`  Database: ${chalk.cyan(stack.database.join(", "))}`);
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
  if (sourceStructure.screens.length > 0) {
    console.log(`  Screens: ${chalk.cyan(sourceStructure.screens.length)} found`);
  }
  if (sourceStructure.apiRoutes.length > 0) {
    console.log(`  API Routes: ${chalk.cyan(sourceStructure.apiRoutes.length)} found`);
  }
  if (sourceStructure.navigation.length > 0) {
    console.log(`  Navigation Files: ${chalk.cyan(sourceStructure.navigation.length)} found`);
  }
  console.log(
    `  GraphQL Files: ${chalk.cyan(sourceStructure.graphql.length)} found`
  );

  console.log("\n" + chalk.bold("Backend Structure:"));
  if (backendStructure.backendType) {
    console.log(`  Type: ${chalk.cyan(backendStructure.backendType)}`);
  }
  if (backendStructure.schemas.length > 0) {
    console.log(
      `  Schemas: ${chalk.cyan(backendStructure.schemas.length)} found`
    );
  }
  if (backendStructure.prismaModels.length > 0) {
    console.log(
      `  Prisma Models: ${chalk.cyan(backendStructure.prismaModels.length)} found`
    );
  }
  if (backendStructure.edgeFunctions.length > 0) {
    console.log(
      `  Edge/Serverless Functions: ${chalk.cyan(backendStructure.edgeFunctions.length)} found`
    );
  }
  if (backendStructure.apiRoutes.length > 0) {
    console.log(
      `  API Routes: ${chalk.cyan(backendStructure.apiRoutes.length)} found`
    );
  }
  if (backendStructure.migrations.length > 0) {
    console.log(
      `  Migrations: ${chalk.cyan(backendStructure.migrations.length)} found`
    );
  }

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
