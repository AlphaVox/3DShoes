/**
 * 成长追踪页面
 */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppStore } from '@/stores'
import { Card } from '@/components/ui'

export function GrowthPage() {
  const { currentUser, activeChildId } = useAppStore()
  const activeChild = currentUser?.children.find(c => c.id === activeChildId)

  // 模拟成长数据
  const growthData = [
    { age: 1, footLength: 11.5, height: 75 },
    { age: 2, footLength: 13.0, height: 87 },
    { age: 3, footLength: 14.5, height: 96 },
    { age: 4, footLength: 16.0, height: 103 },
    { age: 5, footLength: 17.5, height: 110 },
    { age: 6, footLength: 19.0, height: 116 },
  ]

  const milestones = [
    { age: '1岁', title: '开始学步', description: '第一双学步鞋', icon: '👶', date: '2023-06' },
    { age: '2岁', title: '稳定行走', description: '足弓开始发育', icon: '🚶', date: '2024-06' },
    { age: '3岁', title: '跑跳自如', description: '活动量增加', icon: '🏃', date: '2025-06' },
  ]

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">成长追踪</h1>
        <p className="text-gray-500 mt-1">记录孩子的成长轨迹</p>
      </div>

      {/* 儿童信息卡片 */}
      {activeChild && (
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {activeChild.gender === 'male' ? '👦' : '👧'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{activeChild.name}</h2>
              <p className="text-white/90 mt-1">
                {new Date().getFullYear() - new Date(activeChild.birthDate).getFullYear()} 岁
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeChild.currentHeight || 116} cm
              </div>
              <div className="text-white/80 text-sm">身高</div>
            </div>
          </div>
        </Card>
      )}

      {/* 足部生长曲线 */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">足部生长曲线</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
            <XAxis
              dataKey="age"
              label={{ value: '年龄', position: 'insideBottom', offset: -5 }}
              stroke="#8E8E93"
            />
            <YAxis
              label={{ value: '脚长 (cm)', angle: -90, position: 'insideLeft' }}
              stroke="#8E8E93"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="footLength"
              stroke="#007AFF"
              strokeWidth={3}
              dot={{ fill: '#007AFF', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 健康分析 */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">健康分析</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">生长速度正常</h3>
              <p className="text-sm text-gray-500 mt-1">
                足部生长曲线平稳，符合该年龄段标准
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info-circle text-blue-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">足弓发育良好</h3>
              <p className="text-sm text-gray-500 mt-1">
                足弓高度适中，建议继续保持良好的运动习惯
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-orange-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">建议更换鞋子</h3>
              <p className="text-sm text-gray-500 mt-1">
                当前鞋码已穿着 3 个月，建议重新测量并更换
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 成长里程碑 */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">成长里程碑</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {milestone.icon}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 h-full bg-ios-gray-200 my-2"></div>
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded">
                    {milestone.age}
                  </span>
                  <span className="text-xs text-gray-400">{milestone.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 照片记录 */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">成长照片</h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-ios bg-ios-gray-100 flex items-center justify-center"
            >
              <i className="fas fa-image text-3xl text-gray-300"></i>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
