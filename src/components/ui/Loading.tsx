/**
 * 加载指示器
 */
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function Loading({ size = 'md', text }: LoadingProps) {
  const sizeClass = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size]

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeClass} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}
