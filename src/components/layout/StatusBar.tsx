/**
 * iOS 风格状态栏
 */
import { useEffect, useState } from 'react'

export function StatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeString = time.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="h-11 bg-white flex items-center justify-between px-6 text-sm font-medium">
      <div className="text-gray-900">{timeString}</div>
      <div className="flex items-center gap-1">
        <i className="fas fa-signal text-xs"></i>
        <i className="fas fa-wifi text-xs"></i>
        <i className="fas fa-battery-three-quarters text-xs"></i>
      </div>
    </div>
  )
}
