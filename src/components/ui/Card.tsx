/**
 * iOS 风格卡片组件
 */
import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, onClick, padding = 'md' }: CardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }[padding]

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-ios-lg shadow-ios-card',
        paddingClass,
        onClick && 'cursor-pointer active:opacity-80 transition-opacity',
        className
      )}
    >
      {children}
    </div>
  )
}
