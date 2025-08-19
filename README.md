# 🚀 Prismate

> Turn your Prisma schema into a modern, production‑ready admin panel — at runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4.svg)](https://tailwindcss.com/)
[![UI](https://img.shields.io/badge/UI-shadcn%2Fui-111827.svg)](https://ui.shadcn.com/)
[![Server](https://img.shields.io/badge/Server-Elysia-2E3440.svg)](https://elysiajs.com/)

## 📚 Table of Contents

- Overview
- Tech Stack Decision
- Architecture
- Features (MVP + Future)
- Quick Start
- Configuration
- Usage
- Coding Standards
- Folder Structure
- Limitations
- Roadmap
- License

## 🎯 Overview

Prismate is a runtime library that reads your Prisma schema (DMMF) and provides a ready‑to‑use admin experience for your Next.js app. It removes the repetitive work of building CRUD forms and data tables for each model, keeping the UI in sync with your database by design.

- Single Source of Truth: your `schema.prisma`
- Maximum Automation: CRUD UI and API generated at runtime
- Extensible by Design: roadmap for custom fields/actions/hooks (future)

## 🧰 Tech Stack Decision

- Next.js 15 (App Router) — admin UI runtime
- TypeScript 5.x — type safety everywhere
- Prisma 6 — database layer + DMMF
- Tailwind CSS 4 — styling
- shadcn/ui — lightweight, accessible UI components
- Elysia — fast server runtime for HTTP endpoints

Note: Prismate is designed specifically for this stack and is not framework‑agnostic.

## 🏗️ Architecture

High‑level flow:

```
Prisma Schema  ──▶  Prisma DMMF  ──▶  Prismate Runtime
                                     ├── Validation (Zod)
                                     ├── UI Mapping (shadcn/ui)
                                     ├── API Adapter (Elysia)
Next.js App  ◀───────────────────────┘
```

Runtime boundaries:
- Data model: Prisma is the source of truth
- Transport: Elysia handles HTTP endpoints (CRUD)
- UI: Next.js + shadcn/ui renders list/forms from model metadata

Deployment:
- Same repository (monorepo via Turborepo)
- Elysia endpoints can run alongside Next.js or as a separate process

## ✨ Features

### ✅ MVP
- Auto‑generated list, create, edit, delete for all Prisma models
- Type‑driven field rendering (String, Int, Boolean, Date, Enum, Relations)
- Zod validation inferred from schema metadata
- Basic search, sort, and pagination
- Responsive, accessible UI built on shadcn/ui
- Caching for schema‑to‑UI mapping

### 🔮 Future
- File uploads (configurable via environment variables)
- Pluggable storage backends (local, S3, Cloudinary)
- Component overrides and theming controls
- Custom actions and hooks (pre/post CRUD)
- Role‑based access control
- Bulk operations and advanced filters

## ⚡ Quick Start

Install in a Next.js + Prisma project:

```bash
pnpm add prismate
```

Generate Prisma client and DMMF:

```bash
pnpm prisma generate
```

Initialize Prismate with your Prisma client and DMMF:

```ts
// apps/demo/lib/prismate.ts
import { Server } from 'prismate'
import { db } from './prisma'
import { Prisma } from '@/generated/prisma'

export const prismate = new Server(db, Prisma.dmmf)
```

Expose HTTP endpoints using Elysia (adapter-based runtime):

```ts
// apps/demo/server/elysia.ts (example)
import { Elysia } from 'elysia'
import { prismate } from '@/lib/prismate'

// Example sketch — actual adapter API may evolve
export const app = new Elysia({ prefix: '/api/admin' })
  .get('/:model', async ({ params, query }) => {
    // List (with optional pagination, search)
    return prismate['findMany']?.(params.model as any, {
      take: Number(query.take ?? 20),
      skip: Number(query.skip ?? 0)
    })
  })
  .get('/:model/:id', async ({ params }) => {
    return prismate['findUnique']?.(params.model as any, {
      where: { id: params.id }
    })
  })
  .post('/:model', async ({ params, body }) => {
    return prismate['create']?.(params.model as any, { data: body })
  })
  .put('/:model/:id', async ({ params, body }) => {
    return prismate['update']?.(params.model as any, {
      where: { id: params.id },
      data: body
    })
  })
  .delete('/:model/:id', async ({ params }) => {
    return prismate['delete']?.(params.model as any, { where: { id: params.id } })
  })
```

Render the admin UI in Next.js:

```tsx
// apps/demo/app/admin/page.tsx
export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground">Pick a model from the sidebar.</p>
    </div>
  )
}
```

Note: The Elysia adapter is the recommended transport layer. The exact adapter API may evolve as the runtime solidifies.

## 🔧 Configuration

Environment variables (current and planned):

- DATABASE_URL: Prisma connection string
- STORAGE_PROVIDER: planned for uploads (`local`, `s3`, `cloudinary`)
- UPLOAD_PATH: planned local storage path
- MAX_FILE_SIZE: planned upload size limit
- S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY: planned S3 config

All file‑related settings are read from env at runtime (future).

## 🧑‍💻 Usage

Minimal usage patterns:
- Instantiate `Server(db, Prisma.dmmf)` once and re‑use
- Point your Elysia routes to the generated CRUD handlers
- Consume endpoints from the Next.js admin UI

Edge cases to handle in UI:
- loading state while fetching
- error state for failed requests
- empty state when no data exists

## ✅ Coding Standards

- Next.js App Router with clear Server/Client component separation
- SSR/ISR where appropriate; client components only for interactive views
- Absolute imports with `@/` alias
- TypeScript strict mode; no `any` in public APIs
- Small, focused components and hooks; avoid bloated components
- Handle all states (loading, error, empty, success)
- No dead/duplicate code; keep modules cohesive and testable
- Conventional Commits (e.g., `feat(admin): add list pagination`)
- ESLint + Prettier; format on commit (CI enforces)

## 🗂️ Folder Structure

Monorepo (Turborepo + pnpm workspaces):

```
prismate/
├─ apps/
│  └─ demo/
│     ├─ app/                  # Next.js app router
│     │  └─ admin/             # Admin UI pages
│     ├─ lib/
│     │  ├─ prisma.ts          # Prisma client
│     │  └─ prismate.ts        # Prismate bootstrap (Server + DMMF)
│     ├─ prisma/
│     │  └─ schema.prisma      # Source of truth
│     └─ server/
│        └─ elysia.ts          # HTTP endpoints (Elysia)
├─ packages/
│  ├─ main/                    # Prismate runtime library
│  │  └─ src/
│  │     ├─ prisma-client.ts   # Prisma wrapper + schema extraction
│  │     ├─ services.ts        # Validation + helpers
│  │     └─ index.ts           # Public exports
│  ├─ eslint-config/
│  └─ typescript-config/
└─ turbo.json / pnpm-workspace.yaml
```

Conventions:
- UI primitives from `shadcn/ui`
- Business logic in small, testable utilities/hooks
- Reusable components in `components/` with `@/` alias

## ⚠️ Limitations

- Stack‑specific: Next.js + Prisma + Tailwind + shadcn/ui + Elysia
- No customization API yet (component overrides, field mapping)
- No custom actions/hooks yet
- File uploads are not implemented yet

## 🗺️ Roadmap (Short)

- File uploads with env‑driven storage backends
- Component overrides and per‑model UI config
- Custom actions and lifecycle hooks
- Role‑based access control

## 📄 License

MIT — see [LICENSE](./LICENSE)
