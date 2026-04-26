---
title: AI 工具箱 - Design System
description: 让AI变成好用的牛马 - 极简现代 AI 创作工具箱
version: 3.0.0

# Color Palette

## Primary Colors
primary: "#111827"                    # Gray 900 - Main text color
primary-light: "#374151"               # Gray 700 - Secondary emphasis
primary-foreground: "#ffffff"           # White text on dark

## Background Colors
background: "#F8F9FA"                  # Light gray background
background-card: "#ffffff"             # White - Card surfaces
background-input: "#f9fafb"           # Gray 50 - Input fields
background-hover: "#f3f4f6"            # Gray 100 - Hover state

## Text Colors
text-primary: "#111827"                # Gray 900 - Primary text
text-secondary: "#6b7280"               # Gray 500 - Secondary text
text-muted: "#9ca3af"                  # Gray 400 - Muted text
text-placeholder: "#d1d5db"            # Gray 300 - Placeholder

## Border Colors
border: "#e5e7eb"                      # Gray 200 - Default border
border-hover: "#d1d5db"               # Gray 300 - Hover border

## Accent Colors
accent-gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)"  # Pink to Purple gradient
accent-pink: "#ec4899"                # Pink 500 - Primary action
accent-pink-bg: "#fdf2f8"              # Pink 50 - Pink tint
accent-purple: "#8b5cf6"               # Purple 500 - Secondary action
accent-purple-bg: "#f5f3ff"            # Purple 50 - Purple tint
accent-blue: "#3b82f6"                 # Blue 500 - Credits/Info
accent-green: "#10b981"                # Green 500 - Success

## Status Colors
error: "#ef4444"                       # Red 500 - Error
error-bg: "#fef2f2"                    # Red 50 - Error background
warning: "#f59e0b"                    # Amber 500 - Warning
info: "#3b82f6"                       # Blue 500 - Info

# Typography

## Font Families
font-sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

## Font Sizes
text-xs: "0.75rem"                     # 12px - Labels, timestamps
text-sm: "0.875rem"                    # 14px - Body text, buttons
text-base: "1rem"                      # 16px - Default
text-lg: "1.125rem"                    # 18px - Subheadings
text-xl: "1.25rem"                     # 20px - Section titles
text-2xl: "1.5rem"                     # 24px - Page titles

## Font Weights
font-normal: "400"                     # Normal
font-medium: "500"                     # Medium
font-semibold: "600"                   # Semibold - Headings
font-bold: "700"                       # Bold

# Spacing System

## Base Unit
base-unit: "4px"                      # 4px grid system

## Spacing Scale
space-1: "4px"                         # 4px
space-2: "8px"                         # 8px
space-3: "12px"                        # 12px
space-4: "16px"                        # 16px
space-5: "20px"                        # 20px
space-6: "24px"                        # 24px
space-8: "32px"                        # 32px

## Component Spacing
header-height: "56px"                  # Header height
sidebar-width: "48px"                   # Narrow sidebar width
sidebar-expanded: "280px"             # Expanded sidebar width
main-padding-x: "24px"                 # Main content horizontal padding
main-padding-y: "32px"                 # Main content vertical padding

# Border Radius

## Radius Scale
radius-sm: "6px"                       # 6px - Small elements
radius-md: "8px"                       # 8px - Buttons, inputs
radius-lg: "12px"                      # 12px - Cards
radius-xl: "16px"                      # 16px - Large cards, panels
radius-2xl: "20px"                     # 20px - Modals
radius-full: "9999px"                  # Full circle/rounded pill

# Shadows

shadow-sm: "0 1px 2px rgba(0,0,0,0.05)"           # Subtle
shadow-md: "0 4px 6px rgba(0,0,0,0.07)"           # Medium - Cards
shadow-lg: "0 10px 15px rgba(0,0,0,0.1)"          # Large - Floating panels

# Transitions

transition-fast: "150ms"              # Fast transitions
transition-base: "200ms"              # Default transitions
transition-slow: "300ms"              # Slow transitions
ease-default: "cubic-bezier(0.4, 0, 0.2, 1)"

---

# AI 工具箱 - Design Language

## Overview

采用极简现代的轻量工具风格（参考 Stitch/Coze 平台）。整体视觉呈现简洁、专业、轻量化的特点，强调功能性和高效率。采用极窄侧边栏 + 悬浮底部操作面板的布局。

## Design Principles

### 1. Minimal & Efficient
- **极窄侧边栏**: 48px 宽，纯图标导航，最大化主内容区
- **充足留白**: 主内容区大量留白，呼吸感强
- **色彩克制**: 低饱和度莫兰迪色系，避免视觉疲劳

### 2. Clear Hierarchy
- **文字层级清晰**: 通过字号、字重、颜色区分优先级
- **时间线布局**: 按「今天」「昨天」等时间分组展示
- **功能聚焦**: 底部悬浮面板承载核心操作

### 3. Floating Action Panel
- **底部悬浮**: 24px 圆角卡片悬浮于页面底部
- **阴影分层**: 轻微阴影与主内容区分隔
- **渐变按钮**: 粉色到紫色的渐变按钮突出核心功能

### 4. Interactive States
- **Hover**: 边框颜色加深，背景微变
- **Active**: 背景填充，颜色强调
- **Disabled**: 透明度降低
- **Loading**: 简洁旋转加载动画

## Layout Structure

### Homepage Layout
```
┌────┬────────────────────────────────────────────────────────────┐
│    │  Header: 标题 + 搜索 + 视图切换 + 联系我                   │
│ S  ├────────────────────────────────────────────────────────────┤
│ I  │                                                            │
│ D  │   Content Area (时间线布局)                                │
│ E  │   ┌──────────────────────────────────────────────────┐    │
│ B  │   │  今天                                               │    │
│ A  │   │  ┌────────────────────────────────────────────┐  │    │
│ R  │   │  │  创作卡片 (缩略图 + 标题 + 类型 + 时间)    │  │    │
│    │   │  └────────────────────────────────────────────┘  │    │
│ 4  │   │  ┌────────────────────────────────────────────┐  │    │
│ 8  │   │  │  创作卡片                                    │  │    │
│ p  │   │  └────────────────────────────────────────────┘  │    │
│ x  │   │                                                    │    │
│    │   │  昨天                                               │    │
│    │   │  ...                                                │    │
│    │   └──────────────────────────────────────────────────┘    │
│    │                                                            │
├────┴────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  底部悬浮创作面板                                          │   │
│  │  [图片] [视频] [数字人] [配音]  |  输入框 + AI灵感 + 积分  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Sidebar Design
- 固定宽度 48px，纯图标导航
- 垂直排列：创作、资产、消息、设置
- 选中状态：深色背景 + 图标高亮
- 未选中：浅灰色图标
- 底部用户头像入口

### Floating Action Panel
- 位置：固定在底部，距底部 24px
- 宽度：从侧边栏右边缘到屏幕右边缘
- 圆角：24px
- 阴影：`0 10px 15px rgba(0,0,0,0.1)`
- 内部结构：
  - 类型切换：胶囊式切换按钮组
  - 输入区域：大文本框 + 渐变发送按钮
  - 底部工具栏：AI灵感、精准改图 Beta、积分显示

## Component Specifications

### Navigation Icon Button
```css
/* Default */
width: 40px;
height: 40px;
border-radius: 12px;
color: #9ca3af;  /* Gray 400 */

/* Hover */
color: #374151;  /* Gray 700 */
background: #f3f4f6;  /* Gray 100 */

/* Active */
background: #f3f4f6;
color: #111827;  /* Gray 900 */
```

### Card Component
```css
background: #ffffff;
border-radius: 16px;
border: 1px solid #e5e7eb;
padding: 16px;
transition: box-shadow 200ms;
```

### Pill Toggle Button
```css
/* Inactive */
background: #f3f4f6;
color: #6b7280;

/* Active */
background: #ffffff;
color: #111827;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
```

### Gradient Action Button
```css
background: linear-gradient(135deg, #ec4899, #8b5cf6);
border-radius: 12px;
width: 48px;
height: 48px;
```

### Primary Button
```css
background: #111827;
color: #ffffff;
border-radius: 12px;
padding: 8px 16px;
font-weight: 500;
```

### Input Field
```css
background: #f9fafb;
border: 1px solid #e5e7eb;
border-radius: 12px;
padding: 12px 16px;
```

## Icon System

### Icons Used
- 侧边栏：`Wand2`, `FolderOpen`, `MessageSquare`, `Settings`
- 功能：`Sparkles` (AI灵感), `Edit3` (精准改图), `Upload`, `Coins`
- 操作：`Send`, `Download`, `Copy`, `RotateCcw`, `Search`
- 状态：`List`, `Grid3X3`, `ChevronDown`, `X`
- 内容：`Image`, `Video`, `User`, `Mail`
- 尺寸：16-20px，stroke-width: 1.5-2

### Icon Style
- 线性极简图标
- 2px 左右的线条
- 统一 stroke-width
- 高辨识度

## Color Usage

### Primary Text
- 标题：Gray 900 (#111827)
- 正文：Gray 700 (#374151)
- 辅助：Gray 500 (#6b7280)

### Status Indicators
- 积分不足：Red 500 (#ef4444)
- 会员/Beta 标签：Blue 500 (#3b82f6)

### Accent Elements
- AI灵感按钮：Pink 50 背景 + Pink 600 文字
- 精准改图：Gray 100 背景
- Beta 标签：Blue 500 填充白字

## Responsive Behavior

### Desktop (>1024px)
- 侧边栏固定 48px
- 底部面板固定在视口底部
- 主内容区自适应

### Tablet (768-1024px)
- 侧边栏保持 48px
- 底部面板宽度自适应

## Future Considerations

- [ ] 暗色模式适配
- [ ] 骨架屏加载状态
- [ ] Toast 通知组件
- [ ] 下拉选择器组件
- [ ] 工具提示文档
- [ ] 响应式移动端适配
