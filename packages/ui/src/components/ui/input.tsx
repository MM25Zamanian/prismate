import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2 py-1 text-xs",
        lg: "h-11 px-4 py-3",
      },
      variant: {
        default: "",
        ghost: "border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        filled: "bg-muted border-0",
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'error'> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  error?: boolean | string
  helperText?: string
  label?: string
  required?: boolean
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    size,
    variant,
    error,
    leftIcon,
    rightIcon,
    leftElement,
    rightElement,
    helperText,
    label,
    required,
    fullWidth,
    disabled,
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : helperText
    
    const inputElement = (
      <div className={cn(
        "relative",
        fullWidth && "w-full"
      )}>
        {leftElement && (
          <div className="absolute start-0 top-0 h-full flex items-center ps-3">
            {leftElement}
          </div>
        )}
        {leftIcon && !leftElement && (
          <div className="absolute start-0 top-0 h-full flex items-center ps-3 pointer-events-none">
            <span className="text-muted-foreground">{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            inputVariants({ size, variant, error: hasError, className }),
            (leftIcon || leftElement) && "ps-10",
            (rightIcon || rightElement) && "pe-10"
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightIcon && !rightElement && (
          <div className="absolute end-0 top-0 h-full flex items-center pe-3 pointer-events-none">
            <span className="text-muted-foreground">{rightIcon}</span>
          </div>
        )}
        {rightElement && (
          <div className="absolute end-0 top-0 h-full flex items-center pe-3">
            {rightElement}
          </div>
        )}
      </div>
    )
    
    if (label || errorMessage) {
      return (
        <div className={cn("space-y-2", fullWidth && "w-full")}>
          {label && (
            <label 
              htmlFor={inputId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                hasError && "text-destructive"
              )}
            >
              {label}
              {required && <span className="text-destructive ms-1">*</span>}
            </label>
          )}
          {inputElement}
          {errorMessage && (
            <p 
              id={`${inputId}-error`}
              className={cn(
                "text-sm",
                hasError ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {errorMessage}
            </p>
          )}
        </div>
      )
    }
    
    return inputElement
  }
)
Input.displayName = "Input"

// Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Pick<VariantProps<typeof inputVariants>, 'variant'> {
  error?: boolean | string
  helperText?: string
  label?: string
  required?: boolean
  fullWidth?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    variant,
    error,
    helperText,
    label,
    required,
    fullWidth,
    disabled,
    id,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId()
    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : helperText
    
    const textareaElement = (
      <textarea
        id={textareaId}
        className={cn(
          inputVariants({ variant, error: hasError }),
          "min-h-[80px] resize-y",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={errorMessage ? `${textareaId}-error` : undefined}
        {...props}
      />
    )
    
    if (label || errorMessage) {
      return (
        <div className={cn("space-y-2", fullWidth && "w-full")}>
          {label && (
            <label 
              htmlFor={textareaId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                hasError && "text-destructive"
              )}
            >
              {label}
              {required && <span className="text-destructive ms-1">*</span>}
            </label>
          )}
          {textareaElement}
          {errorMessage && (
            <p 
              id={`${textareaId}-error`}
              className={cn(
                "text-sm",
                hasError ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {errorMessage}
            </p>
          )}
        </div>
      )
    }
    
    return textareaElement
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea, inputVariants }