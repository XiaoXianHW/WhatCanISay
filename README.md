# What Can I Say?

拒绝做NPC，测测你的赛博情商 - 一个基于AI的社交能力测试应用

## 快速开始

### 开发环境

1. 安装依赖：
```bash
pnpm install
```

2. 配置AI API Key（编辑 `config/config.ts`）：
```typescript
ai: {
  apiKey: 'your-api-key-here',
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
}
```

3. 启动开发服务器：
```bash
pnpm dev
```

这会同时启动：
- 前端开发服务器：http://localhost:5173
- 后端API服务器：http://localhost:3001

前端会通过Vite代理自动转发API请求到后端，**无需手动配置API地址**。

### 生产环境

1. 构建：
```bash
pnpm build
```

2. 启动生产服务器：
```bash
pnpm start
```

生产环境下，前后端运行在同一个端口（3001），访问 http://localhost:3001 即可。

## 技术栈

- **前端**：React + TypeScript + Vite + Tailwind CSS
- **后端**：Express + TypeScript
- **状态管理**：Zustand
- **动画**：Framer Motion
- **AI**：DeepSeek API

## 架构说明

- 开发环境：前端(5173) + 后端(3001)，通过Vite代理通信
- 生产环境：单端口(3001)，后端提供静态文件和API服务
- API路径统一为 `/api/*`，无需配置后端地址

## What Can I Say? - 赛博情商测试

一个基于AI评价的社交能力测试Web应用。通过场景模拟测试用户的社交应对能力，并给出专属称号。

## 功能特点

- 🎭 **真实场景模拟** - 6个精心设计的社交场景
- 🤖 **AI智能评价** - 多维度分析你的应答能力
- 📊 **能力可视化** - 雷达图展示各维度评分
- 🏆 **专属称号系统** - 根据评分获得独特称号
- 🌓 **明暗主题** - 支持深蓝配色的双主题切换
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **路由**: React Router
- **状态管理**: Zustand
- **动画**: Framer Motion
- **图表**: Recharts
- **图标**: React Icons

### 后端
- **框架**: Express + TypeScript
- **安全**: CORS + 速率限制
- **环境管理**: dotenv

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API Key（必须）

创建 `config/config.ts` 用于配置：

```bash
# 复制示例文件
cp config/config.example.ts config/config.ts
```

编辑 `config/config.ts`，修改 AI 配置中的 apiKey：

```typescript
serverConfig: {
  // ...
  ai: {
    apiKey: 'your-api-key-here',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    temperature: 0.8,
  },
}
```

支持的AI提供商：
- OpenAI (GPT-3.5/4)
- DeepSeek (推荐，性价比高)
- Kimi
- 其他兼容OpenAI格式的API

> **⚠️ 安全提示：** `config/config.ts` 已加入 `.gitignore`，不会被提交到Git。
> 
> **📝 配置说明：** 
> - `config/public.config.ts` - 前端可访问的公开配置
> - `config/config.ts` - 包含敏感信息的完整配置（仅后端使用，不提交）

### 3. 启动项目

```bash
npm run dev
```

这会同时启动：
- 🎨 前端开发服务器：`http://localhost:5173`
- 🔧 后端API服务器：`http://localhost:3001`

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
WhatCanISay/
├── src/                     # 前端源码
│   ├── components/          # 组件
│   ├── pages/               # 页面
│   ├── services/            # 服务层（调用后端API）
│   ├── stores/              # 状态管理
│   ├── data/                # 静态数据
│   └── types/               # 类型定义
├── config/                  # 配置文件
│   ├── public.config.ts     # 前端可访问的公开配置
│   ├── config.ts            # 完整配置（含敏感信息，不提交）
│   └── config.example.ts    # 配置示例文件
├── server.ts                # 后端API服务器
└── package.json             # 统一依赖管理
```

## 评价维度

测试从以下4个维度评价用户的社交能力：

1. **高情商 (Rizz)** - 化解尴尬、同理心、让人舒服
2. **抽象值 (Abstract)** - 网络文化理解度、含梗量
3. **NPC指数 (NPC Energy)** - 回答是否模板化、缺乏个性
4. **攻击性 (Toxic)** - 是否带有攻击性、易引起冲突

## 称号系统

根据评价结果，用户将获得以下称号之一：

- 🏆 赛博外交官
- ⭐ 情商战神
- 🎨 抽象大帝
- 🤖 出厂设置NPC
- 💀 话题终结者
- 💣 社交炸弹
- ❤️ 纯爱战神
- 🌊 冲浪达人
- 📚 社交学徒

## 开发说明

### 添加新场景

编辑 `src/data/scenarios.ts`：

```typescript
{
  id: 'scenario-x',
  category: '职场求生',
  situation: '场景描述',
  context: '背景信息',
  timeLimit: 30,
  inputType: 'text',
}
```

### 添加新称号

编辑 `src/data/titles.ts`：

```typescript
{
  name: '称号名称',
  description: '称号描述',
  condition: (evaluation) => evaluation.rizz >= 80,
  advice: ['建议1', '建议2'],
}
```

## 许可

MIT License

## 作者

Darf - 2024
