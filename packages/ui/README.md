# @prismate/ui

Production-ready admin panel UI package for Prismate with **single-import PrismateAdmin component** that provides a complete admin interface.

## 🚀 Quick Start - Single Import Admin Panel

```tsx
import { PrismateAdmin } from '@prismate/ui'

const models = [
  {
    name: 'user',
    displayName: 'Users',
    fields: [
      { name: 'id', type: 'number', label: 'ID', readOnly: true },
      { name: 'name', type: 'string', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
    ]
  }
]

export default function AdminPage() {
  return (
    <PrismateAdmin
      config={{
        models,
        title: 'My Admin Panel',
        apiUrl: '/api/admin'
      }}
    />
  )
}
```

**That's it!** You now have a fully functional admin panel with:
- ✅ CRUD operations
- ✅ Search & filtering
- ✅ Pagination
- ✅ Responsive design
- ✅ Dark mode support
- ✅ RTL support

## Features

✨ **Modern Stack**
- Built with Next.js 15+ App Router
- TypeScript 5.x with strict mode
- Tailwind CSS 4.x for styling
- shadcn/ui components

🌍 **Internationalization**
- Full RTL/LTR support
- Multi-language ready
- Locale-aware formatting
- Direction-aware animations

🎨 **Theming**
- Light/Dark/System themes
- CSS variables for customization
- Responsive design
- Mobile-first approach

⚡ **Performance**
- Virtual scrolling for large datasets
- Lazy loading components
- Optimized bundle size
- Memory-efficient rendering

♿ **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus management

## Installation

```bash
# Using pnpm (recommended)
pnpm add @prismate/ui

# Using npm
npm install @prismate/ui

# Using yarn
yarn add @prismate/ui
```

## Quick Start

### 1. Import Styles

Add the styles to your app's root layout or `_app.tsx`:

```tsx
// app/layout.tsx or pages/_app.tsx
import '@prismate/ui/styles'
// or
import '@prismate/ui/dist/styles.css'
```

### 2. Setup Provider

Wrap your app with the `ConfigProvider`:

```tsx
import { ConfigProvider } from '@prismate/ui'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          config={{
            theme: 'system',
            direction: 'ltr',
            locale: 'en-US',
            apiBaseUrl: '/api/prismate',
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
```

### 3. Use Components

```tsx
import { Button, Card, Input } from '@prismate/ui'

export default function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome to Prismate UI</Card.Title>
        <Card.Description>
          Production-ready admin components
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Input 
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </Card.Content>
      <Card.Footer>
        <Button variant="primary">Get Started</Button>
      </Card.Footer>
    </Card>
  )
}
```

## Configuration

### ConfigProvider Options

```tsx
interface PrismateUIConfig {
  // Theme settings
  theme?: 'light' | 'dark' | 'system'
  direction?: 'ltr' | 'rtl'
  locale?: string
  
  // API settings
  apiBaseUrl?: string
  apiHeaders?: Record<string, string>
  
  // Formatting
  dateFormat?: Intl.DateTimeFormatOptions
  numberFormat?: Intl.NumberFormatOptions
  
  // Features
  features?: {
    search?: boolean
    filter?: boolean
    sort?: boolean
    pagination?: boolean
    export?: boolean
    import?: boolean
    bulkActions?: boolean
    virtualization?: boolean
    infiniteScroll?: boolean
    realtime?: boolean
  }
  
  // Custom components
  customComponents?: {
    [key: string]: ComponentType<any>
  }
  
  // Hooks
  hooks?: {
    beforeRequest?: (config: RequestConfig) => RequestConfig
    afterRequest?: (response: any) => any
    onError?: (error: Error) => void
  }
}
```

## Components

### Base Components

- **Button** - Versatile button with loading states
- **Input** - Text input with validation support
- **Card** - Container component for content
- **Select** - Dropdown selection
- **Checkbox** - Checkbox with label
- **Radio** - Radio button groups
- **Switch** - Toggle switch
- **Dialog** - Modal dialogs
- **Tooltip** - Informative tooltips
- **Popover** - Contextual popovers

### Admin Components

- **AdminLayout** - Main layout wrapper
- **AdminSidebar** - Navigation sidebar
- **AdminHeader** - Top header bar
- **DataTable** - Advanced data table
- **ModelForm** - Dynamic form generation
- **FilterPanel** - Advanced filtering

## Hooks

### Data Fetching

```tsx
import { useModelList, useModelDetail, useCreateModel } from '@prismate/ui'

// Fetch list of records
const { data, isLoading } = useModelList('users', {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
})

// Fetch single record
const { data: user } = useModelDetail('users', userId)

// Create new record
const createMutation = useCreateModel('users', {
  onSuccess: () => {
    console.log('User created!')
  },
})
```

### Utility Hooks

```tsx
import { 
  useDebounce, 
  useLocalStorage, 
  useMediaQuery,
  useTheme,
  useDirection 
} from '@prismate/ui'

// Debounce values
const debouncedSearch = useDebounce(searchTerm, 500)

// Local storage
const [settings, setSettings] = useLocalStorage('app-settings', {})

// Media queries
const isMobile = useMediaQuery('(max-width: 768px)')

// Theme management
const { theme, setTheme } = useTheme()

// Direction management
const { direction, setDirection } = useDirection()
```

## RTL Support

The package includes comprehensive RTL support:

### Direction-Aware Classes

```tsx
// Use logical properties
<div className="ps-4 me-2">  // padding-start, margin-end
  <Button className="rounded-s-lg">  // rounded-start
    Content
  </Button>
</div>

// Direction-aware animations
<div className="animate-slide-in-start">
  Slides from start direction
</div>
```

### Switching Direction

```tsx
import { useDirection } from '@prismate/ui'

function DirectionToggle() {
  const { direction, setDirection } = useDirection()
  
  return (
    <Button 
      onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
    >
      {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
    </Button>
  )
}
```

## Theming

### Using CSS Variables

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --radius: 0.5rem;
  /* ... other variables */
}
```

### Custom Theme

```tsx
<ConfigProvider
  config={{
    theme: 'custom',
  }}
>
  <style jsx global>{`
    :root {
      --primary: 259 94% 51%;
      --primary-foreground: 0 0% 100%;
    }
  `}</style>
  {children}
</ConfigProvider>
```

## TypeScript

The package is fully typed with TypeScript:

```tsx
import type { 
  ModelSchema, 
  PaginationParams,
  Action,
  Column 
} from '@prismate/ui'

const userSchema: ModelSchema = {
  name: 'users',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      validation: z.string().email(),
    },
    // ... other fields
  ],
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © Prismate Team