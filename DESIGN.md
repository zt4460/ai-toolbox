---
# AI 工具箱 - 设计系统文档

## 设计元数据
```yaml
name: AI 工具箱
version: 1.0.0
description: 一站式 AI 创作工具集，集成图片生成、视频生成、数字人创作、视频配音等功能
```

---

## 颜色系统 (Colors)

### 浅色模式 (Light Mode)
```yaml
colors:
  background:     "#FFFFFF"      # 纯白背景
  foreground:     "#252525"      # 深灰文字 (oklch 0.145)
  primary:        "#353535"      # 主按钮/重要元素
  primary-foreground: "#FAFAFA"  # 主按钮文字
  secondary:     "#F7F7F7"      # 次要背景
  secondary-foreground: "#353535"
  muted:         "#F7F7F7"      # 弱化背景
  muted-foreground: "#8E8E8E"   # 次要文字 (oklch 0.556)
  accent:        "#F7F7F7"      # 强调背景
  accent-foreground: "#353535"
  destructive:   "#DC2626"      # 危险/错误色
  destructive-foreground: "#FFFFFF"
  border:        "#EBEBEB"      # 边框色 (oklch 0.922)
  input:         "#EBEBEB"      # 输入框边框
  ring:          "#B3B3B3"      # 聚焦环 (oklch 0.708)
  card:          "#FFFFFF"      # 卡片背景
  card-foreground: "#252525"
  popover:       "#FFFFFF"      # 弹出层背景
  popover-foreground: "#252525"
  chart-1:       "#A855F7"      # 紫色图表
  chart-2:       "#22C55E"      # 绿色图表
  chart-3:       "#C4B5FD"      # 浅紫图表
  chart-4:       "#4ADE80"      # 亮绿图表
  chart-5:       "#C084FC"      # 紫罗兰图表
  sidebar:       "#FFFFFF"      # 侧边栏背景
  sidebar-foreground: "#252525"
  sidebar-border: "#EBEBEB"
  sidebar-accent: "#F7F7F7"
  sidebar-accent-foreground: "#353535"
  sidebar-primary: "#353535"
  sidebar-primary-foreground: "#FAFAFA"
  sidebar-ring:   "#B3B3B3"
```

### 深色模式 (Dark Mode)
```yaml
colors:
  background:     "#252525"      # 深灰背景
  foreground:     "#FAFAFA"      # 浅色文字
  primary:        "#FAFAFA"      # 主按钮
  primary-foreground: "#353535"
  secondary:      "#353535"     # 次要背景
  secondary-foreground: "#FAFAFA"
  muted:          "#353535"     # 弱化背景
  muted-foreground: "#B3B3B3"   # 次要文字
  accent:         "#353535"     # 强调背景
  accent-foreground: "#FAFAFA"
  destructive:    "#B91C1C"     # 危险/错误色
  destructive-foreground: "#FFFFFF"
  border:         "rgba(255,255,255,0.1)"
  input:          "rgba(255,255,255,0.15)"
  ring:           "#8E8E8E"     # 聚焦环
  card:           "#353535"     # 卡片背景
  card-foreground: "#FAFAFA"
  popover:        "#353535"     # 弹出层背景
  popover-foreground: "#FAFAFA"
  chart-1:        "#7C3AED"     # 深紫色图表
  chart-2:        "#10B981"     # 深绿色图表
  chart-3:        "#8B5CF6"     # 紫色图表
  chart-4:        "#34D399"     # 翠绿图表
  chart-5:        "#A78BFA"     # 浅紫图表
  sidebar:        "#1A1A1A"     # 侧边栏背景
  sidebar-foreground: "#FAFAFA"
  sidebar-border:  "rgba(255,255,255,0.1)"
  sidebar-accent: "#252525"
  sidebar-accent-foreground: "#FAFAFA"
  sidebar-primary: "#7C3AED"
  sidebar-primary-foreground: "#FFFFFF"
  sidebar-ring:   "#8E8E8E"
```

---

## 字体系统 (Typography)

### 字体族 (Font Families)
```yaml
fonts:
  sans: |
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  mono: |
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace
  serif: |
    'Noto Serif SC', 'Songti SC', 'SimSun', ui-serif,
    Georgia, Cambria, 'Times New Roman', Times, serif
```

### 字号 (Font Sizes)
```yaml
fontSizes:
  xs:    "0.75rem"    # 12px - 辅助/标签文字
  sm:    "0.875rem"   # 14px - 次要文字
  base:  "1rem"       # 16px - 正文
  lg:    "1.125rem"   # 18px - 大号正文
  xl:    "1.25rem"    # 20px - 小标题
  "2xl": "1.5rem"     # 24px - 标题
  "3xl": "1.875rem"   # 30px - 大标题
  "4xl": "2.25rem"    # 36px - 页面标题
  "5xl": "3rem"       # 48px - 巨型标题
```

### 行高 (Line Heights)
```yaml
lineHeights:
  none:   "1"
  tight:  "1.25"
  snug:   "1.375"
  normal: "1.5"
  relaxed: "1.625"
  loose:  "2"
```

### 字重 (Font Weights)
```yaml
fontWeights:
  normal:   "400"
  medium:   "500"
  semibold: "600"
  bold:     "700"
```

---

## 间距系统 (Spacing)
```yaml
spacing:
  0:  "0"
  0.5: "0.125rem"  # 2px
  1:  "0.25rem"    # 4px
  1.5: "0.375rem"  # 6px
  2:  "0.5rem"     # 8px
  2.5: "0.625rem"  # 10px
  3:  "0.75rem"    # 12px
  3.5: "0.875rem"  # 14px
  4:  "1rem"       # 16px
  5:  "1.25rem"    # 20px
  6:  "1.5rem"     # 24px
  7:  "1.75rem"    # 28px
  8:  "2rem"       # 32px
  9:  "2.25rem"    # 36px
  10: "2.5rem"     # 40px
  12: "3rem"       # 48px
  14: "3.5rem"     # 56px
  16: "4rem"       # 64px
  20: "5rem"       # 80px
  24: "6rem"       # 96px
  32: "8rem"       # 128px
```

---

## 圆角系统 (Border Radius)
```yaml
borderRadius:
  none:  "0"
  sm:    "0.25rem"                          # 4px
  DEFAULT: "0.375rem"                       # 6px
  md:    "0.5rem"                          # 8px
  lg:    "0.625rem"                        # 10px (基础圆角)
  xl:    "0.75rem"                         # 12px
  "2xl": "1rem"                            # 16px
  "3xl": "1.5rem"                          # 24px
  full:  "9999px"                          # 全圆角/胶囊
```

---

## 阴影系统 (Shadows)
```yaml
shadows:
  sm:    "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
  md:    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  lg:    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
  xl:    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  "3xl": "0 32px 64px -12px rgb(0 0 0 / 0.3)"
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
  glow:  "0 0 20px rgb(168 85 247 / 0.3)"  # 发光效果
  glow-lg: "0 0 40px rgb(168 85 247 / 0.4)"
```

---

## 动画系统 (Motion)

### 过渡时长 (Transition Duration)
```yaml
duration:
  0:    "0ms"
  75:   "75ms"
  100:  "100ms"
  150:  "150ms"
  200:  "200ms"
  300:  "300ms"
  500:  "500ms"
  700:  "700ms"
  1000: "1000ms"
```

### 缓动函数 (Easing)
```yaml
easing:
  DEFAULT:  "cubic-bezier(0.4, 0, 0.2, 1)"
  linear:   "linear"
  in:       "cubic-bezier(0.4, 0, 1, 1)"
  out:      "cubic-bezier(0, 0, 0.2, 1)"
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  bounce:   "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  spring:   "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
```

### 动画配置 (Animation Config)
```yaml
animation:
  fade-in:
    duration: "200ms"
    easing: "ease-out"
  fade-out:
    duration: "150ms"
    easing: "ease-in"
  slide-up:
    duration: "300ms"
    easing: "ease-out"
  slide-down:
    duration: "300ms"
    easing: "ease-in"
  scale-in:
    duration: "200ms"
    easing: "spring"
  spin:
    duration: "1000ms"
    easing: "linear"
    iteration: "infinite"
  pulse:
    duration: "2000ms"
    easing: "ease-in-out"
    iteration: "infinite"
```

---

## 层级系统 (Z-Index)
```yaml
zIndex:
  0:   "0"
  10:  "10"
  20:  "20"
  30:  "30"
  40:  "40"
  50:  "50"
  dropdown:  "1000"
  sticky:    "1100"
  fixed:     "1200"
  modal-backdrop: "1240"
  modal:         "1250"
  popover:       "1300"
  tooltip:       "1400"
  toast:         "1500"
```

---

## 断点系统 (Breakpoints)
```yaml
breakpoints:
  sm:   "640px"   # 小屏手机
  md:   "768px"   # 平板
  lg:   "1024px"  # 小屏笔记本
  xl:   "1280px"  # 桌面
  "2xl": "1536px" # 大屏桌面
```

---

## 组件规范

### 按钮 (Button)
```yaml
button:
  # 主要按钮
  primary:
    background: "primary"
    foreground: "primary-foreground"
    hover-background: "opacity-90"
    border-radius: "lg"
    padding: "10px 20px"
    font-weight: "500"
    
  # 次要按钮
  secondary:
    background: "secondary"
    foreground: "secondary-foreground"
    hover-background: "opacity-80"
    border-radius: "lg"
    padding: "10px 20px"
    
  # 幽灵按钮
  ghost:
    background: "transparent"
    hover-background: "accent"
    border-radius: "lg"
    
  # 危险按钮
  destructive:
    background: "destructive"
    foreground: "destructive-foreground"
    hover-background: "opacity-90"
    border-radius: "lg"
    
  # 尺寸
  sizes:
    sm:   padding: "6px 12px", font-size: "sm"
    md:   padding: "10px 16px", font-size: "sm"
    lg:   padding: "12px 24px", font-size: "base"
    icon: padding: "10px", size: "40px"
```

### 输入框 (Input)
```yaml
input:
  background: "background"
  border: "border"
  border-radius: "lg"
  padding: "10px 14px"
  font-size: "sm"
  focus-ring: "ring"
  focus-ring-offset: "2px"
  placeholder-color: "muted-foreground"
  disabled:
    opacity: "0.5"
    cursor: "not-allowed"
    
  dark:
    background: "secondary"
    border: "rgba(255,255,255,0.15)"
    foreground: "foreground"
```

### 卡片 (Card)
```yaml
card:
  background: "card"
  border: "border"
  border-radius: "xl"
  padding: "16px"
  shadow: "shadow"
  
  header:
    padding-bottom: "12px"
    border-bottom: "1px solid border"
    font-size: "lg"
    font-weight: "semibold"
    
  footer:
    padding-top: "12px"
    border-top: "1px solid border"
    
  dark:
    background: "card"
    border: "rgba(255,255,255,0.1)"
```

### 弹窗 (Modal/Dialog)
```yaml
modal:
  overlay:
    background: "rgba(0, 0, 0, 0.5)"
    backdrop-blur: "4px"
    
  content:
    background: "popover"
    border-radius: "2xl"
    padding: "24px"
    shadow: "shadow-2xl"
    max-width: "90vw"
    max-height: "85vh"
    
  header:
    padding-bottom: "16px"
    margin-bottom: "16px"
    border-bottom: "1px solid border"
    
  body:
    overflow-y: "auto"
    
  footer:
    padding-top: "16px"
    margin-top: "16px"
    border-top: "1px solid border"
    display: "flex"
    justify-content: "flex-end"
    gap: "12px"
```

### 标签页 (Tabs)
```yaml
tabs:
  container:
    border-bottom: "1px solid border"
    
  list:
    display: "flex"
    gap: "4px"
    
  trigger:
    padding: "8px 16px"
    font-size: "sm"
    font-weight: "medium"
    color: "muted-foreground"
    background: "transparent"
    border-radius: "md"
    transition: "all duration-150"
    
  active:
    color: "foreground"
    background: "accent"
    
  indicator:
    height: "2px"
    background: "destructive"  # 红色强调
    border-radius: "full"
    
  content:
    padding-top: "16px"
```

### 下拉菜单 (Dropdown)
```yaml
dropdown:
  content:
    background: "popover"
    border: "1px solid border"
    border-radius: "lg"
    padding: "6px"
    shadow: "shadow-lg"
    min-width: "180px"
    z-index: "dropdown"
    
  item:
    padding: "8px 12px"
    font-size: "sm"
    border-radius: "md"
    cursor: "pointer"
    transition: "background duration-150"
    
  item-hover:
    background: "accent"
    
  separator:
    height: "1px"
    background: "border"
    margin: "6px -6px"
    
  dark:
    content:
      background: "popover"
      border: "rgba(255,255,255,0.1)"
```

---

## 布局规范

### 页面结构 (Layout)
```yaml
layout:
  # 侧边栏
  sidebar:
    width: "48px"
    height: "100vh"
    position: "fixed"
    left: "0"
    top: "0"
    z-index: "40"
    background: "rgba(255,255,255,0.8)"
    backdrop-blur: "12px"
    border-right: "1px solid border"
    icon-size: "24px"
    icon-gap: "16px"
    
  # 主内容区
  main:
    margin-left: "48px"
    min-height: "100vh"
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
    
  # 顶部工具栏
  toolbar:
    height: "48px"
    background: "rgba(255,255,255,0.05)"
    backdrop-blur: "8px"
    border-bottom: "1px solid rgba(255,255,255,0.1)"
    padding: "0 16px"
    display: "flex"
    align-items: "center"
    justify-content: "space-between"
    
  # 底部创作面板
  createPanel:
    position: "fixed"
    bottom: "24px"
    left: "50%"
    transform: "translateX(-50%)"
    width: "calc(100% - 96px)"
    max-width: "800px"
    background: "rgba(255,255,255,0.95)"
    backdrop-blur: "16px"
    border-radius: "20px"
    padding: "16px 20px"
    box-shadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
    z-index: "30"
    border: "1px solid border"
```

### 响应式策略
```yaml
responsive:
  mobile-first: true
  container-padding:
    default: "16px"
    sm: "24px"
    lg: "32px"
    xl: "48px"
```

---

## 功能色语义

```yaml
semanticColors:
  # 状态色
  success:    "#22C55E"   # 成功/正向操作
  warning:    "#F59E0B"   # 警告/注意
  error:      "#DC2626"   # 错误/危险
  info:       "#3B82F6"   # 信息提示
  
  # 积分相关
  credit:
    add:    "#22C55E"     # 充值/获得
    minus:  "#DC2626"     # 消耗
    gift:   "#8B5CF6"     # 赠送
    neutral: "#6B7280"     # 中性
    
  # 任务状态
  status:
    pending:    "#F59E0B"  # 待处理
    processing: "#3B82F6"  # 处理中
    completed:  "#22C55E" # 已完成
    failed:     "#DC2626"  # 失败
```

---

## 设计理念

### 视觉风格
- **极简主义**: 干净整洁，大量留白，减少视觉噪音
- **毛玻璃效果**: 广泛使用 `backdrop-blur` 创建层次感
- **柔和阴影**: 适度的阴影深度，避免过于厚重
- **圆角统一**: 所有元素使用 `lg (10px)` 作为基础圆角

### 色彩策略
- **中性主色**: 黑白灰色系确保专业感和高可读性
- **功能性强调**: 红色用于重要操作和当前选中状态
- **渐变背景**: 深色页面使用蓝灰色渐变，增加视觉层次
- **高对比度**: 确保文字和背景有足够的对比度

### 布局特点
- **极窄侧边栏**: 48px 宽，仅包含功能图标
- **底部悬浮面板**: 创作功能通过浮动底部面板触发
- **居中内容**: 主要内容区域居中，最大宽度控制
- **无对话框**: 资产页面等区域不使用传统对话框

### 交互原则
- **即时反馈**: hover/active/focus 状态清晰可见
- **平滑过渡**: 所有状态变化使用 150-300ms 过渡
- **加载状态**: 使用骨架屏和脉冲动画表示加载中
- **错误提示**: 红色边框和图标标识错误状态

### 字体规范
- **中文优先**: PingFang SC / 微软雅黑确保中文显示最佳
- **系统字体兜底**: 确保各平台都能正常渲染
- **无衬线主体**: 现代简洁的视觉风格

### 可访问性
- **焦点可见**: 所有交互元素有明显的 focus ring
- **色彩对比**: 满足 WCAG AA 标准 (4.5:1)
- **触控友好**: 移动端点击区域至少 44px
