# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript library (`@iobroker/type-detector`) that automatically detects IoT device types from ioBroker object hierarchies. Used by adapters like Material, Google Home, and HomeKit to classify devices (40+ types: lighting, climate, sensors, blinds, media, etc.).

## Commands

```bash
npm run build        # Full build: TypeScript compilation + generate DEVICES.md
npm run build:ts     # TypeScript compilation only (tsc -p tsconfig.build.json)
npm run build:doc    # Generate DEVICES.md from patterns (node lib/createMd)
npm test             # Run all tests (mocha --exit)
npm run watch        # Watch mode for tests during development
npm run lint         # ESLint check (eslint -c eslint.config.mjs)
```

## Architecture

**Pattern-based detection engine**: `ChannelDetector.detect()` iterates through device type patterns, matching ioBroker object states by role regex, data type, read/write permissions, and enum membership.

### Core source files (all in `src/`)

- **`ChannelDetector.ts`** - Main `ChannelDetector` class with `detect()`, `getPatterns()`, `getEnums()`. Contains the detection algorithm: iterates patterns, tests states against role regexes, resolves conflicts, caches results.
- **`typePatterns.ts`** - All device type pattern definitions (~3000 lines). Each pattern defines required/optional states with role regex, type, permissions. Shared patterns (battery, error, indicators, electricity) are reused across device types.
- **`types.ts`** - TypeScript interfaces: `DetectOptions`, `DetectorState`, `PatternControl`, `Types` enum (device type names), `StateType` enum, `PatternName` (internal pattern identifiers).
- **`roleEnumUtils.ts`** - Utilities for role/enum matching logic.
- **`index.ts`** - Public API exports.

### Detection flow

1. Sort object keys, get states below target ID
2. Iterate patterns (respecting `allowedTypes`/`excludedTypes`)
3. For each pattern, test states: role regex match -> type check -> read/write check -> enum validation
4. Assemble `PatternControl[]` with matched states, resolve ID conflicts
5. Sort results (info last, required IDs prioritized), cache results

### Adding a new device type

1. Define pattern in `src/typePatterns.ts` with required/optional states
2. Add type name to `Types` enum and `PatternName` in `src/types.ts`
3. Add test cases in `test/`
4. Run `npm run build` (rebuilds TS + regenerates DEVICES.md)

## Key conventions

- **DEVICES.md is auto-generated** - never edit manually; run `npm run build:doc`
- TypeScript strict mode is enabled
- ESLint uses `@iobroker/eslint-config`; `jsdoc/require-jsdoc` and `jsdoc/require-param` are disabled
- Build output goes to `build/`; entry point is `build/index.js`
- Tests use Mocha with real ioBroker object structures (not mocks)
- ioBroker object hierarchy: adapter.instance.device.channel.state
