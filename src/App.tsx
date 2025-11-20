/**
 * 主应用组件
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { ScanPage } from '@/pages/ScanPage'
import { CustomizePage } from '@/pages/CustomizePage'
import { GrowthPage } from '@/pages/GrowthPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { useAppStore, useShoeStore } from '@/stores'
import { ShoeType, Gender, MembershipTier } from '@/types/models'

function App() {
  const { setCurrentUser } = useAppStore()
  const { startCustomization } = useShoeStore()

  // 初始化应用数据
  useEffect(() => {
    // 模拟用户数据
    const mockUser = {
      id: 'user_1',
      username: '张女士',
      phone: '138****8888',
      membershipTier: MembershipTier.VIP,
      points: 1250,
      isVerified: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
      children: [
        {
          id: 'child_1',
          userId: 'user_1',
          name: '小明',
          birthDate: new Date('2019-06-15'),
          gender: Gender.MALE,
          currentHeight: 116,
          currentWeight: 20,
          footScans: [
            {
              id: 'scan_1',
              childId: 'child_1',
              scanDate: new Date('2025-11-15'),
              footSide: 'right' as any,
              status: 'completed' as any,
              measurements: {
                length: 190,
                width: 72,
                height: 55,
                archHeight: 18,
                heelWidth: 65,
                ballWidth: 75,
                instepHeight: 52,
              },
              scanQuality: 'high' as any,
              createdAt: new Date('2025-11-15'),
              updatedAt: new Date('2025-11-15'),
            },
            {
              id: 'scan_2',
              childId: 'child_1',
              scanDate: new Date('2025-10-01'),
              footSide: 'left' as any,
              status: 'completed' as any,
              measurements: {
                length: 189,
                width: 71,
                height: 54,
                archHeight: 17,
                heelWidth: 64,
                ballWidth: 74,
                instepHeight: 51,
              },
              scanQuality: 'high' as any,
              createdAt: new Date('2025-10-01'),
              updatedAt: new Date('2025-10-01'),
            },
          ],
          growthRecords: [],
          shoes: [],
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date(),
        },
      ],
      addresses: [],
    }

    setCurrentUser(mockUser)

    // 初始化定制
    startCustomization(ShoeType.ATHLETIC, 30)
  }, [setCurrentUser, startCustomization])

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* 其他路由可以在这里添加 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
