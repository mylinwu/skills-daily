# vercel-react-best-practices 技能深度解析

> **技能 ID**：`vercel-labs/agent-skills/vercel-react-best-practices`
> **来源**：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
> **安装量**：4,694（Trending）
> **分析日期**：2026-02-06
> **技能链接**：<https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices>

---

## 一、技能用途

`vercel-react-best-practices` 是 Vercel 工程团队维护的 React 和 Next.js 性能优化指南技能。它的核心目标是让 AI Agent 在编写、审查或重构 React/Next.js 代码时，自动遵循一套经过实战验证的性能最佳实践。

### 适用场景

- 编写新的 React 组件或 Next.js 页面
- 实现数据获取逻辑（客户端或服务端）
- 审查代码中的性能问题
- 重构现有 React/Next.js 代码
- 优化打包体积或加载时间

### 覆盖范围

包含 **57 条规则**，横跨 **8 个类别**，按影响程度从高到低排列：

| 优先级 | 类别 | 影响等级 | 规则数 |
|--------|------|----------|--------|
| 1 | 消除瀑布流 | CRITICAL | 5 |
| 2 | 打包体积优化 | CRITICAL | 5 |
| 3 | 服务端性能 | HIGH | 7 |
| 4 | 客户端数据获取 | MEDIUM-HIGH | 4 |
| 5 | 重渲染优化 | MEDIUM | 12 |
| 6 | 渲染性能 | MEDIUM | 9 |
| 7 | JavaScript 性能 | LOW-MEDIUM | 12 |
| 8 | 高级模式 | LOW | 3 |

---

## 二、目录结构

```
vercel-react-best-practices/
├── SKILL.md          # 技能元数据 + 规则索引（6KB）
├── AGENTS.md         # 完整编译文档，所有规则展开（82KB）
└── rules/            # 57 个独立规则文件
    ├── async-defer-await.md
    ├── async-parallel.md
    ├── async-dependencies.md
    ├── async-api-routes.md
    ├── async-suspense-boundaries.md
    ├── bundle-barrel-imports.md
    ├── bundle-dynamic-imports.md
    ├── bundle-defer-third-party.md
    ├── bundle-conditional.md
    ├── bundle-preload.md
    ├── server-auth-actions.md
    ├── server-cache-react.md
    ├── server-cache-lru.md
    ├── ... (共 57 个规则文件)
    ├── js-set-map-lookups.md
    ├── advanced-event-handler-refs.md
    ├── advanced-init-once.md
    └── advanced-use-latest.md
```

**三层文档架构：**

- `SKILL.md`：轻量索引，包含元数据和规则速查表
- `AGENTS.md`：完整文档（82KB），所有规则的详细说明和代码示例
- `rules/`：57 个独立规则文件，每个规则单独一个 Markdown

---

## 三、作用机制分析

### 3.1 技能类型：规则库 + 提示词引导

与纯提示词型技能不同，`vercel-react-best-practices` 是一个**结构化规则库**。它通过三层文档体系，为 AI Agent 提供了从快速索引到深度参考的完整知识体系。

### 3.2 触发机制

SKILL.md 的 frontmatter 定义了触发条件：

```yaml
description: React and Next.js performance optimization guidelines from Vercel Engineering.
  This skill should be used when writing, reviewing, or refactoring React/Next.js code
  to ensure optimal performance patterns. Triggers on tasks involving React components,
  Next.js pages, data fetching, bundle optimization, or performance improvements.
```

当用户的任务涉及 React 组件、Next.js 页面、数据获取、打包优化或性能改进时，Agent 会自动激活该技能。

### 3.3 规则文件设计

每个规则文件遵循统一格式：

1. **问题说明**：为什么这个模式有问题
2. **错误示例**：带注释的反面代码
3. **正确示例**：带注释的正面代码
4. **影响说明**：性能提升的量化描述

这种"错误 vs 正确"的对比格式，非常适合 AI Agent 进行模式匹配和代码重构。

### 3.4 优先级体系

规则按影响程度分为 8 个优先级，每个规则有统一的前缀命名：

- `async-` 前缀 → 消除瀑布流（CRITICAL）
- `bundle-` 前缀 → 打包优化（CRITICAL）
- `server-` 前缀 → 服务端性能（HIGH）
- `client-` 前缀 → 客户端获取（MEDIUM-HIGH）
- `rerender-` 前缀 → 重渲染优化（MEDIUM）
- `rendering-` 前缀 → 渲染性能（MEDIUM）
- `js-` 前缀 → JS 性能（LOW-MEDIUM）
- `advanced-` 前缀 → 高级模式（LOW）

这种设计让 Agent 能按优先级决定先应用哪些规则。

### 3.5 双文档策略

- **AGENTS.md**（82KB）：完整的一体化文档，适合 Agent 一次性加载全部上下文
- **rules/ 目录**（57 个文件）：按需加载单个规则，适合针对性查阅

这种设计兼顾了"全局理解"和"精准查找"两种使用模式。

### 3.6 核心规则举例

**最高优先级 — 消除瀑布流：**

```typescript
// ❌ 串行执行，3 次网络往返
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ 并行执行，1 次网络往返
const [user, posts, comments] = await Promise.all([
  fetchUser(), fetchPosts(), fetchComments()
])
```

**打包优化 — 避免桶文件导入：**

```typescript
// ❌ 导入整个桶文件
import { Button } from '@/components'

// ✅ 直接导入具体文件
import { Button } from '@/components/Button'
```

### 3.7 核心洞察

| 维度 | 分析 |
|------|------|
| **技术复杂度** | 中等 — 纯文档，但内容专业深入 |
| **生效方式** | 注入 Agent 上下文，作为代码生成和审查的参考标准 |
| **依赖** | 无外部依赖，纯知识型技能 |
| **可复制性** | 高 — 任何团队都可以用同样的模式创建自己的最佳实践技能 |
| **实用价值** | 非常高 — 57 条规则覆盖了 React/Next.js 开发的主要性能陷阱 |

---

## 总结

`vercel-react-best-practices` 是一个典型的**结构化知识库型技能**，由 Vercel 工程团队维护。它通过三层文档架构（索引 → 完整文档 → 独立规则文件）和统一的"错误 vs 正确"对比格式，为 AI Agent 提供了一套系统化的 React/Next.js 性能优化知识。与简单的提示词引导不同，这个技能的价值在于其**深度和广度** — 57 条规则覆盖了从关键的瀑布流消除到细粒度的 JS 性能优化，并按影响程度排列优先级，让 Agent 能做出有依据的优化决策。


---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-06_vercel-react-best-practices.md