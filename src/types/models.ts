/**
 * 3DShoes 应用完整数据模型定义
 *
 * 这个文件定义了整个应用的核心数据结构
 */

// ==================== 基础类型 ====================

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

/**
 * 会员等级
 */
export enum MembershipTier {
  FREE = 'free',
  VIP = 'vip',
  PREMIUM = 'premium'
}

/**
 * 订单状态
 */
export enum OrderStatus {
  PENDING = 'pending',           // 待支付
  PAID = 'paid',                 // 已支付
  PROCESSING = 'processing',     // 生产中
  SHIPPING = 'shipping',         // 配送中
  DELIVERED = 'delivered',       // 已送达
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  REFUNDED = 'refunded'          // 已退款
}

/**
 * 鞋子类型
 */
export enum ShoeType {
  ATHLETIC = 'athletic',         // 运动鞋
  CASUAL = 'casual',             // 休闲鞋
  LEARNING = 'learning',         // 学步鞋
  SANDALS = 'sandals'            // 凉鞋
}

/**
 * 扫描状态
 */
export enum ScanStatus {
  PREPARING = 'preparing',       // 准备中
  SCANNING = 'scanning',         // 扫描中
  PROCESSING = 'processing',     // 处理中
  COMPLETED = 'completed',       // 完成
  FAILED = 'failed'              // 失败
}

/**
 * 脚部测量位置
 */
export enum FootSide {
  LEFT = 'left',
  RIGHT = 'right'
}

// ==================== 用户相关模型 ====================

/**
 * 用户地址
 */
export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  phone: string;
  avatar?: string;
  membershipTier: MembershipTier;
  points: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  children: Child[];
  addresses: Address[];
}

// ==================== 儿童相关模型 ====================

/**
 * 儿童基本信息
 */
export interface Child {
  id: string;
  userId: string;
  name: string;
  nickname?: string;
  birthDate: Date;
  gender: Gender;
  avatar?: string;
  // 当前身体数据
  currentHeight?: number;        // 身高 (cm)
  currentWeight?: number;        // 体重 (kg)
  // 关联数据
  footScans: FootScan[];
  growthRecords: GrowthRecord[];
  shoes: Shoe[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 生长记录
 */
export interface GrowthRecord {
  id: string;
  childId: string;
  recordDate: Date;
  age: number;                   // 年龄（月）
  height: number;                // 身高 (cm)
  weight: number;                // 体重 (kg)
  footLength: number;            // 脚长 (cm)
  footWidth: number;             // 脚宽 (cm)
  // 健康分析
  growthSpeed: 'slow' | 'normal' | 'fast';
  archDevelopment: 'flat' | 'normal' | 'high';
  notes?: string;
  photos?: string[];
  createdAt: Date;
}

// ==================== 足部扫描相关模型 ====================

/**
 * 3D点云数据
 */
export interface PointCloudData {
  vertices: number[];            // 顶点坐标数组 [x1, y1, z1, x2, y2, z2, ...]
  normals?: number[];            // 法线向量数组
  colors?: number[];             // 颜色数组
  indices?: number[];            // 索引数组
}

/**
 * 足部测量数据
 */
export interface FootMeasurements {
  length: number;                // 脚长 (mm)
  width: number;                 // 脚宽 (mm)
  height: number;                // 脚高 (mm)
  archHeight: number;            // 足弓高度 (mm)
  heelWidth: number;             // 脚后跟宽度 (mm)
  ballWidth: number;             // 脚掌宽度 (mm)
  instepHeight: number;          // 脚背高度 (mm)
  // 高级测量
  ankleGirth?: number;           // 脚踝周长 (mm)
  instepGirth?: number;          // 脚背周长 (mm)
  toeAngles?: number[];          // 脚趾角度
}

/**
 * 足部扫描记录
 */
export interface FootScan {
  id: string;
  childId: string;
  scanDate: Date;
  footSide: FootSide;
  status: ScanStatus;
  // 3D数据
  pointCloud?: PointCloudData;
  meshData?: string;             // 3D网格数据（可以是URL或序列化数据）
  thumbnail?: string;            // 缩略图
  // 测量数据
  measurements: FootMeasurements;
  // 扫描设置
  scanQuality: 'low' | 'medium' | 'high';
  deviceInfo?: {
    model: string;
    hasLidar: boolean;
    osVersion: string;
  };
  // 元数据
  processingTime?: number;       // 处理时长(ms)
  scanDuration?: number;         // 扫描时长(ms)
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 鞋子相关模型 ====================

/**
 * 鞋子颜色配置
 */
export interface ShoeColor {
  upperColor: string;            // 鞋面颜色
  soleColor: string;             // 鞋底颜色
  laceColor?: string;            // 鞋带颜色
  accentColor?: string;          // 装饰色
}

/**
 * 鞋子图案
 */
export interface ShoePattern {
  type: 'stars' | 'hearts' | 'lightning' | 'flowers' | 'geometric' | 'custom';
  color?: string;
  scale?: number;
  position?: 'toe' | 'side' | 'heel' | 'all';
}

/**
 * 鞋子材料配置
 */
export interface ShoeMaterial {
  // 软硬度 (0-100)
  upperSoftness: number;         // 鞋面软度
  soleSoftness: number;          // 鞋底软度
  // 其他属性
  durability: number;            // 耐用度 (0-100)
  archSupport: number;           // 足弓支撑 (0-100)
  // 特殊材料
  breathable: boolean;           // 透气
  waterproof: boolean;           // 防水
  antibacterial: boolean;        // 抗菌
  cushioning: boolean;           // 缓震
}

/**
 * 鞋子定制配置
 */
export interface ShoeCustomization {
  type: ShoeType;
  size: number;                  // EU尺码
  color: ShoeColor;
  pattern?: ShoePattern;
  material: ShoeMaterial;
  // 个性化
  customText?: string;           // 定制文字
  customLogo?: string;           // 定制图标
  // 3D配置
  model3DUrl?: string;           // 3D模型URL
  renderPreviewUrl?: string;     // 渲染预览图
}

/**
 * 鞋子使用状态
 */
export interface ShoeUsageStatus {
  wearStartDate: Date;
  totalWearDays: number;         // 累计穿着天数
  estimatedWearDays: number;     // 预计可穿天数
  // 健康状态
  soleWear: number;              // 鞋底磨损 (0-100)
  insoleCondition: number;       // 鞋垫状况 (0-100)
  fitStatus: 'tight' | 'perfect' | 'loose';
  // 维护记录
  lastCleanedDate?: Date;
  maintenanceNotes?: string[];
}

/**
 * 鞋子信息
 */
export interface Shoe {
  id: string;
  childId: string;
  orderId?: string;
  // 基本信息
  name: string;
  type: ShoeType;
  customization: ShoeCustomization;
  // 价格
  basePrice: number;
  customizationPrice: number;
  totalPrice: number;
  // 状态
  isCurrent: boolean;            // 是否当前穿着
  usageStatus?: ShoeUsageStatus;
  // 关联扫描
  basedOnScanId?: string;        // 基于哪次扫描定制
  // 时间
  createdAt: Date;
  manufacturedAt?: Date;
  deliveredAt?: Date;
}

// ==================== 订单相关模型 ====================

/**
 * 订单项
 */
export interface OrderItem {
  id: string;
  shoeId: string;
  shoe: Shoe;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * 支付信息
 */
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'wechat' | 'alipay' | 'credit_card' | 'points';
  transactionId?: string;
  paidAt?: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

/**
 * 物流信息
 */
export interface Shipping {
  id: string;
  orderId: string;
  carrier: string;               // 物流公司
  trackingNumber: string;        // 运单号
  shippedAt?: Date;
  estimatedDeliveryAt?: Date;
  deliveredAt?: Date;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  trackingHistory?: Array<{
    timestamp: Date;
    status: string;
    location: string;
    description: string;
  }>;
}

/**
 * 订单信息
 */
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;           // 订单号
  // 订单项
  items: OrderItem[];
  // 价格
  subtotal: number;              // 小计
  shippingFee: number;           // 运费
  discount: number;              // 优惠
  total: number;                 // 总计
  // 收货地址
  shippingAddress: Address;
  // 状态
  status: OrderStatus;
  // 支付和物流
  payment?: Payment;
  shipping?: Shipping;
  // 备注
  customerNotes?: string;
  internalNotes?: string;
  // 时间
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

// ==================== 优惠券和收藏 ====================

/**
 * 优惠券
 */
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

/**
 * 用户优惠券
 */
export interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  coupon: Coupon;
  obtainedAt: Date;
  usedAt?: Date;
  usedInOrderId?: string;
  isExpired: boolean;
}

/**
 * 收藏的鞋子样式
 */
export interface Favorite {
  id: string;
  userId: string;
  shoeType: ShoeType;
  customization: ShoeCustomization;
  name?: string;
  notes?: string;
  createdAt: Date;
}

// ==================== 应用状态模型 ====================

/**
 * 应用全局状态
 */
export interface AppState {
  // 用户状态
  currentUser: User | null;
  isAuthenticated: boolean;
  // 当前选中的孩子
  activeChildId: string | null;
  // UI状态
  isLoading: boolean;
  error: string | null;
  // 导航
  currentRoute: string;
}

/**
 * 扫描进度状态
 */
export interface ScanProgress {
  status: ScanStatus;
  progress: number;              // 0-100
  message: string;
  estimatedTimeRemaining?: number; // 秒
}
