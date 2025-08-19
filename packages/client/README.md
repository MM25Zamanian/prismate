# @prismate/client

Prisma client management module for Prismate, providing type-safe client wrappers and model management.

## Features

- **Type-Safe Client Management**: Wrapper around Prisma clients with full TypeScript support
- **Model Extraction**: Automatic extraction of model names and schemas from Prisma clients
- **Memory Safety**: Handles nullable clients gracefully with proper error handling
- **Schema Building**: Constructs comprehensive schema information from DMMF data

## Installation

```bash
pnpm add @prismate/client
```

## Usage

### Basic Client Management

```typescript
import { PrismaClientManager } from '@prismate/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const manager = new PrismaClientManager(prisma);

// Access available models
console.log(manager.models); // ['user', 'post', 'comment']

// Access schemas
console.log(manager.schemas.user); // User model schema
console.log(manager.schemas.post); // Post model schema
```

### With DMMF Data

```typescript
import { PrismaClientManager } from '@prismate/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dmmf = prisma._dmmf;

const manager = new PrismaClientManager(prisma, dmmf);

// Full schema information available
console.log(manager.schemas.user.name); // Field name
console.log(manager.schemas.user.email.type); // Field type
console.log(manager.schemas.user.email.isRequired); // Required status
```

### Nullable Client Handling

```typescript
import { PrismaClientManager } from '@prismate/client';

// Safe handling of nullable clients
const manager = new PrismaClientManager(null);

console.log(manager.hasClient); // false
console.log(manager.models); // []
console.log(manager.schemas); // {}
```

## API Reference

### PrismaClientManager

#### Constructor

```typescript
new PrismaClientManager<TClient, TDMMF>(
  client: TClient,
  dmmf?: DMMF
)
```

#### Properties

- `models`: Array of available model names
- `schemas`: Object containing model schemas
- `hasClient`: Boolean indicating if client is available
- `modelCount`: Number of available models
- `schemaCount`: Number of available schemas

#### Methods

- `create()`: Create new records
- `findUnique()`: Find unique records
- `findMany()`: Find multiple records
- `update()`: Update existing records
- `delete()`: Delete records

## Type Safety

The module provides comprehensive TypeScript types:

- `ModelName<TClient>`: Extracted model names
- `Schemas<TDMMF>`: Schema structure types
- `SchemaField`: Individual field definitions
- `DMMFModel`: Model structure types

## Error Handling

All operations include proper error handling:

```typescript
try {
  const result = await manager.create('user', { data: userData });
} catch (error) {
  console.error('Operation failed:', error);
}
```

## Performance

- **Lazy Loading**: Schemas are built only when needed
- **Immutable Data**: All schema data is frozen for performance
- **Memory Efficient**: Minimal memory footprint with automatic cleanup

## Contributing

See the main [Prismate repository](https://github.com/prismate/prismate) for contribution guidelines.

## License

MIT License - see LICENSE file for details.