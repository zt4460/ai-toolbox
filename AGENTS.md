# AI 工具箱项目规范

## 项目概述

一站式 AI 创作工具箱网站，集成了多种 AI 能力，包括图片生成、视频生成、数字人创作、视频配音等功能。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **AI SDK**: coze-coding-dev-sdk

## 目录结构

```
src/
├── app/
│   ├── page.tsx                    # 首页（工具卡片展示）
│   ├── layout.tsx                  # 根布局
│   ├── globals.css                 # 全局样式
│   ├── api/                       # API 路由
│   │   ├── image/generate/        # 图片生成 API
│   │   ├── video/generate/        # 视频生成 API
│   │   ├── digital-human/generate/ # 数字人 API
│   │   └── lip-sync/generate/     # 视频配音 API
│   └── tools/                     # 工具页面
│       ├── image/                 # 图片生成页面
│       ├── video/                 # 视频生成页面
│       ├── digital-human/         # 数字人页面
│       └── lip-sync/             # 视频配音页面
├── components/ui/                 # shadcn/ui 组件库
├── hooks/                         # 自定义 Hooks
└── lib/utils.ts                   # 工具函数
```

## 核心功能

### 1. 图片生成 (/tools/image)
- 输入文字描述生成精美图片
- 支持 2K/4K 分辨率
- 使用 `ImageGenerationClient` 调用后端 API

### 2. 视频生成 (/tools/video)
- 文字转视频、图片生视频
- 支持多种分辨率 (480p/720p/1080p)
- 支持多种时长 (4-12秒)
- 可选生成同步音频
- 使用 `VideoGenerationClient` 调用后端 API

### 3. 数字人 (/tools/digital-human)
- 创建 AI 数字人视频
- 支持多种预设形象
- 支持自定义文案或上传音频
- 使用 `TTSClient` 生成配音

### 4. 视频配音 (/tools/lip-sync)
- 视频唇形同步配音
- 支持多种语言和音色选择
- 上传视频 + 输入文案 → 生成配音视频
- 使用 `TTSClient` 生成配音

## 用户系统

### 5. 登录注册 (/auth)
- 邮箱 + 密码登录/注册
- 登录后跳转到首页
- 使用 bcryptjs 加密密码

### 6. 个人中心 (/profile)
- 查看和修改用户信息
- 积分余额展示
- 卡密激活功能
- 积分交易记录查询
- 退出登录

### 7. 需求投稿箱 (/submissions)
- 提交新功能建议、功能优化、问题反馈
- 支持选择优先级
- 查看我的投稿记录
- 状态追踪（待处理、审核中、已采纳、已实现、已拒绝）

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| email | text | 邮箱（唯一） |
| nickname | text | 昵称 |
| password_hash | text | 密码哈希 |
| credits | integer | 积分余额 |
| is_active | boolean | 账号状态 |
| created_at | timestamp | 创建时间 |
| last_login_at | timestamp | 最后登录时间 |

### activation_codes 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| code | text | 卡密（唯一） |
| code_type | text | 类型（积分/月卡/季卡/年卡） |
| credits | integer | 积分数量 |
| is_used | boolean | 是否已使用 |
| used_by | uuid | 使用者用户ID |
| used_at | timestamp | 使用时间 |
| expires_at | timestamp | 过期时间 |

### credit_transactions 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户ID |
| type | text | 交易类型（recharge/consume/refund/activation） |
| amount | integer | 变动数量 |
| balance_before | integer | 变动前余额 |
| balance_after | integer | 变动后余额 |
| source | text | 来源 |
| description | text | 描述 |
| created_at | timestamp | 创建时间 |

### submissions 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 投稿用户 |
| title | text | 标题 |
| description | text | 详细描述 |
| category | text | 类型（feature/improvement/bug/other） |
| priority | text | 优先级（low/normal/high/urgent） |
| status | text | 状态（pending/reviewing/accepted/implemented/rejected） |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 生产环境
pnpm start
```

## API 路由

### POST /api/image/generate
生成图片
```json
Request:
{
  "prompt": "图片描述文字",
  "size": "2K" | "4K"
}

Response:
{
  "success": true,
  "imageUrls": ["图片URL数组"]
}
```

### POST /api/video/generate
生成视频
```json
Request:
{
  "prompt": "视频描述",
  "duration": "5",
  "ratio": "16:9",
  "resolution": "720p",
  "generateAudio": true
}

Response:
{
  "success": true,
  "videoUrl": "视频URL",
  "lastFrameUrl": "最后一帧图片URL",
  "taskId": "任务ID",
  "status": "succeeded"
}
```

## 注意事项

1. **SDK 使用规范**: 所有 AI 能力必须通过 `coze-coding-dev-sdk` 调用，禁止直接调用外部 API
2. **Header 转发**: 使用 `HeaderUtils.extractForwardHeaders()` 提取并转发请求头
3. **后端处理**: AI 相关逻辑必须在后端 API 路由中处理，禁止在客户端暴露 SDK
4. **错误处理**: API 调用必须包含完整的错误处理逻辑
