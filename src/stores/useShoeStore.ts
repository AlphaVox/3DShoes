/**
 * 鞋子定制状态管理
 */
import { create } from 'zustand'
import {
  Shoe,
  ShoeCustomization,
  ShoeType,
  ShoeColor,
  ShoePattern,
  ShoeMaterial
} from '@/types/models'

interface ShoeStore {
  // 鞋子列表
  shoes: Shoe[]

  // 当前定制
  currentCustomization: ShoeCustomization | null

  // 定制步骤
  customizationStep: 'style' | 'color' | 'pattern' | 'material' | 'preview'

  // Actions
  setShoes: (shoes: Shoe[]) => void
  addShoe: (shoe: Shoe) => void

  // 定制相关
  startCustomization: (type: ShoeType, size: number) => void
  updateShoeType: (type: ShoeType) => void
  updateColor: (color: ShoeColor) => void
  updatePattern: (pattern: ShoePattern | undefined) => void
  updateMaterial: (material: Partial<ShoeMaterial>) => void
  setCustomizationStep: (step: ShoeStore['customizationStep']) => void
  saveCustomization: (childId: string) => Shoe
  resetCustomization: () => void
}

const defaultMaterial: ShoeMaterial = {
  upperSoftness: 50,
  soleSoftness: 50,
  durability: 70,
  archSupport: 50,
  breathable: true,
  waterproof: false,
  antibacterial: true,
  cushioning: true,
}

const defaultColor: ShoeColor = {
  upperColor: '#007AFF',
  soleColor: '#FFFFFF',
  laceColor: '#FFFFFF',
  accentColor: '#FF3B30',
}

export const useShoeStore = create<ShoeStore>((set, get) => ({
  // Initial state
  shoes: [],
  currentCustomization: null,
  customizationStep: 'style',

  // Actions
  setShoes: (shoes) => set({ shoes }),

  addShoe: (shoe) => set((state) => ({
    shoes: [shoe, ...state.shoes]
  })),

  startCustomization: (type, size) => {
    const customization: ShoeCustomization = {
      type,
      size,
      color: defaultColor,
      material: defaultMaterial,
    }
    set({
      currentCustomization: customization,
      customizationStep: 'style'
    })
  },

  updateShoeType: (type) => set((state) => ({
    currentCustomization: state.currentCustomization ? {
      ...state.currentCustomization,
      type,
    } : null,
  })),

  updateColor: (color) => set((state) => ({
    currentCustomization: state.currentCustomization ? {
      ...state.currentCustomization,
      color,
    } : null,
  })),

  updatePattern: (pattern) => set((state) => ({
    currentCustomization: state.currentCustomization ? {
      ...state.currentCustomization,
      pattern,
    } : null,
  })),

  updateMaterial: (materialUpdate) => set((state) => ({
    currentCustomization: state.currentCustomization ? {
      ...state.currentCustomization,
      material: {
        ...state.currentCustomization.material,
        ...materialUpdate,
      },
    } : null,
  })),

  setCustomizationStep: (step) => set({ customizationStep: step }),

  saveCustomization: (childId) => {
    const { currentCustomization } = get()
    if (!currentCustomization) {
      throw new Error('No customization in progress')
    }

    const basePrice = 299
    const customizationPrice = calculateCustomizationPrice(currentCustomization)

    const newShoe: Shoe = {
      id: `shoe_${Date.now()}`,
      childId,
      name: `${getShoeTypeName(currentCustomization.type)} - 定制`,
      type: currentCustomization.type,
      customization: currentCustomization,
      basePrice,
      customizationPrice,
      totalPrice: basePrice + customizationPrice,
      isCurrent: false,
      createdAt: new Date(),
    }

    set((state) => ({
      shoes: [newShoe, ...state.shoes],
      currentCustomization: null,
    }))

    return newShoe
  },

  resetCustomization: () => set({
    currentCustomization: null,
    customizationStep: 'style'
  }),
}))

// 辅助函数
function calculateCustomizationPrice(customization: ShoeCustomization): number {
  let price = 0

  // 图案加价
  if (customization.pattern) {
    price += 30
  }

  // 特殊材料加价
  const { material } = customization
  if (material.waterproof) price += 50
  if (material.antibacterial) price += 30
  if (material.cushioning) price += 40

  // 高端材料加价
  if (material.durability > 80) price += 30
  if (material.archSupport > 80) price += 40

  return price
}

function getShoeTypeName(type: ShoeType): string {
  const names = {
    [ShoeType.ATHLETIC]: '运动鞋',
    [ShoeType.CASUAL]: '休闲鞋',
    [ShoeType.LEARNING]: '学步鞋',
    [ShoeType.SANDALS]: '凉鞋',
  }
  return names[type]
}
