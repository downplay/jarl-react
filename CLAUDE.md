# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Overview

JARL ("Just Another Router Library for React") is a controlled-component router for React, managed as a Lerna monorepo.

## Packages

- `packages/jarl-react` — the core router library
- `packages/jarl-react-native` — React Native bindings
- `packages/jarl-react-redux` — Redux integration
- `demo/` — example app(s) demonstrating usage
- `native/` — native-specific assets

## Commands

```bash
npm run bootstrap   # lerna bootstrap (link workspace packages)
npm run build       # build all packages (scripts/build.js)
npm test            # lerna run test across packages
npm run ci-test      # CI test run
npm run ci-e2e       # Cypress end-to-end tests
npm run lint         # lerna run lint across packages
npm start            # run the demo app (cd demo && npm start)
```

Linting/formatting run automatically pre-commit via `lint-staged` + `husky`.

## TODOs

Active and completed tasks for this project are tracked as tickets in `../../TODOS/jarl-react/`. When adding a TODO comment or TODO.md here, turn it into a ticket there instead.
