#!/usr/bin/env node

import { Command } from "commander";
import { init } from "../src/commands/init.js";
import { scan } from "../src/commands/scan.js";
import { verify } from "../src/commands/verify.js";

const program = new Command();

program
  .name("context-graph-generator")
  .description(
    "Generate an AI-agent-friendly context graph for your codebase"
  )
  .version("1.0.0");

program
  .command("init")
  .description(
    "Initialize the context graph directory structure in your project"
  )
  .option(
    "-d, --dir <path>",
    "Target directory (defaults to current directory)",
    "."
  )
  .option("--force", "Overwrite existing context files", false)
  .action(init);

program
  .command("scan")
  .description(
    "Scan your codebase and generate skeleton context files"
  )
  .option(
    "-d, --dir <path>",
    "Project root directory (defaults to current directory)",
    "."
  )
  .option(
    "--src <path>",
    "Source directory relative to project root",
    "src"
  )
  .option(
    "--supabase <path>",
    "Supabase directory relative to project root",
    "supabase"
  )
  .option("--dry-run", "Preview what would be generated without writing files", false)
  .action(scan);

program
  .command("verify")
  .description("Verify context graph integrity and completeness")
  .option(
    "-d, --dir <path>",
    "Project root directory (defaults to current directory)",
    "."
  )
  .action(verify);

program.parse();
