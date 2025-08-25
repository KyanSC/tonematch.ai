import { cn } from '@/lib/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95',
          {
            'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md': variant === 'secondary',
            'border-2 border-gray-300 bg-transparent hover:bg-gray-50 hover:border-gray-400': variant === 'outline',
            'bg-transparent hover:bg-gray-100 text-gray-700': variant === 'ghost',
            'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-glow hover:shadow-glow-lg': variant === 'gradient',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-14 px-8 text-xl': size === 'xl',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
