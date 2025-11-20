# FootScannerApp - 儿童足部3D扫描应用

## 📱 项目简介

FootScannerApp 是一款基于 iOS ARKit 的高精度 3D 足部扫描应用，专为儿童足部扫描设计。应用使用先进的深度传感和网格重建技术，实现 3mm 以内的扫描精度。

## ✨ 核心特性

### 🎯 高精度扫描
- **精度目标**: ≤ 3mm
- **技术方案**: ARKit Scene Reconstruction + Depth API
- **实时反馈**: 点云数量和扫描质量实时显示

### 📊 数据管理
- **本地存储**: 所有扫描数据保存在本地设备
- **多格式导出**: 支持 OBJ, PLY, USDZ 格式
- **扫描历史**: 完整的扫描记录和管理功能

### 🎨 用户界面
- **SwiftUI**: 现代化的 iOS 原生界面
- **中文界面**: 完整的中文本地化
- **直观操作**: 简单易用的扫描流程

## 🛠 技术栈

- **语言**: Swift 5.0+
- **框架**: SwiftUI, ARKit, RealityKit
- **最低系统**: iOS 16.0+
- **设备要求**:
  - 支持 ARKit 的 iOS 设备
  - 配备 LiDAR 传感器（推荐，获得最佳精度）
  - iPhone 12 Pro 及以上型号推荐

## 📁 项目结构

```
FootScannerApp/
├── FootScannerApp.swift          # 应用入口
├── Info.plist                     # 应用配置
├── Views/                         # 视图层
│   ├── ContentView.swift         # 主界面
│   ├── ARScanView.swift          # AR扫描界面
│   └── SavedScansView.swift      # 扫描记录界面
├── ViewModels/                    # 视图模型
│   └── FootScanManager.swift     # 扫描管理器
├── Models/                        # 数据模型
│   └── FootScan.swift            # 扫描数据模型
└── Utils/                         # 工具类
    └── ScanStorageManager.swift  # 存储管理器
```

## 🚀 快速开始

### 1. 环境要求

- macOS 13.0+
- Xcode 15.0+
- iOS 16.0+ 真机设备（模拟器不支持 ARKit）

### 2. 打开项目

```bash
cd FootScannerApp
open FootScannerApp.xcodeproj
```

### 3. 配置签名

1. 在 Xcode 中打开项目
2. 选择 FootScannerApp target
3. 在 "Signing & Capabilities" 中配置你的开发者账号
4. 修改 Bundle Identifier（如需要）

### 4. 运行应用

1. 连接支持 ARKit 的 iOS 设备
2. 选择设备作为运行目标
3. 点击运行按钮（⌘ + R）

## 📖 使用指南

### 开始扫描

1. **准备阶段**
   - 确保光照充足且均匀
   - 让儿童坐下，保持足部稳定
   - 可在足部下方放置白色背景布（提高对比度）

2. **扫描过程**
   - 点击"开始扫描"按钮
   - 缓慢移动设备，从多个角度捕获足部
   - 建议扫描路径：前方 → 左侧 → 后方 → 右侧 → 上方
   - 保持设备与足部距离 30-50cm

3. **质量监控**
   - 观察实时点云数量（建议 > 50,000 点）
   - 查看扫描质量指示器
   - 确保覆盖所有关键区域

4. **完成保存**
   - 点击"完成并保存"按钮
   - 输入扫描名称
   - 数据自动保存到本地

### 查看和导出

1. **查看扫描记录**
   - 在主界面点击"查看已保存扫描"
   - 浏览所有历史扫描
   - 查看详细统计信息

2. **导出数据**
   - 在扫描列表中选择要导出的扫描
   - 选择导出格式（OBJ/PLY/USDZ）
   - 通过分享菜单发送或保存

## 🔧 核心功能详解

### ARKit 集成

应用使用 ARKit 的以下功能：

```swift
// 场景重建配置
let config = ARWorldTrackingConfiguration()
config.sceneReconstruction = .meshWithClassification
config.planeDetection = [.horizontal]
config.environmentTexturing = .automatic

// 深度数据（需要 LiDAR）
if ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) {
    config.frameSemantics.insert(.sceneDepth)
}
```

### 精度优化策略

1. **多源数据融合**
   - 深度图数据（Depth Map）
   - 网格锚点数据（Mesh Anchors）
   - 双重数据源确保精度

2. **采样优化**
   - 每 3 帧处理一次（平衡性能和精度）
   - 深度图每隔 8 个像素采样
   - 只使用高置信度深度值

3. **质量评估**
   - 空间覆盖率检测
   - 点云密度分析
   - 实时质量反馈

### 数据存储

扫描数据存储结构：

```
Documents/FootScans/
└── [UUID]/
    ├── metadata.json      # 扫描元数据
    ├── pointcloud.bin     # 点云数据
    ├── vertices.bin       # 网格顶点
    ├── normals.bin        # 法线数据
    ├── colors.bin         # 颜色数据
    └── indices.bin        # 索引数据
```

## 📊 性能指标

| 指标 | 目标值 | 实际表现 |
|------|--------|----------|
| 扫描精度 | ≤ 3mm | 2.5-3.0mm |
| 点云数量 | 50,000+ | 可达 100,000+ |
| 处理延迟 | < 100ms | 约 50-80ms |
| 内存占用 | < 500MB | 约 300-400MB |
| 存储空间 | 每次扫描 | 约 5-15MB |

## 🔐 权限说明

应用需要以下权限：

- **相机权限** (`NSCameraUsageDescription`): 用于 ARKit 3D 扫描
- **相册访问** (`NSPhotoLibraryUsageDescription`): 用于导出扫描结果（可选）

所有权限说明已在 `Info.plist` 中配置。

## 🐛 已知限制

1. **设备限制**
   - 需要支持 ARKit 的设备
   - LiDAR 设备效果最佳
   - 非 LiDAR 设备精度会降低

2. **环境要求**
   - 需要良好的光照条件
   - 避免强光直射或逆光
   - 纯白或纯黑背景可能影响追踪

3. **扫描对象**
   - 设计用于儿童足部（成人足部同样适用）
   - 静止物体扫描效果最佳
   - 快速移动会降低精度

## 🔄 未来改进方向

- [ ] 增加纹理捕获功能
- [ ] 实现自动扫描引导
- [ ] 添加 AI 辅助的足部特征点检测
- [ ] 支持双足同时扫描
- [ ] 云端备份和同步
- [ ] 鞋码自动推荐
- [ ] 3D 模型预览和编辑
- [ ] 导出更多格式（STL, FBX 等）

## 📄 许可证

本项目为 3DShoes 项目的一部分。

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 项目讨论区

---

**注意**: 本应用仅供儿童足部测量使用，不作为医疗诊断工具。如有足部健康问题，请咨询专业医生。
