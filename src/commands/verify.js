import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const REQUIRED_STRUCTURE = {
  root: ['AGENTS.md', 'CLAUDE.md', '.cursorrules'],
  context: {
    directories: ['templates'],
  },
};

const REQUIRED_SECTIONS = {
  domain: ['Purpose', 'Key Entities', 'Business Rules', 'Code Locations', 'Dependencies', 'Common Gotchas'],
  architecture: ['Overview', 'Configuration', 'Code Locations', 'Error Handling', 'Dependencies'],
  pattern: ['Overview', 'When to Use', 'Standard Implementation', 'Best Practices', 'Anti-Patterns'],
  workflow: ['Overview', 'Prerequisites', 'Workflow Steps', 'Checklist', 'Troubleshooting'],
};

const SECTION_PATTERNS = {
  domain: new RegExp(`^(${REQUIRED_SECTIONS.domain.join('|')})\\b`, 'im'),
  architecture: new RegExp(`^(${REQUIRED_SECTIONS.architecture.join('|')})\\b`, 'im'),
  pattern: new RegExp(`^(${REQUIRED_SECTIONS.pattern.join('|')})\\b`, 'im'),
  workflow: new RegExp(`^(${REQUIRED_SECTIONS.workflow.join('|')})\\b`, 'im'),
};

let results = {
  structure: [],
  content: [],
  crossReferences: [],
  scores: {
    completeness: 0,
    structure: 0,
    content: 0,
    references: 0,
  },
  files: {
    domains: [],
    architectures: [],
    patterns: [],
    workflows: [],
  },
};

export async function verify(options) {
  const projectDir = options.dir || process.cwd();

  console.log(chalk.bold.blue('\n📊 Context Graph Verification\n'));
  console.log(`Project directory: ${chalk.dim(projectDir)}\n`);

  results = {
    structure: [],
    content: [],
    crossReferences: [],
    scores: {
      completeness: 0,
      structure: 0,
      content: 0,
      references: 0,
    },
    files: {
      domains: [],
      architectures: [],
      patterns: [],
      workflows: [],
    },
  };

  // Run verification phases
  await verifyStructure(projectDir);
  await verifyContent(projectDir);
  await verifyCrossReferences(projectDir);
  calculateCompleteness(projectDir);

  // Output report
  outputReport();

  return results;
}

async function verifyStructure(projectDir) {
  console.log(chalk.bold('1. Structure Verification\n'));

  // Check root files
  for (const file of REQUIRED_STRUCTURE.root) {
    const filePath = path.join(projectDir, file);
    const exists = fs.existsSync(filePath);

    if (exists) {
      results.structure.push({
        type: 'success',
        message: `${file} exists in project root`,
      });
    } else {
      results.structure.push({
        type: 'error',
        message: `${file} missing in project root`,
      });
    }
  }

  // Check CLAUDE.md references AGENTS.md
  const claudePath = path.join(projectDir, 'CLAUDE.md');
  if (fs.existsSync(claudePath)) {
    const claudeContent = fs.readFileSync(claudePath, 'utf-8');
    if (claudeContent.includes('AGENTS.md')) {
      results.structure.push({
        type: 'success',
        message: 'CLAUDE.md references AGENTS.md',
      });
    } else {
      results.structure.push({
        type: 'warning',
        message: 'CLAUDE.md does not reference AGENTS.md',
      });
    }
  }

  // Check .cursorrules references AGENTS.md
  const cursorrPath = path.join(projectDir, '.cursorrules');
  if (fs.existsSync(cursorrPath)) {
    const cursorContent = fs.readFileSync(cursorrPath, 'utf-8');
    if (cursorContent.includes('AGENTS.md')) {
      results.structure.push({
        type: 'success',
        message: '.cursorrules references AGENTS.md',
      });
    } else {
      results.structure.push({
        type: 'warning',
        message: '.cursorrules does not reference AGENTS.md',
      });
    }
  }

  // Check context directory
  const contextDir = path.join(projectDir, 'context');
  if (fs.existsSync(contextDir) && fs.statSync(contextDir).isDirectory()) {
    results.structure.push({
      type: 'success',
      message: 'context/ directory exists',
    });

    // Check subdirectories
    for (const subdir of REQUIRED_STRUCTURE.context.directories) {
      const subdirPath = path.join(contextDir, subdir);
      if (fs.existsSync(subdirPath) && fs.statSync(subdirPath).isDirectory()) {
        results.structure.push({
          type: 'success',
          message: `context/${subdir}/ directory exists`,
        });
      } else {
        results.structure.push({
          type: 'warning',
          message: `context/${subdir}/ directory missing`,
        });
      }
    }

    // Check for template files
    const templatesPath = path.join(contextDir, 'templates');
    if (fs.existsSync(templatesPath)) {
      const templateFiles = fs.readdirSync(templatesPath).filter(f => f.endsWith('.md'));
      if (templateFiles.length > 0) {
        results.structure.push({
          type: 'success',
          message: `context/templates/ has ${templateFiles.length} template file(s)`,
        });
      } else {
        results.structure.push({
          type: 'warning',
          message: 'context/templates/ directory is empty',
        });
      }
    }
  } else {
    results.structure.push({
      type: 'error',
      message: 'context/ directory does not exist',
    });
  }

  results.scores.structure = calculateScore(results.structure);
  console.log();
}

async function verifyContent(projectDir) {
  console.log(chalk.bold('2. Content Verification\n'));

  const contextDir = path.join(projectDir, 'context');
  if (!fs.existsSync(contextDir)) {
    results.content.push({
      type: 'error',
      message: 'Cannot verify content: context/ directory does not exist',
    });
    return;
  }

  // Check domains (can be flat .md files or subdirectories with CONTEXT.md)
  const domainsDir = path.join(contextDir, 'domains');
  if (fs.existsSync(domainsDir)) {
    const domainEntries = fs.readdirSync(domainsDir);
    const domainFiles = [];

    for (const entry of domainEntries) {
      const entryPath = path.join(domainsDir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        // Look for CONTEXT.md inside subdirectory
        const contextFile = path.join(entryPath, 'CONTEXT.md');
        if (fs.existsSync(contextFile)) {
          domainFiles.push({ name: `${entry}/CONTEXT.md`, path: contextFile });
        }
      } else if (entry.endsWith('.md')) {
        domainFiles.push({ name: entry, path: entryPath });
      }
    }

    results.files.domains = domainFiles.map(f => f.name);

    if (domainFiles.length === 0) {
      results.content.push({
        type: 'warning',
        message: 'No domain context files found',
      });
    } else {
      results.content.push({
        type: 'success',
        message: `Found ${domainFiles.length} domain context file(s)`,
      });

      for (const file of domainFiles) {
        verifyFileContent(file.path, 'domain', file.name);
      }
    }
  }

  // Check architectures
  const archDir = path.join(contextDir, 'architecture');
  if (fs.existsSync(archDir)) {
    const archFiles = fs.readdirSync(archDir).filter(f => f.endsWith('.md'));
    results.files.architectures = archFiles;

    if (archFiles.length === 0) {
      results.content.push({
        type: 'warning',
        message: 'No architecture context files found',
      });
    } else {
      results.content.push({
        type: 'success',
        message: `Found ${archFiles.length} architecture file(s)`,
      });

      for (const file of archFiles) {
        verifyFileContent(path.join(archDir, file), 'architecture', file);
      }
    }
  }

  // Check patterns
  const patternsDir = path.join(contextDir, 'patterns');
  if (fs.existsSync(patternsDir)) {
    const patternFiles = fs.readdirSync(patternsDir).filter(f => f.endsWith('.md'));
    results.files.patterns = patternFiles;

    if (patternFiles.length === 0) {
      results.content.push({
        type: 'warning',
        message: 'No pattern documentation files found',
      });
    } else {
      results.content.push({
        type: 'success',
        message: `Found ${patternFiles.length} pattern file(s)`,
      });

      for (const file of patternFiles) {
        verifyFileContent(path.join(patternsDir, file), 'pattern', file);
      }
    }
  }

  // Check workflows
  const workflowsDir = path.join(contextDir, 'workflows');
  if (fs.existsSync(workflowsDir)) {
    const workflowFiles = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.md'));
    results.files.workflows = workflowFiles;

    if (workflowFiles.length === 0) {
      results.content.push({
        type: 'warning',
        message: 'No workflow documentation files found',
      });
    } else {
      results.content.push({
        type: 'success',
        message: `Found ${workflowFiles.length} workflow file(s)`,
      });

      for (const file of workflowFiles) {
        verifyFileContent(path.join(workflowsDir, file), 'workflow', file);
      }
    }
  }

  results.scores.content = calculateScore(results.content);
  console.log();
}

function verifyFileContent(filePath, type, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const required = REQUIRED_SECTIONS[type];
  const foundSections = [];
  let allFound = true;

  for (const section of required) {
    // Use regex to match section headers flexibly (## Section, ### Section, with/without colons)
    const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sectionRegex = new RegExp(`^#{1,4}\\s*${escaped}`, 'mi');
    const hasSection = sectionRegex.test(content);
    foundSections.push(hasSection);
    if (!hasSection) {
      allFound = false;
    }
  }

  const foundCount = foundSections.filter(Boolean).length;
  const percentage = Math.round((foundCount / required.length) * 100);

  if (allFound) {
    results.content.push({
      type: 'success',
      message: `${fileName}: all ${required.length} required sections present`,
    });
  } else if (percentage >= 75) {
    results.content.push({
      type: 'warning',
      message: `${fileName}: ${foundCount}/${required.length} sections found (${percentage}%)`,
    });
  } else {
    results.content.push({
      type: 'error',
      message: `${fileName}: only ${foundCount}/${required.length} sections found (${percentage}%)`,
    });
  }
}

async function verifyCrossReferences(projectDir) {
  console.log(chalk.bold('3. Cross-Reference Verification\n'));

  const contextDir = path.join(projectDir, 'context');
  if (!fs.existsSync(contextDir)) {
    return;
  }

  const allContextFiles = getAllContextFiles(contextDir);
  let brokenReferences = 0;
  let validReferences = 0;

  // Check file references in context files
  for (const file of allContextFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Look for file path references (src/..., lib/..., etc.)
    const filePathPattern = /\b(src|lib|tests?|components?|utils?|services?|models?|views?)\/[\w\-./]+\.\w+/g;
    const matches = content.match(filePathPattern) || [];

    for (const match of matches) {
      const fullPath = path.join(projectDir, match);
      if (!fs.existsSync(fullPath)) {
        brokenReferences++;
        results.crossReferences.push({
          type: 'warning',
          message: `${path.basename(file)}: references non-existent file ${match}`,
        });
      } else {
        validReferences++;
      }
    }
  }

  if (validReferences > 0) {
    results.crossReferences.push({
      type: 'success',
      message: `${validReferences} valid file reference(s) found`,
    });
  }

  if (brokenReferences === 0 && validReferences > 0) {
    results.crossReferences.push({
      type: 'success',
      message: 'No broken file references detected',
    });
  } else if (brokenReferences > 0) {
    results.crossReferences.push({
      type: 'warning',
      message: `${brokenReferences} broken file reference(s) detected`,
    });
  }

  // Check for orphaned files
  const orphaned = findOrphanedFiles(projectDir, contextDir, allContextFiles);
  if (orphaned.length === 0) {
    results.crossReferences.push({
      type: 'success',
      message: 'No orphaned context files detected',
    });
  } else {
    results.crossReferences.push({
      type: 'warning',
      message: `${orphaned.length} orphaned context file(s) detected`,
    });
    orphaned.forEach(file => {
      results.crossReferences.push({
        type: 'info',
        message: `  - ${path.relative(contextDir, file)}`,
      });
    });
  }

  results.scores.references = calculateScore(results.crossReferences);
  console.log();
}

function getAllContextFiles(contextDir) {
  const files = [];
  const walk = (dir) => {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && entry !== 'templates') {
        walk(fullPath);
      } else if (entry.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  };
  walk(contextDir);
  return files;
}

function findOrphanedFiles(projectDir, contextDir, allContextFiles) {
  const orphaned = [];
  const categorized = {
    domains: [],
    architecture: [],
    patterns: [],
    workflows: [],
  };

  for (const file of allContextFiles) {
    const relative = path.relative(contextDir, file);
    if (relative.startsWith('domains')) {
      categorized.domains.push(file);
    } else if (relative.startsWith('architecture')) {
      categorized.architecture.push(file);
    } else if (relative.startsWith('patterns')) {
      categorized.patterns.push(file);
    } else if (relative.startsWith('workflows')) {
      categorized.workflows.push(file);
    }
  }

  // Check if reference files are documented elsewhere
  for (const file of allContextFiles) {
    const fileName = path.basename(file, '.md');
    let referenced = false;

    // Check if this file is referenced in any other context file
    for (const other of allContextFiles) {
      if (other !== file) {
        const content = fs.readFileSync(other, 'utf-8');
        if (content.includes(fileName) || content.includes(path.basename(file))) {
          referenced = true;
          break;
        }
      }
    }

    // Check if referenced in main docs
    const claudePath = path.join(projectDir, 'CLAUDE.md');
    const agentsPath = path.join(projectDir, 'AGENTS.md');

    if (!referenced) {
      if (fs.existsSync(claudePath)) {
        const claudeContent = fs.readFileSync(claudePath, 'utf-8');
        if (claudeContent.includes(fileName) || claudeContent.includes(path.basename(file))) {
          referenced = true;
        }
      }
      if (fs.existsSync(agentsPath)) {
        const agentsContent = fs.readFileSync(agentsPath, 'utf-8');
        if (agentsContent.includes(fileName) || agentsContent.includes(path.basename(file))) {
          referenced = true;
        }
      }
    }

    if (!referenced) {
      orphaned.push(file);
    }
  }

  return orphaned;
}

function calculateCompleteness(projectDir) {
  const contextDir = path.join(projectDir, 'context');

  if (!fs.existsSync(contextDir)) {
    results.scores.completeness = 0;
    return;
  }

  let score = 0;
  const weights = {
    structure: 25,
    content: 35,
    references: 20,
    documentation: 20,
  };

  // Structure score (0-100)
  const structureScore = results.scores.structure || 0;
  score += (structureScore / 100) * weights.structure;

  // Content score (0-100)
  const contentScore = results.scores.content || 0;
  score += (contentScore / 100) * weights.content;

  // References score (0-100)
  const refScore = results.scores.references || 0;
  score += (refScore / 100) * weights.references;

  // Documentation score based on file count
  const totalDocs = results.files.domains.length + results.files.architectures.length +
                   results.files.patterns.length + results.files.workflows.length;
  const docScore = Math.min((totalDocs / 10) * 100, 100);
  score += (docScore / 100) * weights.documentation;

  results.scores.completeness = Math.round(score);
}

function calculateScore(items) {
  if (items.length === 0) return 0;

  const successCount = items.filter(i => i.type === 'success').length;
  const warningCount = items.filter(i => i.type === 'warning').length;
  const errorCount = items.filter(i => i.type === 'error').length;

  // Success: +10, Warning: +5, Error: 0
  const totalScore = (successCount * 10) + (warningCount * 5);
  const maxScore = items.length * 10;

  return Math.round((totalScore / maxScore) * 100);
}

function outputReport() {
  console.log(chalk.bold.blue('\n═══════════════════════════════════════════════════════════\n'));
  console.log(chalk.bold('VERIFICATION REPORT\n'));

  // Structure section
  console.log(chalk.bold('Structure Verification:'));
  results.structure.forEach(item => {
    outputItem(item);
  });

  // Content section
  console.log(chalk.bold('\nContent Verification:'));
  results.content.forEach(item => {
    outputItem(item);
  });

  // Cross-references section
  console.log(chalk.bold('\nCross-Reference Verification:'));
  results.crossReferences.forEach(item => {
    outputItem(item);
  });

  // Summary scores
  console.log(chalk.bold.blue('\n═══════════════════════════════════════════════════════════\n'));
  console.log(chalk.bold('Verification Scores:\n'));

  outputScore('Structure', results.scores.structure);
  outputScore('Content', results.scores.content);
  outputScore('References', results.scores.references);
  outputScore('Overall Completeness', results.scores.completeness);

  // Overall health
  console.log(chalk.bold.blue('\n═══════════════════════════════════════════════════════════\n'));
  const health = getHealthStatus(results.scores.completeness);
  console.log(chalk.bold(`Overall Health: ${health.emoji} ${health.status}`));
  console.log(`Completeness Score: ${getScoreColor(results.scores.completeness)(results.scores.completeness + '%')}\n`);

  // Summary statistics
  console.log(chalk.bold('Documentation Summary:'));
  console.log(`  Domains: ${results.files.domains.length}`);
  console.log(`  Architecture: ${results.files.architectures.length}`);
  console.log(`  Patterns: ${results.files.patterns.length}`);
  console.log(`  Workflows: ${results.files.workflows.length}`);
  console.log();
}

function outputItem(item) {
  const icon = {
    success: chalk.green('✓'),
    error: chalk.red('✗'),
    warning: chalk.yellow('⚠'),
    info: chalk.cyan('ℹ'),
  }[item.type] || '•';

  const color = {
    success: chalk.green,
    error: chalk.red,
    warning: chalk.yellow,
    info: chalk.cyan,
  }[item.type] || chalk.white;

  console.log(`  ${icon} ${color(item.message)}`);
}

function outputScore(label, score) {
  const color = getScoreColor(score);
  const bar = getScoreBar(score);
  console.log(`  ${label}: ${color(score + '%')} ${bar}`);
}

function getScoreColor(score) {
  if (score >= 80) return chalk.green;
  if (score >= 60) return chalk.yellow;
  return chalk.red;
}

function getScoreBar(score) {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return getScoreColor(score)(bar);
}

function getHealthStatus(score) {
  if (score >= 90) return { status: 'Excellent', emoji: '🟢' };
  if (score >= 80) return { status: 'Good', emoji: '🟡' };
  if (score >= 70) return { status: 'Fair', emoji: '🟠' };
  return { status: 'Needs Work', emoji: '🔴' };
}
