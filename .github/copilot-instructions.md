# Copilot Instructions for ioBroker.type-detector

## Repository Overview

This repository contains a TypeScript library for automatically detecting IoT device types from ioBroker objects, states, and channels. It's used by ioBroker adapters like Material, Google Home, HomeKit, and others to understand what type of devices they're working with.

## Key Concepts

### Device Detection

- **Patterns**: Device types are defined by patterns in `src/typePatterns.ts` that specify required and optional states
- **States**: Individual data points (e.g., temperature, brightness, switch state) with specific roles and characteristics
- **Roles**: ioBroker role identifiers (e.g., `switch.light`, `value.temperature`, `sensor.motion`) that describe state purpose
- **Enums**: Categories/rooms that help classify devices (e.g., lights, sensors, switches)

### Supported Device Types

The library detects 40+ device types including:

- **Lighting**: dimmer, light, rgb, hue, ct (color temperature)
- **Climate**: thermostat, airCondition, weatherCurrent, weatherForecast
- **Sensors**: motion, door, window, temperature, humidity, fire, flood
- **Blinds/Covers**: blind, blindButtons, windowTilt, gate
- **Media**: media, volume, camera
- **Other**: lock, socket, vacuumCleaner, chart, image, info

## Architecture

### Core Classes

- **`ChannelDetector`** (`src/ChannelDetector.ts`): Main detection engine
- **Pattern definitions** (`src/typePatterns.ts`): Device type specifications
- **Type definitions** (`src/types.ts`): TypeScript interfaces and enums

### Key Methods

- `detect(options)`: Main detection method that returns matching device patterns
- `getPatterns()`: Returns all available device type patterns
- `getEnums()`: Returns enum/category definitions

### State Matching Logic

States are matched based on:

1. **Role regex**: Pattern matching against ioBroker roles
2. **Type**: Data type (boolean, number, string)
3. **Write permissions**: Read-only vs writable states
4. **Enums**: Category membership for classification
5. **Names**: State ID patterns and naming conventions

## Development Workflow

### Building

```bash
npm run build        # Full build (TypeScript + docs)
npm run build:ts     # TypeScript compilation only
npm run build:doc    # Generate DEVICES.md documentation
```

### Testing

```bash
npm test            # Run all tests
npm run watch       # Watch mode for development
```

### Code Quality

- **ESLint**: Configured with `@iobroker/eslint-config`
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting

## File Structure

- `src/`: TypeScript source code
    - `ChannelDetector.ts`: Main detection class
    - `typePatterns.ts`: Device pattern definitions
    - `types.ts`: TypeScript type definitions
    - `roleEnumUtils.ts`: Utility functions for role/enum handling
- `lib/`: Documentation generation scripts
    - `createMd.js`: Generates DEVICES.md from patterns
- `test/`: Test files with sample device configurations
- `build/`: Compiled output (created by build process)
- `DEVICES.md`: Auto-generated documentation (don't edit manually)

## Coding Guidelines

### Adding New Device Types

1. Define pattern in `src/typePatterns.ts` with required/optional states
2. Add enum definitions if needed
3. Update type definitions in `src/types.ts`
4. Add test cases in `test/` directory
5. Run `npm run build:doc` to update documentation

### State Pattern Structure

```typescript
{
  role: /regex-pattern/,           // Role matching regex
  indicator: boolean,              // Is this an indicator state?
  type: StateType.Boolean,         // Data type
  write: boolean,                  // Write permissions
  name: 'STATE_NAME',             // Internal reference name
  required: boolean,              // Required for pattern match
  defaultRole: 'default.role',    // Default role if none exists
  defaultUnit: 'unit'             // Default unit if none exists
}
```

### TypeScript Patterns

- Use strict typing with interfaces from `src/types.ts`
- Prefer `readonly` arrays for immutable data
- Use discriminated unions for state types
- Follow existing naming conventions (PascalCase for types, camelCase for variables)

## Testing Guidelines

### Test Data Structure

Test files in `test/` contain real ioBroker object structures:

- Use actual device exports from ioBroker instances
- Include both positive and negative test cases
- Test edge cases like missing required states
- Verify correct state assignment and naming

### Test Categories

- **Detection tests**: Verify patterns match expected devices
- **Edge case tests**: Handle missing states, wrong types
- **Performance tests**: Ensure detection is efficient
- **Multi-device tests**: Handle complex scenarios with multiple devices

## Common Patterns

### Role Matching

```typescript
// Match specific roles
role: /^switch\.light$/;

// Match role families
role: /^value\.temperature/;

// Match with optional suffixes
role: /^button(\\.press)?$/;
```

### Enum Functions

```typescript
// Custom enum detection
enums: (obj, enums) => enums.some(e => e.includes('lights'));
```

### State Requirements

```typescript
// Required state (must exist for pattern match)
{ name: 'SET', required: true, ... }

// Optional enhancement state
{ name: 'ACTUAL', required: false, ... }
```

## Domain-Specific Knowledge

### ioBroker Concepts

- **Objects**: Hierarchical structure (adapter.instance.device.channel.state)
- **Common**: Metadata describing object properties (role, type, unit, etc.)
- **States**: Actual data values
- **Adapters**: Device/service integrations (Zigbee, Z-Wave, Philips Hue, etc.)

### Device Hierarchies

- **Device**: Top-level device object
- **Channel**: Functional grouping within device
- **State**: Individual data point

Understanding these hierarchies is crucial for proper pattern matching and device detection.
