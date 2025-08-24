/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        fa: ["var(--font-fa)", "Tahoma", "sans-serif"],
        ar: ["var(--font-ar)", "Tahoma", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-out-to-right": "slide-out-to-right 0.3s ease-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // RTL support plugin
    function({ addUtilities, addVariant, e }) {
      addVariant('rtl', ({ modifySelectors, separator }) => {
        return modifySelectors(({ className }) => {
          return `[dir="rtl"] .${e(`rtl${separator}${className}`)}`
        })
      })
      addVariant('ltr', ({ modifySelectors, separator }) => {
        return modifySelectors(({ className }) => {
          return `[dir="ltr"] .${e(`ltr${separator}${className}`)}`
        })
      })
      
      // Add direction-aware utilities
      const directionUtilities = {
        '.start-0': { insetInlineStart: '0' },
        '.end-0': { insetInlineEnd: '0' },
        '.start-auto': { insetInlineStart: 'auto' },
        '.end-auto': { insetInlineEnd: 'auto' },
        '.ms-auto': { marginInlineStart: 'auto' },
        '.me-auto': { marginInlineEnd: 'auto' },
        '.ps-0': { paddingInlineStart: '0' },
        '.pe-0': { paddingInlineEnd: '0' },
        '.text-start': { textAlign: 'start' },
        '.text-end': { textAlign: 'end' },
        '.border-s': { borderInlineStartWidth: '1px' },
        '.border-e': { borderInlineEndWidth: '1px' },
        '.rounded-s': { borderStartStartRadius: '0.25rem', borderEndStartRadius: '0.25rem' },
        '.rounded-e': { borderStartEndRadius: '0.25rem', borderEndEndRadius: '0.25rem' },
      }
      
      addUtilities(directionUtilities)
    }
  ],
}