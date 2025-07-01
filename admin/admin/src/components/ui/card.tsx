import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg border bg-gray-900 border-gray-800 shadow-md',
      className
    )}>
      {children}
    </div>
  )
}