'use client'

import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Input,
  Textarea 
} from '@prismate/ui'
import { 
  useTheme, 
  useDirection, 
  useLocale,
  useDebounce,
  useLocalStorage,
  useMediaQuery
} from '@prismate/ui'
import { useState } from 'react'
import { Loader2, Moon, Sun, Languages, RotateCw } from 'lucide-react'

export default function ExamplePage() {
  const { theme, setTheme } = useTheme()
  const { direction, setDirection } = useDirection()
  const { locale, setLocale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [settings, setSettings] = useLocalStorage('demo-settings', {})
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Prismate UI Components Demo</h1>
      
      {/* Theme Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Theme & Settings</CardTitle>
          <CardDescription>
            Control theme, direction, and language settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              leftIcon={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              leftIcon={<RotateCw className="h-4 w-4" />}
            >
              {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setLocale(locale === 'en-US' ? 'fa-IR' : 'en-US')}
              leftIcon={<Languages className="h-4 w-4" />}
            >
              {locale === 'en-US' ? 'فارسی' : 'English'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Example */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>
            Input fields with validation and different states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            helperText="We'll never share your email"
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            error="Password must be at least 8 characters"
          />
          
          <Input
            label="Search"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            helperText={debouncedSearch ? `Searching for: ${debouncedSearch}` : 'Start typing to search'}
          />
          
          <Textarea
            label="Description"
            placeholder="Enter a detailed description"
            rows={4}
            helperText="Maximum 500 characters"
          />
        </CardContent>
        <CardFooter className="gap-2">
          <Button 
            variant="default" 
            onClick={handleSubmit}
            loading={loading}
            leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
          >
            {loading ? 'Processing...' : 'Submit Form'}
          </Button>
          <Button variant="outline">
            Cancel
          </Button>
        </CardFooter>
      </Card>

      {/* Button Variants */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            Different button styles and states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button fullWidth className="mt-2">Full Width</Button>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Info */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Information</CardTitle>
          <CardDescription>
            Current viewport and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Theme:</strong> {theme}</p>
            <p><strong>Direction:</strong> {direction}</p>
            <p><strong>Locale:</strong> {locale}</p>
            <p><strong>Device:</strong> {isMobile ? 'Mobile' : 'Desktop'}</p>
            <p><strong>Stored Settings:</strong> {JSON.stringify(settings)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}