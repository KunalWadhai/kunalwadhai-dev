# Portfolio — Claude Code Instructions

## Session rules

- **Build or verify graph first** — run `uvx code-review-graph status` before significant work. If the branch/commit is stale, run `uvx code-review-graph build`.
- **Use graph throughout** — prefer code-review-graph MCP tools over manual file searches. Fall back to Grep/Glob/Read only when the graph doesn't cover it.
- **Env config** — backend reads env via `backend/src/config/env.js`; do not scatter `process.env` elsewhere.

## Project layout

| Path | Role |
|------|------|
| `frontend/` | React + TypeScript UI (`src/features/portfolio/`) |
| `backend/` | Express API (`src/routes/`, `src/services/`) |
| `.code-review-graph/` | Knowledge graph (local only; `graph.db` is gitignored) |

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.**

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. Graph auto-updates on file edits if hooks use `uvx code-review-graph update --skip-flows`.
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
