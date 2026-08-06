# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Overview

JARL ("Just Another Router Library for React") is a controlled-component router for React, managed as an npm workspaces monorepo. Packages are bundled with rolldown; the demo/docs site is built with Vite.

## Packages

- `packages/jarl-react` — the core router library
- `demo/` — example app(s) demonstrating usage, built with Vite

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

Each package's tests run under Vitest with jsdom. The legacy `jarl-react` test suite uses Enzyme
(`@cfaester/enzyme-adapter-react-18`, an unofficial adapter) — Enzyme has no official React 19
adapter, so some of these tests are known to fail post-upgrade; see the ticket 51 PR description
for details.

## TODOs

Active and completed tasks for this project are tracked as tickets in `<root>/TODOS/jarl-react/` (`<root>` is the repos root, one level above TODOS - resolve it fresh, don't hardcode it). When adding a TODO comment or TODO.md here, turn it into a ticket there instead.
