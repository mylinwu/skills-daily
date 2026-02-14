# expo-tailwind-setup 技能分析报告

- 技能来源：`expo/skills/expo-tailwind-setup`
- 分析日期：2026-02-14

## 1. 技能用途

`expo-tailwind-setup` 是一个面向 Expo 项目的落地指南，目标是在 React Native + Web 的统一代码体系里，引入 Tailwind CSS v4，并配合 `react-native-css` 与 NativeWind v5 提供可用的 `className` 样式能力。

它主要解决三类问题：

1. **Expo 中的 Tailwind v4 初始化**：明确安装依赖、`metro.config.js`、`postcss.config.mjs`、`global.css` 的最小配置。
2. **跨平台样式统一**：在 iOS/Android/Web 之间，通过 CSS 变量与媒体查询统一字体、颜色和主题 token。
3. **React Native 组件 className 支持**：通过 `useCssElement` 封装基础组件，避免“样式写了但不生效”的问题。

适用场景：

- 新项目需要 Tailwind v4 + Expo 的稳定起步模板；
- 旧项目从 NativeWind v4 / Tailwind v3 升级；
- 设计系统需要同时覆盖移动端与 Web，并保持 token 一致。

---

## 2. 目录结构

```text
temp/expo-tailwind-setup/
└── SKILL.md
```

---

## 3. 作用机制分析

### 3.1 核心机制：三层协同

该技能的工作机制可以拆成三层：

1. **编译层（PostCSS）**
   - 使用 `@tailwindcss/postcss` 处理 Tailwind v4 语法。
   - 采用 `@import "tailwindcss/..."` 引入 theme/base/utilities。

2. **打包层（Metro + NativeWind v5）**
   - `withNativewind(config, { inlineVariables: false, globalClassNamePolyfill: false })` 注入转换能力。
   - `inlineVariables: false` 是为了兼容 CSS 变量中 `PlatformColor` 等平台语义颜色能力。

3. **运行时层（react-native-css）**
   - 通过 `useCssElement` 显式把 `className` 映射到 RN 组件样式属性（如 `style`、`contentContainerStyle`）。
   - 这一步是 RN 能真正吃到 Tailwind class 的关键。

---

### 3.2 为什么强调“不需要 babel.config.js”

文档强调 Tailwind v4 + NativeWind v5 下不再依赖旧的 Babel 方案（如 `nativewind/babel`）。

背后的策略变化：

- 从“Babel 驱动的样式注入”切换到“CSS-first + Metro transformer”模式；
- 减少 Babel 配置耦合，避免旧配置残留造成冲突；
- 把主题与 token 定义回归到 CSS（`@theme`），降低 JS 配置复杂度。

---

### 3.3 组件封装层的设计价值

技能给出的 `src/tw/index.tsx`、`src/tw/image.tsx`、`src/tw/animated.tsx` 并非示例代码，而是工程稳定性的关键层：

- 统一 `className` 类型声明，降低 TS 报错；
- 封装 `ScrollView` 的 `contentContainerClassName` 映射，避免容器样式丢失；
- 对 `expo-image` 做 `objectFit/objectPosition -> contentFit/contentPosition` 的语义转换；
- 对 `TouchableHighlight` 处理 `underlayColor`，避免样式展开后行为异常。

这说明该技能不仅给“配置文件”，还给出“跨组件差异适配策略”。

---

### 3.4 主题与平台适配机制

技能通过两类机制建立跨端一致性：

1. **平台媒体查询**：`@media ios` / `@media android` 分别覆盖字体或颜色变量；
2. **语义变量体系**：先定义 `--sf-*` 变量，再通过 `@theme` 注册为 Tailwind 可用色板（如 `text-sf-text`）。

并提供 `useCSSVariable` 在 JS 中读取变量，使“样式 token”可以同时服务于 className 与内联样式逻辑。

---

### 4. 迁移差异与风险点

对比 NativeWind v4 / Tailwind v3，该技能给出的关键迁移差异：

1. 不再需要 `babel.config.js` 的 NativeWind 配置；
2. PostCSS 插件由旧写法转为 `@tailwindcss/postcss`；
3. `@import` 替代旧 `@tailwind` 指令习惯；
4. 主题从 `tailwind.config.js` 转向 CSS `@theme`；
5. `className` 依赖组件包装层而不是全局自动可用。

典型风险：

- 旧 Babel 配置未删干净导致冲突；
- 入口文件漏引 `global.css`，出现“样式全部不生效”；
- 组件未经过 `useCssElement` 包装，className 无效；
- iOS 平台色变量未放在正确媒体查询中。

---

### 5. 总结

`expo-tailwind-setup` 的实质是一套 **Expo + Tailwind v4 的工程化接入范式**：

- 配置上，走 CSS-first 与 Metro transformer；
- 组件上，走 wrapper 适配层；
- 设计系统上，走跨平台语义变量。

它的价值不是“装几个包”，而是提供一条能在 RN/Web 场景长期维护的样式架构路径。

---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-14_expo-tailwind-setup.md