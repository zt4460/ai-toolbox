---
title: AI 工具箱 - Design System
description: 让AI变成好用的牛马 - 极简现代 AI 创作工具箱
version: 2.0.0

# Color Palette

## Primary Colors
primary: "#111827"                    # Gray 900 - Main text color
primary-light: "#374151"               # Gray 700 - Secondary emphasis
primary-foreground: "#ffffff"           # White text on dark

## Background Colors
background: "#f9fafb"                  # Gray 50 - Page background
background-card: "#ffffff"             # White - Card surfaces
background-input: "#f3f4f6"            # Gray 100 - Input fields
background-hover: "#f3f4f6"            # Gray 100 - Hover state

## Text Colors
text-primary: "#111827"                # Gray 900 - Primary text
text-secondary: "#6b7280"               # Gray 500 - Secondary text
text-muted: "#9ca3af"                  # Gray 400 - Muted text
text-placeholder: "#d1d5db"            # Gray 300 - Placeholder

## Border Colors
border: "#e5e7eb"                      # Gray 200 - Default border
border-hover: "#d1d5db"               # Gray 300 - Hover border
border-focus: "#9ca3af"                # Gray 400 - Focus border

## Tool Accent Colors
accent-image: "#8b5cf6"                # Violet 500 - Image generation
accent-image-bg: "#f3e8ff"             # Violet 100 - Image badge bg
accent-video: "#ec4899"                # Pink 500 - Video generation
accent-video-bg: "#fce7f3"             # Pink 100 - Video badge bg
accent-digital: "#06b6d4"              # Cyan 500 - Digital human
accent-digital-bg: "#cffafe"          # Cyan 100 - Digital badge bg
accent-lipsync: "#f59e0b"              # Amber 500 - Lip sync
accent-lipsync-bg: "#fef3c7"           # Amber 100 - Lip sync badge bg

## Status Colors
success: "#10b981"                    # Emerald 500
success-bg: "#d1fae5"                  # Emerald 100
warning: "#f59e0b"                    # Amber 500
warning-bg: "#fef3c7"                  # Amber 100
error: "#ef4444"                       # Red 500
error-bg: "#fee2e2"                    # Red 100
info: "#3b82f6"                       # Blue 500
info-bg: "#dbeafe"                     # Blue 100

# Typography

## Font Families
font-sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

## Font Sizes
text-xs: "0.75rem"                     # 12px - Muted labels
text-sm: "0.875rem"                    # 14px - Secondary text
text-base: "1rem"                      # 16px - Body text
text-lg: "1.125rem"                    # 18px - Subheadings
text-xl: "1.25rem"                     # 20px - Section titles
text-2xl: "1.5rem"                     # 24px - Page titles
text-3xl: "1.875rem"                   # 30px - Hero titles
text-4xl: "2.25rem"                    # 36px - Large displays

## Font Weights
font-normal: "400"                     # Normal
font-medium: "500"                     # Medium emphasis
font-semibold: "600"                   # Semibold - Headings
font-bold: "700"                       # Bold - Strong emphasis

# Spacing System

## Base Unit
base-unit: "4px"                      # 4px grid system

## Spacing Scale
space-0: "0"                           # 0px
space-1: "4px"                         # 4px
space-2: "8px"                         # 8px
space-3: "12px"                        # 12px
space-4: "16px"                        # 16px
space-5: "20px"                        # 20px
space-6: "24px"                        # 24px
space-8: "32px"                        # 32px
space-10: "40px"                       # 40px
space-12: "48px"                       # 48px

## Component Spacing
header-height: "56px"                 # 14 * 4px - Header height
sidebar-width: "280px"                 # Sidebar width
max-width-content: "1024px"            # 1024px - Main content max width
max-width-narrow: "640px"              # 640px - Narrow content max width
page-padding: "16px"                    # Page horizontal padding

# Border Radius

## Radius Scale
radius-none: "0"                       # No radius
radius-sm: "6px"                       # 6px - Small elements
radius-md: "8px"                       # 8px - Buttons
radius-lg: "12px"                      # 12px - Cards
radius-xl: "16px"                      # 16px - Large cards
radius-2xl: "20px"                     # 20px - Modals
radius-full: "9999px"                  # Full circle

# Shadows

shadow-sm: "0 1px 2px rgba(0,0,0,0.05)"           # Subtle shadow
shadow-md: "0 4px 6px rgba(0,0,0,0.07)"           # Medium shadow
shadow-lg: "0 10px 15px rgba(0,0,0,0.1)"          # Large shadow
shadow-xl: "0 20px 25px rgba(0,0,0,0.1)"          # Extra large
shadow-none: "none"                                # No shadow

# Transitions

transition-fast: "150ms"              # Fast transitions
transition-base: "200ms"              # Default transitions
transition-slow: "300ms"              # Slow transitions
ease-default: "cubic-bezier(0.4, 0, 0.2, 1)"

---

# AI 工具箱 - Design Language

## Overview

采用极简现代的轻量工具风格，参考 Stitch 平台的设计语言。整体视觉呈现简洁、专业、轻量化的特点，强调功能性和高效率。

## Design Principles

### 1. Minimalism & Clarity
- **留白充足**: 所有区域预留大量空白，呼吸感强
- **色彩克制**: 低饱和度莫兰迪色系，避免视觉疲劳
- **无冗余装饰**: 依靠线条、色块的细微区分划分功能区

### 2. Information Hierarchy
- **文字层级清晰**: 通过字号、字重、颜色区分信息优先级
- **功能分区明确**: 左侧功能栏 + 右侧主内容区
- **渐进式披露**: 核心操作居中引导，次要信息折叠

### 3. Light Theme
- **背景色**: `#f9fafb` (Gray 50) 作为页面底色
- **卡片色**: `#ffffff` 白色卡片悬浮于浅灰背景
- **输入控件**: `#f3f4f6` 灰底输入框，轻量化感

### 4. Interactive Feedback
- **Hover**: 边框颜色加深，背景微变
- **Active**: 背景填充，颜色强调
- **Disabled**: 透明度降低，cursor 变化
- **Loading**: 简洁的旋转加载动画

## Layout Structure

### Homepage Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo + Navigation (积分 | 历史 | 联系我)           │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   Sidebar    │              Main Content                    │
│   (280px)    │                                              │
│              │   ┌────────────────────────────────────┐    │
│  [生图]      │   │                                    │    │
│  [历史记录]  │   │         Interactive Area           │    │
│              │   │                                    │    │
│              │   │   - 对话式交互                      │    │
│              │   │   - 输入框 + 发送按钮               │    │
│              │   │                                    │    │
│              │   └────────────────────────────────────┘    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Sidebar Design
- 固定宽度 280px
- 顶部 Logo + Slogan
- 底部「需求投稿」入口
- 中间功能列表
- 简洁分隔线区分区块

### Tool Pages Layout
- Header + 返回按钮
- 居中内容区 (max-width: 768px)
- 表单卡片式布局
- 底部操作按钮

## Components

### Cards
- **Background**: `#ffffff`
- **Border**: `1px solid #e5e7eb`
- **Border Radius**: `16px` (xl)
- **Padding**: `24px`
- **Shadow**: none (flat design)
- **Hover**: border-color → `#d1d5db`

### Buttons

#### Primary Button
- Background: `#111827` (gray-900)
- Text: `#ffffff`
- Hover: `#374151` (gray-700)
- Border Radius: `12px`
- Height: `48px` (py-3.5)
- Font: Medium

#### Secondary Button
- Background: `#ffffff`
- Border: `1px solid #e5e7eb`
- Text: `#374151`
- Hover: `#f3f4f6`
- Border Radius: `12px`

#### Icon Button
- Background: `#f3f4f6`
- Hover: `#e5e7eb`
- Border Radius: `8px`
- Size: `36px × 36px`

### Input Fields
- Background: `#f3f4f6`
- Border: `1px solid #e5e7eb`
- Border Radius: `12px`
- Focus Border: `#9ca3af`
- Focus Ring: `ring-2 ring-gray-100`
- Padding: `12px 16px`

### Badges
- Border Radius: `8px`
- Padding: `4px 8px`
- Font Size: `12px`
- Font Weight: Medium
- Colored background + matching text color

### Tabs
- Underline style: `border-b-2`
- Active: border-gray-900, text-gray-900
- Inactive: border-transparent, text-gray-500
- Hover: text-gray-700

## Icons

- **Library**: Lucide React
- **Sizes**: 16px (inline) / 20px (buttons) / 24px (headers)
- **Colors**: Match text color context
- **Tool Icons**: Each tool has unique color accent

## Animations

- **Transitions**: 150-200ms ease
- **Loading Spinner**: Lucide Loader2 with spin animation
- **Page Transitions**: Fade in on mount
- **Hover States**: 150ms color/border transitions

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Sidebar becomes bottom navigation or hamburger menu
- Single column layout
- Full-width cards

## Accessibility

- **Color Contrast**: Minimum 4.5:1 for text
- **Focus States**: Visible focus rings
- **Screen Reader**: Proper ARIA labels
- **Keyboard Navigation**: Full tab support

## Future Considerations

- [ ] Dark mode support
- [ ] Skeleton loading states
- [ ] Toast notifications
- [ ] Tooltip documentation
- [ ] Empty state illustrations
