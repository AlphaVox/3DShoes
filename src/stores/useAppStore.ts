/**
 * 应用全局状态管理
 */
import { create } from 'zustand'
import { User } from '@/types/models'

interface AppStore {
  // 用户状态
  currentUser: User | null
  isAuthenticated: boolean

  // 当前选中的孩子
  activeChildId: string | null

  // UI状态
  isLoading: boolean
  error: string | null

  // 导航
  currentRoute: string

  // Actions
  setCurrentUser: (user: User | null) => void
  setActiveChild: (childId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentRoute: (route: string) => void
  logout: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  activeChildId: null,
  isLoading: false,
  error: null,
  currentRoute: '/home',

  // Actions
  setCurrentUser: (user) => set({
    currentUser: user,
    isAuthenticated: !!user,
    // 如果有孩子，默认选中第一个
    activeChildId: user?.children?.[0]?.id || null
  }),

  setActiveChild: (childId) => set({ activeChildId: childId }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setCurrentRoute: (route) => set({ currentRoute: route }),

  logout: () => set({
    currentUser: null,
    isAuthenticated: false,
    activeChildId: null
  }),
}))
