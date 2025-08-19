# Prismate Main Package

The main package for Prismate with enterprise-grade ESLint configuration and TypeScript support.

## ESLint Configuration

This package uses the shared ESLint configuration from `@prismate/eslint-config` with additional package-specific rules.

### Available Scripts

```bash
# Basic linting
pnpm lint

# Lint and auto-fix issues
pnpm lint:fix

# Compact lint output
pnpm lint:check

# Type checking
pnpm check-types
```

### Configuration Features

- **Import Organization**: Automatic import sorting and grouping
- **Type Safety**: Enforced type imports and TypeScript best practices
- **Code Quality**: Modern JavaScript patterns and clean formatting
- **Monorepo Support**: Optimized for workspace packages

### Import Ordering

The ESLint configuration enforces this import order:

1. **Built-in modules** (Node.js, etc.)
2. **External packages** (npm packages)
3. **Internal modules** (workspace packages)
4. **Parent directory imports**
5. **Sibling directory imports**
6. **Index file imports**
7. **Object destructuring imports**
8. **Type imports** (with `import type`)

### Example

```typescript
// ✅ Correct import order
import fs from 'fs';
import path from 'path';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { User } from '@/types/user';
import type { ApiResponse } from '@/types/api';

// ❌ Incorrect - will be auto-fixed by ESLint
import { Button } from '@/components/ui/button';
import fs from 'fs';
import type { User } from '@/types/user';
import path from 'path';
```

### Type Import Enforcement

Always use `import type` for type-only imports:

```typescript
// ✅ Good
import type { User } from '@/types/user';
import type { ComponentProps } from 'react';

// ❌ Bad - will trigger ESLint error
import { User } from '@/types/user';
import { ComponentProps } from 'react';
```

## Development

### Adding New Dependencies

When adding new packages, ensure they follow the import ordering rules:

```bash
pnpm add package-name
pnpm add -D @types/package-name  # If TypeScript types are needed
```

### Code Quality

The ESLint configuration enforces:
- Modern JavaScript patterns (const over let, strict equality)
- Clean formatting (no trailing spaces, proper line endings)
- TypeScript best practices
- Import organization and consistency

### IDE Integration

For the best development experience, install the ESLint extension in your IDE:
- **VS Code**: ESLint extension
- **WebStorm**: Built-in ESLint support
- **Vim/Neovim**: ALE or similar linting plugins

The configuration will automatically format imports and highlight issues in real-time. 