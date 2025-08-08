
import { Shield } from 'lucide-react'

interface AdminBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
}

export function AdminBadge({ 
  className = '', 
  size = 'md', 
  showIcon = true, 
  showText = true 
}: AdminBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 font-medium rounded-full border border-orange-200 ${sizeClasses[size]} ${className}`}>
      {showIcon && <Shield className={iconSizes[size]} />}
      {showText && 'Admin'}
    </span>
  )
}
