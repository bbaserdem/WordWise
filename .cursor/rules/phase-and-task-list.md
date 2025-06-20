---
description: Guidelines for managing phases and task list of PRD
globs: **/tasks/**/*.md, **/tasks-*.md, **/phases/*.md, **checklist.md
alwaysApply: false
---

# Task List Management

Guidelines for managing task lists in markdown files to track progress on completing a PRD

## Task Implementation

- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y"
- **Completion protocol:**
  1. When you finish a **sub‑task**, always ask the user to mark it as completed by changing `[ ]` to `[x]` in the relevant checklist file.
     Never mark subtasks as done by yourself.
  2. If **all** subtasks underneath a parent task are now `[x]`,
     also mark the **parent task** as completed.
- Stop after each sub‑task and wait for the user's go‑ahead.

# Phase Structure Clarification

## Overview
Ensure clear understanding of project phase structure and task organization to prevent confusion between phases and tasks.

## Phase Structure
- Each phase contains multiple tasks
- Tasks are numbered sequentially within each phase
- No decimal phases exist (e.g., Phase 1.5 is not a separate phase)
- Tasks can be referred to by their corresponding phase, a dot, and their number. (e.g., Phase 1.3 means Phase 1, Task 3)

## Task Numbering Convention
- Phase 1: Tasks 1-7
- Phase 2: Tasks 1-6
- Phase 3: Tasks 1-6
- Phase 4: Tasks 1-6

## Reference Format
- "Phase X, Task Y" - Clear and unambiguous
- "Phase X Task Y" - Alternative format
- "Phase X > Task Y" - Hierarchical format

## Implementation Guidelines
- When user says "Phase X.Y", confirm they mean "Phase X, Task Y"
- Use explicit task names when discussing implementation
- Reference the exact task description from the checklist
- Never assume decimal notation refers to a separate phase
