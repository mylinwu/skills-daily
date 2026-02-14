# Vercel React Native Skills 技能分析报告

> 来源：[vercel-react-native-skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) | 安装量：1,775

## 技能用途

这是 Vercel 官方出品的 **React Native / Expo 最佳实践规则集**，为 AI 编码助手提供 35+ 条性能优化规则，覆盖从核心渲染到字体加载的完整移动端开发链路。

**核心能力：**

- **列表性能优化**：虚拟化列表、memo 优化、稳定引用、图片压缩等 8 条关键规则
- **动画最佳实践**：GPU 加速属性、Reanimated 模式、手势动画等 3 条规则
- **原生导航**：使用 native-stack 和 native-tabs 替代 JS 导航器
- **状态管理**：最小化状态、派生值优先、dispatch updater 模式
- **UI 模式**：expo-image、原生菜单（zeego）、原生模态框、Pressable 替代 Touchable
- **React Compiler 兼容**：解构函数、shared value 的 .get()/.set() 用法
- **Monorepo 配置**：原生依赖安装位置、统一版本管理

**典型使用场景：**

1. AI 辅助编写 React Native 组件时自动遵循性能最佳实践
2. 代码审查时检测常见的性能反模式
3. 重构现有 RN 代码库时作为规则参考
4. 新项目搭建时建立编码规范

## 目录结构

```text
vercel-react-native-skills/
├── SKILL.md     # 技能入口，包含规则索引和优先级分类（122行）
├── AGENTS.md    # 完整规则文档，所有规则展开的详细版本（2898行）
└── rules/       # 空目录（规则已全部编译到 AGENTS.md 中）
```

## 作用机制分析

### 1. 分层优先级体系

技能将 35+ 条规则按影响程度分为 4 个优先级，14 个类别：

| 优先级 | 类别 | 规则数 | 典型规则 |
|--------|------|--------|----------|
| CRITICAL | 核心渲染、列表性能 | ~10 | 禁止 `&&` 渲染 falsy 值、虚拟化列表 |
| HIGH | 动画、滚动、导航、UI | ~12 | GPU 属性动画、原生导航器、expo-image |
| MEDIUM | 状态管理、React Compiler、设计系统 | ~10 | 派生值优先、解构函数、复合组件 |
| LOW | Monorepo、字体、JS 优化 | ~5 | 原生字体加载、Intl 对象提升 |

这种分层设计让 AI 在资源有限时优先处理高影响规则。

### 2. "错误 vs 正确"对比教学法

每条规则都采用统一的结构：

```
规则标题 → 影响等级 → 原因说明 → ❌ 错误代码 → ✅ 正确代码 → 补充说明
```

这种"反模式 + 正确模式"的对比格式，让 AI 能精确识别代码中的问题模式并自动修正。例如：

- ❌ `{count && <Text>...</Text>}` → ✅ `{count ? <Text>...</Text> : null}`
- ❌ `TouchableOpacity` → ✅ `Pressable`
- ❌ `ScrollView + map` → ✅ `LegendList / FlashList`

### 3. 关键技术决策的编码

技能将多个重要的技术选型决策固化为规则：

- **列表库**：推荐 LegendList（首选）和 FlashList，而非 FlatList
- **图片库**：统一使用 expo-image，替代 RN 原生 Image
- **导航**：native-stack + native-tabs，禁用 JS 导航器
- **菜单**：zeego 原生菜单，替代自定义 JS 菜单
- **模态框**：原生 Modal（formSheet），替代 JS bottom sheet
- **状态管理**：Zustand selector 优于 React Context（列表场景）
- **动画**：仅动画 transform 和 opacity（GPU 加速属性）

### 4. React Compiler 前瞻性支持

技能专门为 React Compiler 兼容性设置了规则：

- 在 render 顶部解构函数（避免 `.` 访问导致缓存失效）
- Reanimated shared value 使用 `.get()` / `.set()` 替代 `.value`
- 多处标注"如果启用了 React Compiler，此优化可省略"

这种前瞻性设计让技能在 React Compiler 普及后仍然适用。

### 5. 状态哲学："状态是最小真相"

技能贯穿了一个核心状态管理哲学：

> State should be the minimal source of truth. Everything else is derived.

具体体现为：

- 状态变量存储"真相"（如 `pressed: 0|1`），视觉效果通过 `interpolate` 派生
- 禁止冗余状态（如同时存储 `items` 和 `itemCount`）
- 使用 `undefined` 初始状态 + `??` 回退值，保持对父级数据的响应性
- dispatch updater 避免闭包陈旧问题

### 6. 双文件架构

- **SKILL.md**（122行）：作为索引和快速参考，列出所有规则的 ID 和一句话描述
- **AGENTS.md**（2898行）：完整的规则展开文档，包含所有代码示例

这种设计让 AI 可以先读 SKILL.md 快速定位相关规则，再按需查阅 AGENTS.md 中的详细内容，节省 token 消耗。

### 总结

这是一个**规则驱动型**技能，通过 35+ 条结构化的"反模式→正确模式"规则，将 Vercel 团队在 React Native 性能优化方面的工程经验编码为 AI 可执行的指令。它的价值在于：将分散在文档、博客、经验中的最佳实践，统一为一套优先级明确、代码示例丰富的规则集，让 AI 编码助手在生成和审查 RN 代码时自动遵循这些实践。对于使用 React Native / Expo 的团队来说，这是一个高价值的基础设施技能。

---

文档地址: <https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-12_vercel-react-native-skills.md>
