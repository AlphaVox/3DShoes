/**
 * 首页
 */
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'

export function HomePage() {
  const navigate = useNavigate()
  const { currentUser, activeChildId } = useAppStore()

  const activeChild = currentUser?.children.find(c => c.id === activeChildId)

  const quickActions = [
    { icon: 'fa-camera', label: '扫描足部', path: '/scan', color: 'bg-blue-500' },
    { icon: 'fa-palette', label: '定制鞋子', path: '/customize', color: 'bg-purple-500' },
    { icon: 'fa-chart-line', label: '成长记录', path: '/growth', color: 'bg-green-500' },
    { icon: 'fa-box', label: '我的鞋子', path: '/shoes', color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* 欢迎卡片 */}
      <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-user text-3xl"></i>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              你好，{currentUser?.username || '用户'}
            </h1>
            {activeChild && (
              <p className="text-white/90 mt-1">
                当前孩子：{activeChild.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Card
            key={action.path}
            className="cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate(action.path)}
            padding="lg"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-14 h-14 rounded-full ${action.color} text-white flex items-center justify-center`}>
                <i className={`fas ${action.icon} text-2xl`}></i>
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* 最近扫描 */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 px-1">最近扫描</h2>
        <Card>
          <div className="space-y-3">
            {activeChild?.footScans.slice(0, 3).map((scan) => (
              <div
                key={scan.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="w-12 h-12 rounded-lg bg-ios-gray-100 flex items-center justify-center">
                  <i className="fas fa-shoe-prints text-primary"></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {scan.footSide === 'left' ? '左脚' : '右脚'}扫描
                  </div>
                  <div className="text-sm text-gray-500">
                    {scan.measurements.length.toFixed(1)} mm
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(scan.scanDate).toLocaleDateString('zh-CN')}
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2 opacity-30"></i>
                <p>暂无扫描记录</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 推荐鞋款 */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 px-1">推荐鞋款</h2>
        <div className="space-y-3">
          {[
            { name: '儿童运动鞋', type: '运动鞋', price: 299, image: '🏃' },
            { name: '透气学步鞋', type: '学步鞋', price: 259, image: '👶' },
          ].map((shoe, index) => (
            <Card key={index} className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-ios-gray-100 flex items-center justify-center text-4xl">
                {shoe.image}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{shoe.name}</h3>
                <p className="text-sm text-gray-500">{shoe.type}</p>
                <p className="text-lg font-bold text-primary mt-1">¥{shoe.price}</p>
              </div>
              <Button variant="primary" size="sm">
                定制
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
