# Manus ↔ Claude Code — Sync Protocol

## Overview
This directory is the communication bridge between **Manus** (marketing AI) and **Claude Code** (engineering AI). Both agents read and write to this folder via Git.

## How It Works
```
Manus writes → .manus/tasks/ → Claude Code reads → builds → pushes
Claude Code writes → .manus/outputs/ → Manus reads → executes marketing
Both write → .manus/plans/ → shared planning space
```

## Directory Structure
```
.manus/
├── PROTOCOL.md          ← You are here. Rules of engagement.
├── ROLES.md             ← Who does what
├── STATUS.md            ← Current sprint status (both update)
├── tasks/               ← Manus → Claude Code (build requests)
├── outputs/             ← Claude Code → Manus (deliverables)
├── plans/               ← Shared planning space
├── templates/           ← Manus skills & prompts (shared reference)
└── logs/                ← Execution logs from both sides
```

## Communication Format

### Task Files (Manus → Claude Code)
Filename: `tasks/YYYY-MM-DD-{short-name}.md`
```markdown
# Task: [title]
- **From:** Manus
- **To:** Claude Code
- **Priority:** high | medium | low
- **Type:** build | fix | integrate | data
- **Status:** pending | in-progress | done | blocked

## Description
[What needs to be built]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Context
[Any research, data, or strategy context]
```

### Output Files (Claude Code → Manus)
Filename: `outputs/YYYY-MM-DD-{short-name}.md`
```markdown
# Output: [title]
- **From:** Claude Code
- **To:** Manus
- **Task Reference:** tasks/YYYY-MM-DD-{name}.md
- **Status:** ready | needs-review

## What Was Built
[Description + file paths]

## How To Use
[Instructions for Manus to use the output]

## API Keys / Config Needed
[Any setup Manus needs to do]
```

### Plan Files (Shared)
Filename: `plans/YYYY-MM-DD-{topic}.md`
```markdown
# Plan: [topic]
- **Created by:** Manus | Claude Code
- **Date:** YYYY-MM-DD

## Manus Responsibilities
- [ ] Task 1
- [ ] Task 2

## Claude Code Responsibilities
- [ ] Task 1
- [ ] Task 2

## Dependencies
[What blocks what]

## Timeline
[When each part should be done]
```

## Git Workflow
1. Both work on branch `claude/dj-business-marketing-wme6Q`
2. Before writing: `git pull origin claude/dj-business-marketing-wme6Q`
3. After writing: `git add .manus/ && git commit && git push`
4. Conflict resolution: latest timestamp wins, append don't overwrite

## Rules
1. **Never delete** the other agent's files — only add or update
2. **Always update STATUS.md** when starting or completing work
3. **One task per file** — don't combine multiple requests
4. **Include context** — neither agent has the other's memory
5. **Be explicit** — no assumptions about what the other knows
