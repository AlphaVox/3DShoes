/**
 * iOS 风格按钮组件
 */
import { ReactNode, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClass = 'font-medium rounded-ios transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClass = {
    primary: 'bg-primary text-white shadow-md hover:bg-blue-600',
    secondary: 'bg-ios-gray-100 text-gray-900 hover:bg-ios-gray-200',
    outline: 'border-2 border-primary text-primary hover:bg-blue-50',
    text: 'text-primary hover:bg-blue-50',
  }[variant]

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size]

  return (
    <button
      className={clsx(
        baseClass,
        variantClass,
        sizeClass,
        fullWidth && 'w-full',
        'flex items-center justify-center gap-2',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <i className={`fas ${icon}`}></i>}
      {children}
    </button>
  )
}
