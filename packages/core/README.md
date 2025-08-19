# @prismate/core

Core foundation module for Prismate - a type-safe Prisma wrapper with validation and caching.

## 🚀 Features

- **Type Safety**: Comprehensive TypeScript types for Prisma operations
- **Error Handling**: Custom error classes with detailed error information
- **Utilities**: Helper functions for common operations
- **Constants**: Centralized configuration and constants
- **Validation**: Type guards and validation utilities

## 📦 Installation

```bash
npm install @prismate/core
# or
yarn add @prismate/core
# or
pnpm add @prismate/core
```

## 🔧 Usage

### Basic Types

```typescript
import { 
  SchemaField, 
  DMMF, 
  ModelName, 
  CreateInput 
} from '@prismate/core';

// Use types in your code
const createInput: CreateInput = {
  model: 'user',
  data: { name: 'John', email: 'john@example.com' }
};
```

### Error Handling

```typescript
import { 
  ValidationError, 
  createValidationError,
  formatError 
} from '@prismate/core';

try {
  // Your code here
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.field, error.value);
  }
  
  const message = formatError(error);
  console.error(message);
}
```

### Utilities

```typescript
import { 
  deepClone, 
  deepMerge, 
  pick, 
  omit,
  isDefined,
  isValidEmail 
} from '@prismate/core';

// Object utilities
const cloned = deepClone(originalObject);
const merged = deepMerge(obj1, obj2);
const selected = pick(obj, ['id', 'name']);
const filtered = omit(obj, ['password', 'secret']);

// Validation utilities
if (isDefined(value) && isValidEmail(email)) {
  // Process valid data
}
```

## 🏗️ Architecture

### Types
- **Prisma Types**: Client, model, and schema type definitions
- **Schema Types**: DMMF and field type definitions
- **Validation Types**: Input validation and result types
- **Common Types**: Utility types for pagination, sorting, filtering

### Constants
- **Field Types**: Prisma field type constants
- **Cache Options**: Default caching configuration
- **Error Messages**: Standardized error messages
- **HTTP Status**: Common HTTP status codes

### Utilities
- **String Utils**: String manipulation and formatting
- **Object Utils**: Object cloning, merging, and manipulation
- **Validation Utils**: Type guards and validation helpers
- **Error Utils**: Error formatting and handling

### Errors
- **Base Error**: `PrismateError` with error codes and details
- **Specific Errors**: `ValidationError`, `SchemaError`, `ClientError`, etc.
- **Error Factories**: Helper functions to create specific errors
- **Error Guards**: Type guards for error checking

## 🔗 Dependencies

- **Peer Dependencies**: `@prisma/client` (^5.0.0)
- **Dependencies**: `zod` (^3.22.4)
- **Dev Dependencies**: `typescript` (^5.3.0)

## 📚 API Reference

See the TypeScript definitions for complete API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 