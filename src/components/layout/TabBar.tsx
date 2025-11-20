/**
 * iOS 风格底部导航栏
 */
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

interface TabItem {
  path: string
  icon: string
  label: string
}

const tabs: TabItem[] = [
  { path: '/home', icon: 'fa-house', label: '首页' },
  { path: '/scan', icon: 'fa-camera', label: '扫描' },
  { path: '/customize', icon: 'fa-palette', label: '定制' },
  { path: '/growth', icon: 'fa-chart-line', label: '成长' },
  { path: '/profile', icon: 'fa-user', label: '我的' },
]

export function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-around px-2 pb-5">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-lg transition-colors',
              isActive ? 'text-primary' : 'text-gray-500'
            )}
          >
            <i className={`fas ${tab.icon} text-xl`}></i>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
