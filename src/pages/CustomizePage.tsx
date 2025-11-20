/**
 * 定制页面
 */
import { useState } from 'react'
import { useShoeStore } from '@/stores'
import { ShoeType } from '@/types/models'
import { Card, Button, Slider, Toggle } from '@/components/ui'

export function CustomizePage() {
  const { currentCustomization, updateShoeType, updateColor, updateMaterial } = useShoeStore()
  const [activeTab, setActiveTab] = useState<'style' | 'color' | 'material'>('style')

  const shoeTypes = [
    { type: ShoeType.ATHLETIC, label: '运动鞋', icon: '🏃', description: '适合运动和户外活动' },
    { type: ShoeType.CASUAL, label: '休闲鞋', icon: '👟', description: '日常穿着，舒适百搭' },
    { type: ShoeType.LEARNING, label: '学步鞋', icon: '👶', description: '专为学步儿童设计' },
    { type: ShoeType.SANDALS, label: '凉鞋', icon: '🩴', description: '夏季透气清凉' },
  ]

  const colors = [
    { name: '海洋蓝', value: '#007AFF' },
    { name: '活力红', value: '#FF3B30' },
    { name: '清新绿', value: '#34C759' },
    { name: '阳光黄', value: '#FFCC00' },
    { name: '梦幻紫', value: '#5856D6' },
    { name: '经典黑', value: '#1C1C1E' },
    { name: '纯净白', value: '#FFFFFF' },
    { name: '温柔粉', value: '#FF2D55' },
  ]

  return (
    <div className="min-h-full pb-4">
      {/* 3D 预览区 */}
      <div className="bg-gradient-to-br from-ios-gray-100 to-white p-6 mb-4">
        <div className="aspect-square bg-white rounded-ios-lg shadow-ios flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">👟</div>
            <p className="text-gray-500 text-sm">3D 鞋子预览</p>
            <p className="text-xs text-gray-400 mt-1">旋转查看不同角度</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* 标签页 */}
        <Card padding="none">
          <div className="grid grid-cols-3 gap-0 p-1">
            {[
              { key: 'style', label: '款式', icon: 'fa-shoe-prints' },
              { key: 'color', label: '颜色', icon: 'fa-palette' },
              { key: 'material', label: '材质', icon: 'fa-sliders' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-4 rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-ios-gray-100'
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* 款式选择 */}
        {activeTab === 'style' && (
          <Card>
            <h2 className="text-lg font-semibold mb-4">选择鞋款</h2>
            <div className="grid grid-cols-2 gap-3">
              {shoeTypes.map((shoe) => (
                <button
                  key={shoe.type}
                  onClick={() => updateShoeType(shoe.type)}
                  className={`p-4 rounded-ios border-2 transition-all ${
                    currentCustomization?.type === shoe.type
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{shoe.icon}</div>
                  <div className="font-medium text-gray-900">{shoe.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{shoe.description}</div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* 颜色选择 */}
        {activeTab === 'color' && (
          <Card>
            <h2 className="text-lg font-semibold mb-4">鞋面颜色</h2>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateColor({
                    ...currentCustomization!.color,
                    upperColor: color.value,
                  })}
                  className={`aspect-square rounded-ios border-4 transition-all ${
                    currentCustomization?.color.upperColor === color.value
                      ? 'border-primary scale-105 shadow-lg'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {currentCustomization?.color.upperColor === color.value && (
                    <i className="fas fa-check text-white text-xl drop-shadow-md"></i>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold mb-3">鞋底颜色</h3>
              <div className="grid grid-cols-4 gap-3">
                {colors.slice(0, 4).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateColor({
                      ...currentCustomization!.color,
                      soleColor: color.value,
                    })}
                    className={`aspect-square rounded-ios border-4 transition-all ${
                      currentCustomization?.color.soleColor === color.value
                        ? 'border-primary scale-105 shadow-lg'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {currentCustomization?.color.soleColor === color.value && (
                      <i className="fas fa-check text-white text-xl drop-shadow-md"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* 材质配置 */}
        {activeTab === 'material' && currentCustomization && (
          <>
            <Card>
              <h2 className="text-lg font-semibold mb-4">材质调节</h2>
              <div className="space-y-4">
                <Slider
                  label="鞋面软度"
                  value={currentCustomization.material.upperSoftness}
                  onChange={(value) => updateMaterial({ upperSoftness: value })}
                />
                <Slider
                  label="鞋底软度"
                  value={currentCustomization.material.soleSoftness}
                  onChange={(value) => updateMaterial({ soleSoftness: value })}
                />
                <Slider
                  label="耐用度"
                  value={currentCustomization.material.durability}
                  onChange={(value) => updateMaterial({ durability: value })}
                />
                <Slider
                  label="足弓支撑"
                  value={currentCustomization.material.archSupport}
                  onChange={(value) => updateMaterial({ archSupport: value })}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-3">特殊材料</h2>
              <div className="space-y-1">
                <Toggle
                  label="透气材料"
                  description="增强透气性，保持双脚干爽"
                  checked={currentCustomization.material.breathable}
                  onChange={(checked) => updateMaterial({ breathable: checked })}
                />
                <Toggle
                  label="防水涂层"
                  description="防溅水，雨天也能放心穿着 (+¥50)"
                  checked={currentCustomization.material.waterproof}
                  onChange={(checked) => updateMaterial({ waterproof: checked })}
                />
                <Toggle
                  label="抗菌内里"
                  description="抑制细菌生长，保持卫生 (+¥30)"
                  checked={currentCustomization.material.antibacterial}
                  onChange={(checked) => updateMaterial({ antibacterial: checked })}
                />
                <Toggle
                  label="缓震鞋垫"
                  description="减轻冲击力，保护足部 (+¥40)"
                  checked={currentCustomization.material.cushioning}
                  onChange={(checked) => updateMaterial({ cushioning: checked })}
                />
              </div>
            </Card>
          </>
        )}

        {/* 底部按钮 */}
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="flex-1">
            重置
          </Button>
          <Button variant="primary" size="lg" className="flex-1" icon="fa-check">
            保存定制
          </Button>
        </div>
      </div>
    </div>
  )
}
