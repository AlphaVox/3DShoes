# 3DShoes - 儿童鞋定制平台

一个现代化的 3D 儿童鞋扫描、定制和监测应用。

## 🌟 特性

- **3D 足部扫描**: 使用 LiDAR 技术精确测量儿童足部
- **个性化定制**: 自定义鞋子款式、颜色、图案和材质
- **成长追踪**: 记录和分析儿童足部生长数据
- **智能推荐**: 基于扫描数据推荐最适合的鞋子
- **订单管理**: 完整的订单和物流追踪系统

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **路由**: React Router v6
- **样式**: Tailwind CSS
- **3D渲染**: Three.js + React Three Fiber
- **图表**: Recharts
- **日期处理**: date-fns

## 📦 数据模型

完整的数据模型定义在 `src/types/models.ts` 中，包括：

- **用户模型** (User): 用户信息、会员等级、积分
- **儿童模型** (Child): 儿童基本信息、身体数据
- **足部扫描** (FootScan): 3D扫描数据、测量数据
- **鞋子模型** (Shoe): 鞋子信息、定制配置、使用状态
- **订单模型** (Order): 订单、支付、物流信息
- **成长记录** (GrowthRecord): 生长数据、健康分析

## 🚀 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
3DShoes/
├── src/
│   ├── components/        # 组件
│   │   ├── layout/       # 布局组件
│   │   └── ui/           # UI 组件
│   ├── pages/            # 页面组件
│   │   ├── HomePage.tsx      # 首页
│   │   ├── ScanPage.tsx      # 扫描页面
│   │   ├── CustomizePage.tsx # 定制页面
│   │   ├── GrowthPage.tsx    # 成长追踪
│   │   └── ProfilePage.tsx   # 个人资料
│   ├── stores/           # 状态管理
│   │   ├── useAppStore.ts    # 应用全局状态
│   │   ├── useScanStore.ts   # 扫描状态
│   │   └── useShoeStore.ts   # 鞋子定制状态
│   ├── types/            # TypeScript 类型定义
│   │   └── models.ts         # 数据模型
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── old-prototype/        # 旧版 HTML 原型
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── tailwind.config.js    # Tailwind 配置
```

## 🎨 设计系统

应用采用 iOS 风格的设计系统：

- **颜色**: 使用 iOS 标准颜色
- **组件**: iOS 风格的卡片、按钮、导航栏
- **动画**: 平滑的过渡效果
- **响应式**: 针对 iPhone 尺寸优化

## 📱 功能模块

### 1. 首页
- 用户欢迎信息
- 快捷操作入口
- 最近扫描记录
- 推荐鞋款

### 2. 扫描
- 扫描准备指引
- 左右脚选择
- 扫描质量设置
- 实时扫描进度

### 3. 定制
- 3D 鞋子预览
- 款式选择（运动鞋、休闲鞋、学步鞋、凉鞋）
- 颜色定制（鞋面、鞋底）
- 材质调节（软硬度、耐用度、足弓支撑）
- 特殊材料（透气、防水、抗菌、缓震）

### 4. 成长追踪
- 足部生长曲线图
- 健康分析
- 成长里程碑
- 照片记录

### 5. 个人资料
- 用户信息管理
- 孩子列表
- 订单查询
- 优惠券和收藏
- 设置选项

## 🔄 版本历史

### v2.0.0 (2025-11-20)
- 完全重构应用架构
- 采用 React + TypeScript 技术栈
- 实现完整的数据模型
- 添加状态管理系统
- 创建现代化的组件库
- 实现所有核心功能页面

### v1.0.0 (2023)
- 初始 HTML 原型版本

## 📝 待实现功能

- [ ] 真实的 3D 模型渲染
- [ ] LiDAR 实际集成
- [ ] 后端 API 集成
- [ ] 用户认证系统
- [ ] 支付功能
- [ ] 订单管理系统
- [ ] 推送通知

## 📄 许可证

版权所有 © 2025 3DShoes
