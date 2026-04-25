---
title: AI 工具箱 - Design System
description: 让AI变成好用的牛马 - 一站式AI创作工具箱网站设计系统
version: 1.0.0

# Color Palette

## Primary Colors
primary: "#1a1a2e"                    # Deep navy background
primary-light: "#16213e"              # Slightly lighter navy
primary-foreground: "#ffffff"          # White text on primary

## Accent Colors
accent-violet: "#8b5cf6"               # Violet 500 - Primary brand color
accent-purple: "#a855f7"               # Purple 500 - Gradient partner
accent-pink: "#ec4899"                # Pink 500 - Video tool accent
accent-rose: "#f43f5e"                 # Rose 600 - Gradient partner
accent-cyan: "#06b6d4"                # Cyan 500 - Digital human accent
accent-blue: "#3b82f6"                # Blue 600 - Gradient partner
accent-amber: "#f59e0b"               # Amber 500 - Lip-sync accent
accent-orange: "#ea580c"               # Orange 600 - Gradient partner

## Background Colors
background: "#000000"                  # Pure black base
background-glass: "rgba(0,0,0,0.3)"     # Glassmorphism overlay
surface: "rgba(255,255,255,0.05)"     # Card surfaces
surface-hover: "rgba(255,255,255,0.1)" # Hover state surfaces

## Text Colors
text-primary: "#ffffff"                # White - Primary text
text-secondary: "rgba(255,255,255,0.7)" # 70% white - Secondary text
text-muted: "rgba(255,255,255,0.4)"    # 40% white - Muted text
text-accent: "#8b5cf6"                 # Violet for accents

## Status Colors
success: "#10b981"                    # Emerald 500
success-light: "#34d399"              # Emerald 400
warning: "#f59e0b"                    # Amber 500
warning-light: "#fbbf24"              # Amber 400
error: "#ef4444"                      # Red 500
error-light: "#f87171"                # Red 400

## Border Colors
border: "rgba(255,255,255,0.1)"       # Subtle borders
border-light: "rgba(255,255,255,0.05)" # Lighter borders

# Typography

## Font Families
font-sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
font-mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
font-serif: "'Noto Serif SC', 'Songti SC', 'SimSun', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"

## Font Sizes
text-xs: "0.75rem"      # 12px - Labels, captions
text-sm: "0.875rem"     # 14px - Secondary text
text-base: "1rem"       # 16px - Body text
text-lg: "1.125rem"     # 18px - Lead text
text-xl: "1.25rem"      # 20px - Card titles
text-2xl: "1.5rem"      # 24px - Section headers
text-3xl: "1.875rem"    # 30px - Page titles
text-hero: "3rem"        # 48px - Hero headline

## Font Weights
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700

## Line Heights
leading-tight: 1.25
leading-normal: 1.5
leading-relaxed: 1.75

# Spacing System

## Base Unit: 4px

spacing-1: "0.25rem"    # 4px
spacing-2: "0.5rem"     # 8px
spacing-3: "0.75rem"    # 12px
spacing-4: "1rem"        # 16px
spacing-5: "1.25rem"    # 20px
spacing-6: "1.5rem"      # 24px
spacing-8: "2rem"        # 32px
spacing-10: "2.5rem"    # 40px
spacing-12: "3rem"       # 48px
spacing-16: "4rem"       # 64px

## Container
container-max: "1280px"
container-padding: "1rem"  # px-4

# Border Radius

radius-sm: "0.5rem"      # 8px - Small elements
radius-md: "0.625rem"     # 10px - Default radius
radius-lg: "0.75rem"      # 12px - Cards
radius-xl: "1rem"         # 16px - Large cards
radius-2xl: "1.25rem"     # 20px - Modals
radius-3xl: "1.5rem"      # 24px - Extra large
radius-full: "9999px"     # Pills, avatars

# Shadows

shadow-none: "none"
shadow-sm: "0 1px 2px rgba(0,0,0,0.05)"
shadow-md: "0 4px 6px rgba(0,0,0,0.1)"
shadow-lg: "0 10px 15px rgba(0,0,0,0.1)"
shadow-glow-violet: "0 0 40px rgba(139,92,246,0.3)"
shadow-glow-pink: "0 0 40px rgba(236,72,153,0.3)"

# Elevation

elevation-1: "bg-black/30 backdrop-blur-sm border-b border-white/10"
elevation-2: "bg-white/5 backdrop-blur-sm border border-white/10"
elevation-3: "bg-white/10 backdrop-blur-md border border-white/20"

# Motion & Animation

## Transitions
transition-fast: "150ms"
transition-normal: "200ms"
transition-slow: "300ms"
ease-out: "cubic-bezier(0.33, 1, 0.68, 1)"
ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"

## Blur Effects
blur-sm: "4px"
blur-md: "8px"
blur-lg: "16px"
blur-xl: "32px"
blur-2xl: "64px"
blur-3xl: "128px"  # Background orbs

# Component Specifications

## Buttons

### Primary Button
- Background: gradient from accent-violet to accent-purple
- Text: white, font-medium
- Padding: px-4 py-2
- Border radius: rounded-xl
- Hover: opacity-90
- Active: scale-[0.98]

### Secondary Button
- Background: bg-white/10
- Text: white/70, hover: white
- Border: border border-white/10
- Hover: bg-white/20
- Border radius: rounded-xl
- Padding: px-4 py-2

### Icon Button
- Size: w-10 h-10
- Background: bg-white/10
- Border radius: rounded-xl
- Hover: bg-white/20
- Icon size: w-5 h-5

## Cards

### Tool Card
- Background: surface color with gradient overlay
- Border: border border-white/10
- Border radius: rounded-2xl
- Padding: p-6
- Hover: bg-white/10, scale-[1.02]
- Shadow: none (flat design)

### Content Card
- Background: surface
- Border: border border-white/10
- Border radius: rounded-xl
- Padding: p-4 to p-6

## Form Elements

### Input
- Background: bg-white/10
- Border: border border-white/10
- Border radius: rounded-lg
- Text: white
- Placeholder: white/40
- Focus: ring-2 ring-violet-500/50

### Textarea
- Same as Input
- Min height: 120px

## Navigation

### Header
- Background: bg-black/30 with backdrop-blur-sm
- Border: border-b border-white/10
- Height: auto (py-4)
- Sticky: yes

### Nav Link
- Text: text-sm, white/70
- Hover: text-white
- Transition: 200ms

## Background Effects

### Ambient Orbs
- Size: 80-96 (w-80 to w-96)
- Blur: blur-[128px]
- Opacity: 0.2 (20%)
- Position: absolute, various corners
- Colors: violet, blue, pink (primary theme)

### Gradient Overlays
- Tool cards: from-{color}-500/20 to-{color}-600/20
- Balance cards: from-amber-500/20 to-orange-500/20

---

# Design Language

## Overall Aesthetic

The AI 工具箱 design embodies a **dark, futuristic aesthetic** with glassmorphism elements and vibrant accent colors. It feels like a premium SaaS product designed for creative professionals who work with AI tools.

The interface is **minimal yet expressive**, using color strategically to differentiate between tools while maintaining visual cohesion through the consistent dark base.

## Color Strategy

### Why Dark Theme?
The dark theme serves multiple purposes:
1. Reduces eye strain during extended creative sessions
2. Makes generated content (images, videos) stand out against the UI
3. Creates a professional, tech-forward atmosphere
4. Allows vibrant accent colors to pop without overwhelming

### Accent Color Mapping
Each tool category has its own signature gradient:
- **图片生成 (Image)**: Violet to Purple - represents creativity and imagination
- **视频生成 (Video)**: Pink to Rose - represents dynamic motion and energy
- **数字人 (Digital Human)**: Cyan to Blue - represents technology and futurism
- **视频配音 (Lip-sync)**: Amber to Orange - represents warmth and human connection

### Glassmorphism Implementation
Translucent surfaces with backdrop-blur create depth without visual clutter:
- Header: `bg-black/30 backdrop-blur-sm`
- Cards: `bg-white/5 backdrop-blur-sm border border-white/10`
- Modals: `bg-black/50 backdrop-blur-lg`

## Typography Decisions

### Chinese-First Font Stack
The font stack prioritizes Chinese font rendering:
```
'PingFang SC' → macOS Chinese
'Hiragino Sans GB' → macOS Japanese/Chinese
'Microsoft YaHei' → Windows Chinese
```

This ensures crisp, native-feeling text on all major platforms.

### Hierarchy Through Size
- Hero text (48px) for emotional impact
- Section headers (24px) for clear navigation
- Body text (16px) for readability
- Labels (12-14px) for supporting information

## Spacing & Rhythm

### Consistent 4px Base
All spacing follows a 4px grid, creating visual harmony:
- Tight spacing (4-8px): within components
- Medium spacing (16-24px): between related elements
- Large spacing (32-48px): between sections

### Card Padding
Tool cards use 24px padding, providing enough space for content without feeling sparse.

## Visual Effects

### Ambient Background Orbs
Large, blurred gradient orbs create an ethereal atmosphere:
- Positioned in corners and edges
- 128px blur creates soft, diffused glow
- 20% opacity prevents overwhelming the content
- Colors complement the primary brand palette

### Gradient Borders
Premium cards use subtle gradient borders:
```css
border border-amber-500/20
```

### Icon Gradient Backgrounds
Tool cards feature icons with matching gradient backgrounds:
```css
bg-gradient-to-br from-violet-500 to-purple-600
```

## Component Patterns

### Consistent Border Radius
All interactive elements use rounded-xl (16px) or rounded-2xl (20px), creating a soft, approachable feel.

### Hover States
Interactive elements use subtle brightness/opacity changes rather than dramatic transforms:
- Buttons: `opacity-90` or `bg-white/20`
- Cards: `bg-white/10` and slight scale

### Icon Wrappers
Icons are often contained within gradient or tinted backgrounds:
```jsx
<div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
  <Icon className="w-5 h-5 text-violet-400" />
</div>
```

## Responsive Strategy

- Mobile-first approach with `px-4` container padding
- Grid layouts collapse from 2-4 columns on mobile to larger screens
- Navigation remains simple (single row) on all screen sizes
- Cards maintain readable proportions at all breakpoints

## Interaction Design

### Modal/Overlay Pattern
Contact and Mailbox modals:
- Centered with `fixed inset-0`
- Dark overlay `bg-black/50 backdrop-blur-lg`
- Content in rounded-2xl container
- Close button in top-right corner

### Tab Navigation
Used in auth page and history page:
- Full-width tabs with equal distribution
- Active state: solid background
- Inactive state: transparent with hover effect

## Accessibility Considerations

- Sufficient color contrast (white text on dark backgrounds)
- Focus states via ring utilities
- Semantic HTML structure
- Keyboard-navigable interface
- Loading states for async operations

---

# Layout Structure

## Page Hierarchy

### 1. Homepage (/)
- Hero section with brand message
- Tool grid (2x2 on mobile, 4x1 on desktop)
- Mailbox trigger (floating or prominent button)

### 2. Tool Pages (/tools/*)
- Header with back navigation
- Input form section
- Generation controls
- Result preview area

### 3. User Pages (/credits, /history)
- Consistent header with back button
- Content cards in vertical stack
- Action buttons within cards

### 4. Auth Page (/auth)
- Centered card layout
- Tab switching between login/register
- Minimal distractions

---

# Icon System

Uses **Lucide React** icon library with consistent sizing:
- Navigation icons: 16px (w-4 h-4)
- Action icons: 20px (w-5 h-5)
- Display icons: 24-48px (w-6 h-6 to w-12 h-12)

Icon colors follow the accent color of their context.

---

# Future Considerations

- Dark/Light mode toggle (currently dark-only)
- Custom scrollbar styling
- Skeleton loading states for content
- Toast notifications for actions
- Tooltip documentation for power users
