# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Overview

JARL ("Just Another Router Library for React") is a controlled-component router for React, managed as an npm workspaces monorepo. Packages are bundled with rolldown; the demo/docs site is built with Vite.

## Packages

- `packages/jarl-atoms` — framework-agnostic routing atoms (jotai; no React dependency)
- `packages/jarl-react` — React bindings (components + hooks) over `jarl-atoms`
- `demo/` — example app(s) demonstrating usage, built with Vite

The two packages are deliberately separate import paths: `jarl-react` does **not** re-export
`jarl-atoms`. Consumers get route atoms from `jarl-atoms` and the React bindings from
`jarl-react`, so the framework boundary stays visible and `jarl-atoms` is usable on its own.

Each package's `vitest.config.ts` / `tsconfig.json` alias `jarl-atoms` to its TypeScript
**source** rather than its built `dist/`, so tests and typechecks never depend on build order
or run against a stale build.

## Commands

```bash
npm install          # installs and links all workspace packages
npm run build         # build all packages (rolldown) and the demo (vite build)
npm test              # run each package's tests (vitest)
npm run ci-test        # CI test run
npm run lint            # oxlint across the repo
npm run format           # oxfmt across the repo
npm run dev / npm start   # run the demo app's Vite dev server (cd demo && npm run dev)
```

Linting is via `oxlint` and formatting via `oxfmt` (both part of the Vite+ toolchain) — there is no
separate ESLint/Prettier config. No pre-commit hook is currently wired up (husky/lint-staged were
removed with the rest of the old tooling).

Each package's tests run under Vitest with jsdom (the atoms talk to
`window.location`/`history` via jotai-location, and the bindings render React).

## TODOs

Active and completed tasks for this project are tracked as tickets in `<root>/TODOS/jarl-react/` (`<root>` is the repos root, one level above TODOS - resolve it fresh, don't hardcode it). When adding a TODO comment or TODO.md here, turn it into a ticket there instead.
