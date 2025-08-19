# @prismate/eslint-config

A shared ESLint configuration for the Prismate repository with enterprise-grade rules and best practices.

## Features

### 🏗️ Import Organization
- **Structured import ordering** based on Airbnb/Google standards
- **Automatic grouping** of imports (builtin → external → internal → parent → sibling → index → object → type)
- **Alphabetical sorting** within each group
- **Newline separation** between different import groups
- **Duplicate prevention** and unused module detection

### 🔒 Type Safety
- **Enforced type imports** using `import type` syntax
- **No side effects** from type-only imports
- **Consistent TypeScript patterns** following official recommendations

### 🚀 Code Quality
- **Modern JavaScript practices** (prefer const, no var, strict equality)
- **Clean code formatting** (no trailing spaces, proper line endings)
- **Unused variable detection** with TypeScript integration
- **Console and debugger warnings** for production code

## Usage

```javascript
// ✅ Good - Organized imports with proper grouping
import fs from 'fs';
import path from 'path';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { User } from '@/types/user';
import type { ApiResponse } from '@/types/api';

// ❌ Bad - Disorganized imports
import { Button } from '@/components/ui/button';
import fs from 'fs';
import type { User } from '@/types/user';
import path from 'path';
```

## Rules Overview

### Import Rules
- `import/order`: Enforces structured import ordering
- `import/no-unresolved`: Ensures all imports resolve to existing files
- `import/no-duplicates`: Prevents duplicate import statements
- `import/no-unused-modules`: Warns about unused imported modules

### TypeScript Rules
- `@typescript-eslint/consistent-type-imports`: Enforces `import type` for types
- `@typescript-eslint/no-import-type-side-effects`: Prevents runtime side effects from type imports
- `@typescript-eslint/no-unused-vars`: TypeScript-aware unused variable detection

### Code Quality Rules
- `prefer-const`: Prefers `const` over `let` when possible
- `no-var`: Disallows `var` declarations
- `eqeqeq`: Requires strict equality (`===` instead of `==`)
- `curly`: Enforces curly braces for all control statements

## Configuration

This configuration extends:
- ESLint recommended rules
- TypeScript ESLint recommended rules
- Prettier compatibility
- Turbo monorepo rules
- Only-warn plugin for development

## Best Practices

1. **Import Organization**: Always group imports logically and maintain consistent ordering
2. **Type Imports**: Use `import type` for all type-only imports
3. **Code Quality**: Follow modern JavaScript patterns and maintain clean formatting
4. **TypeScript**: Leverage TypeScript's type system for better code safety

## Companies Using Similar Rules

- **Airbnb**: Import ordering and code quality standards
- **Google**: Strict formatting and best practices
- **Microsoft**: TypeScript integration and type safety
- **Meta**: Modern JavaScript patterns and React best practices
