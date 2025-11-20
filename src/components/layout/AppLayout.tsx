/**
 * 应用主布局
 */
import { ReactNode } from 'react'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'

interface AppLayoutProps {
  children: ReactNode
  showTabBar?: boolean
}

export function AppLayout({ children, showTabBar = true }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-ios-gray-100">
      <StatusBar />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {showTabBar && <TabBar />}
    </div>
  )
}
