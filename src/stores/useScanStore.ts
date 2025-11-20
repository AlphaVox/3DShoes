/**
 * 扫描状态管理
 */
import { create } from 'zustand'
import { FootScan, FootSide, ScanStatus } from '@/types/models'

interface ScanProgress {
  status: ScanStatus
  progress: number
  message: string
  estimatedTimeRemaining?: number
}

interface ScanStore {
  // 扫描历史
  scans: FootScan[]

  // 当前扫描
  currentScan: FootScan | null
  currentSide: FootSide
  scanProgress: ScanProgress | null

  // Actions
  setScans: (scans: FootScan[]) => void
  addScan: (scan: FootScan) => void
  startScan: (childId: string, side: FootSide) => void
  updateScanProgress: (progress: ScanProgress) => void
  completeScan: (scan: FootScan) => void
  cancelScan: () => void
  setScanQuality: (quality: 'low' | 'medium' | 'high') => void
}

export const useScanStore = create<ScanStore>((set) => ({
  // Initial state
  scans: [],
  currentScan: null,
  currentSide: FootSide.RIGHT,
  scanProgress: null,

  // Actions
  setScans: (scans) => set({ scans }),

  addScan: (scan) => set((state) => ({
    scans: [scan, ...state.scans]
  })),

  startScan: (childId, side) => {
    const newScan: Partial<FootScan> = {
      id: `scan_${Date.now()}`,
      childId,
      footSide: side,
      status: ScanStatus.PREPARING,
      scanDate: new Date(),
      measurements: {
        length: 0,
        width: 0,
        height: 0,
        archHeight: 0,
        heelWidth: 0,
        ballWidth: 0,
        instepHeight: 0,
      },
      scanQuality: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set({
      currentScan: newScan as FootScan,
      currentSide: side,
      scanProgress: {
        status: ScanStatus.PREPARING,
        progress: 0,
        message: '正在准备扫描...',
      }
    })
  },

  updateScanProgress: (progress) => set({ scanProgress: progress }),

  completeScan: (scan) => set((state) => ({
    currentScan: null,
    scanProgress: null,
    scans: [scan, ...state.scans],
  })),

  cancelScan: () => set({
    currentScan: null,
    scanProgress: null
  }),

  setScanQuality: (quality) => set((state) => ({
    currentScan: state.currentScan ? {
      ...state.currentScan,
      scanQuality: quality,
    } : null,
  })),
}))
