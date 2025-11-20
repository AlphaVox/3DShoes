/**
 * 扫描页面
 */
import { useState } from 'react'
import { useScanStore } from '@/stores'
import { FootSide, ScanStatus } from '@/types/models'
import { Card, Button } from '@/components/ui'

export function ScanPage() {
  const { currentScan, scanProgress, startScan, cancelScan } = useScanStore()
  const [selectedSide, setSelectedSide] = useState<FootSide>(FootSide.RIGHT)
  const [scanQuality, setScanQuality] = useState<'low' | 'medium' | 'high'>('medium')

  const handleStartScan = () => {
    startScan('child_1', selectedSide)

    // 模拟扫描过程
    simulateScanProgress()
  }

  const simulateScanProgress = () => {
    const steps = [
      { status: ScanStatus.PREPARING, progress: 0, message: '正在准备扫描...' },
      { status: ScanStatus.SCANNING, progress: 20, message: '请保持脚部静止' },
      { status: ScanStatus.SCANNING, progress: 40, message: '正在扫描脚掌...' },
      { status: ScanStatus.SCANNING, progress: 60, message: '正在扫描足弓...' },
      { status: ScanStatus.SCANNING, progress: 80, message: '正在扫描脚后跟...' },
      { status: ScanStatus.PROCESSING, progress: 90, message: '正在处理数据...' },
      { status: ScanStatus.COMPLETED, progress: 100, message: '扫描完成！' },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        useScanStore.getState().updateScanProgress(step)
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 1500)
  }

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">3D 足部扫描</h1>
        <p className="text-gray-500 mt-1">使用 LiDAR 技术精确测量足部</p>
      </div>

      {!currentScan ? (
        <>
          {/* 扫描准备 */}
          <Card>
            <h2 className="text-lg font-semibold mb-3">扫描准备</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>确保在光线充足的环境中</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>脱下袜子，保持脚部清洁</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>将脚部平放在地面上</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>扫描过程中保持静止</span>
              </div>
            </div>
          </Card>

          {/* 选择扫描脚 */}
          <Card>
            <h2 className="text-lg font-semibold mb-3">选择扫描位置</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSide(FootSide.LEFT)}
                className={`p-4 rounded-ios border-2 transition-all ${
                  selectedSide === FootSide.LEFT
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <i className="fas fa-shoe-prints text-3xl mb-2"></i>
                <div className="font-medium">左脚</div>
              </button>
              <button
                onClick={() => setSelectedSide(FootSide.RIGHT)}
                className={`p-4 rounded-ios border-2 transition-all ${
                  selectedSide === FootSide.RIGHT
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <i className="fas fa-shoe-prints text-3xl mb-2 transform scale-x-[-1]"></i>
                <div className="font-medium">右脚</div>
              </button>
            </div>
          </Card>

          {/* 扫描质量 */}
          <Card>
            <h2 className="text-lg font-semibold mb-3">扫描精度</h2>
            <div className="space-y-2">
              {[
                { value: 'low', label: '快速扫描', time: '~30秒' },
                { value: 'medium', label: '标准扫描', time: '~60秒' },
                { value: 'high', label: '高精度扫描', time: '~90秒' },
              ].map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => setScanQuality(quality.value as any)}
                  className={`w-full p-3 rounded-ios border-2 transition-all text-left ${
                    scanQuality === quality.value
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{quality.label}</span>
                    <span className="text-sm text-gray-500">{quality.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* 开始按钮 */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="fa-camera"
            onClick={handleStartScan}
          >
            开始扫描
          </Button>
        </>
      ) : (
        <>
          {/* 扫描进行中 */}
          <Card>
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                {scanProgress?.status === ScanStatus.COMPLETED ? (
                  <i className="fas fa-check text-5xl text-white"></i>
                ) : (
                  <i className="fas fa-shoe-prints text-5xl text-white animate-pulse"></i>
                )}
              </div>

              <h2 className="text-xl font-bold mb-2">{scanProgress?.message}</h2>

              {scanProgress && scanProgress.progress < 100 && (
                <>
                  <div className="w-full bg-ios-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${scanProgress.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500">
                    {scanProgress.progress}% 完成
                  </p>
                </>
              )}

              {scanProgress?.status === ScanStatus.COMPLETED && (
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6"
                  onClick={() => {
                    // 查看结果
                    cancelScan()
                  }}
                >
                  查看结果
                </Button>
              )}

              {scanProgress?.status !== ScanStatus.COMPLETED && (
                <Button
                  variant="outline"
                  size="md"
                  className="mt-6"
                  onClick={cancelScan}
                >
                  取消扫描
                </Button>
              )}
            </div>
          </Card>

          {/* 扫描提示 */}
          {scanProgress?.status === ScanStatus.SCANNING && (
            <Card className="bg-blue-50 border-2 border-primary">
              <div className="flex items-start gap-3">
                <i className="fas fa-info-circle text-primary text-xl"></i>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-900 mb-1">扫描提示</p>
                  <p className="text-gray-600">
                    请保持脚部静止，慢慢移动设备环绕脚部进行扫描
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
