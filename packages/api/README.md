# Prismate Main Package

Core, validation, database, admin, and config modules for Prismate with strict TypeScript and zero UI/HTTP dependencies.

## Modules

- Core: schema parsing/model discovery (`PrismateCore`)
- Validation: Zod schemas and validation (`PrismateValidator`)
- Database: CRUD/query helpers (`PrismateDatabase`)
- Admin: orchestration layer (`PrismateAdmin`)
- Config: configuration and defaults (`PrismateConfig`)

## Usage

```ts
import { PrismateAdmin } from "prismate";

const admin = new PrismateAdmin(prisma, dmmf);
await admin.createModel("user", { email: "a@b.com" });
const users = await admin.getModels("user", { where: { active: true } });
admin.dispose();
```

## Scripts

```bash
pnpm lint
pnpm lint:fix
pnpm lint:check
pnpm check-types
```