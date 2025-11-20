/**
 * 个人资料页面
 */
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { Card } from '@/components/ui'

export function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, setActiveChild } = useAppStore()

  const menuSections = [
    {
      title: '我的服务',
      items: [
        { icon: 'fa-box', label: '我的订单', path: '/orders', badge: '3' },
        { icon: 'fa-ticket', label: '优惠券', path: '/coupons', badge: '5' },
        { icon: 'fa-heart', label: '我的收藏', path: '/favorites' },
        { icon: 'fa-location-dot', label: '收货地址', path: '/addresses' },
      ],
    },
    {
      title: '设置',
      items: [
        { icon: 'fa-bell', label: '通知设置', path: '/settings/notifications' },
        { icon: 'fa-shield', label: '隐私设置', path: '/settings/privacy' },
        { icon: 'fa-circle-question', label: '帮助中心', path: '/help' },
        { icon: 'fa-circle-info', label: '关于我们', path: '/about' },
      ],
    },
  ]

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* 用户信息卡片 */}
      <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-user text-4xl"></i>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{currentUser?.username || '用户'}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {currentUser?.membershipTier === 'vip' ? 'VIP 会员' : '普通会员'}
              </span>
              {currentUser?.isVerified && (
                <i className="fas fa-circle-check text-xl"></i>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{currentUser?.children?.length || 0}</div>
            <div className="text-white/80 text-sm mt-1">孩子</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-white/80 text-sm mt-1">订单</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentUser?.points || 0}</div>
            <div className="text-white/80 text-sm mt-1">积分</div>
          </div>
        </div>
      </Card>

      {/* 孩子列表 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">我的孩子</h2>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            <i className="fas fa-plus"></i>
            添加孩子
          </button>
        </div>

        <div className="space-y-3">
          {currentUser?.children.map((child) => (
            <button
              key={child.id}
              onClick={() => setActiveChild(child.id)}
              className="w-full flex items-center gap-4 p-3 rounded-ios bg-ios-gray-100 hover:bg-ios-gray-200 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl">
                {child.gender === 'male' ? '👦' : '👧'}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{child.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date().getFullYear() - new Date(child.birthDate).getFullYear()} 岁
                </p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-child text-4xl mb-2 opacity-30"></i>
              <p>暂无孩子信息</p>
            </div>
          )}
        </div>
      </Card>

      {/* 菜单列表 */}
      {menuSections.map((section, index) => (
        <Card key={index}>
          <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
          <div className="space-y-1">
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-3 rounded-ios hover:bg-ios-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-ios-gray-100 flex items-center justify-center">
                  <i className={`fas ${item.icon} text-primary`}></i>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-gray-900">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-danger text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            ))}
          </div>
        </Card>
      ))}

      {/* 退出登录 */}
      <button className="w-full py-4 bg-white rounded-ios text-danger font-medium shadow-ios-card">
        退出登录
      </button>

      {/* 底部空白 */}
      <div className="h-4"></div>
    </div>
  )
}
