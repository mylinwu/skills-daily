# flutter-animations 技能分析报告

## 技能用途

`flutter-animations` 是一个面向 Flutter 动效开发的“选型 + 实现”技能包，核心价值不是只给代码片段，而是帮你快速判断：当前需求应该用哪类动画、如何落地、如何避免性能和可维护性问题。

它覆盖了 Flutter 动画中最常见的 5 类场景：

1. **隐式动画（Implicit）**：状态变化驱动，低成本实现常见过渡（如尺寸、透明度、颜色）。
2. **显式动画（Explicit）**：通过 `AnimationController` 精细控制生命周期、节奏和多属性联动。
3. **Hero 共享元素转场**：页面之间“元素飞行”过渡，提升导航连贯感。
4. **交错动画（Staggered）**：一个控制器驱动多个时间片，完成顺序/重叠动画编排。
5. **物理动画（Physics-based）**：基于弹簧、重力、速度等模拟，做更自然的交互反馈。

---

## 目录结构

```text
temp/flutter-animations/
├── SKILL.md
├── assets/
│   └── templates/
│       ├── explicit_animation.dart
│       ├── hero_transition.dart
│       ├── implicit_animation.dart
│       └── staggered_animation.dart
└── references/
    ├── curves.md
    ├── explicit.md
    ├── hero.md
    ├── implicit.md
    ├── physics.md
    └── staggered.md
```

结构分工非常清晰：

- **SKILL.md**：主入口，提供决策树 + 实践模式 + 常见坑。
- **references/**：按主题拆解的“可查手册”，适合边写边检索。
- **assets/templates/**：可直接改造的代码骨架，帮助快速起步。

---

## 作用机制分析

### 1) 先做“动画类型决策”，再给实现细节

该技能最关键的设计是把“写代码前的选型”前置：

- 只改少量属性、由状态触发 → 隐式动画
- 需要监听状态/中断/反向/多属性协同 → 显式动画
- 页面间共享元素 → Hero
- 多段节奏编排 → Staggered
- 希望有真实物理感 → Physics

这让它不仅回答“怎么写”，还能回答“为什么这样写更合适”，能有效减少错误选型导致的返工。

### 2) 用“模式化组件”降低动画复杂度

在显式动画部分，它反复强调两种高复用模式：

- `AnimatedWidget`
- `AnimatedBuilder`

本质是把“动画值变化”与“UI 结构”解耦，避免在 listener 里高频 `setState()`，兼顾性能和可维护性。对于中大型项目，这比只会写控制器 demo 更实用。

### 3) 通过 `Interval` 统一编排多动画时间线

交错动画部分的核心机制是：

- **一个控制器**作为全局时钟
- 每个子动画使用不同 `Interval(start, end)`

这样可以把“顺序、重叠、间隔”都映射到 0~1 的时间轴，天然适合菜单入场、卡片瀑布出现、onboarding 分步演示等场景。

### 4) Hero 不只讲基础 tag，还覆盖“飞行阶段定制”

除了标准 tag 匹配，它还扩展了：

- `createRectTween`（如 `MaterialRectCenterArcTween`）
- `flightShuttleBuilder`（飞行中自定义外观）
- Radial Hero（圆形到矩形的形态变换）

这说明该技能不是停留在“会用 Hero”，而是支持做出产品级转场质感。

### 5) 物理动画强调“参数可调 + 体验校准”

Physics 文档把 `mass / stiffness / damping` 的作用拆解得很具体，并给出参数预设（bouncy/snappy/gentle）。

这类知识的价值在于：

- 避免把物理动画当黑盒
- 让团队能围绕“手感”进行可复现调参
- 将交互主观体验转化为可讨论的工程参数

### 6) 强调工程化约束：性能、调试、可访问性

该技能在各章节都反复出现三类工程约束：

- **性能**：减少重建、合理使用 `AnimatedBuilder`、必要时加 `RepaintBoundary`
- **调试**：`timeDilation`、状态监听、性能面板
- **无障碍**：尊重 `MediaQuery.disableAnimations`

这让它从“动画实现技巧”升级为“可上线动效实践”。

---

## 总结

`flutter-animations` 的核心优势在于：

- **覆盖全**：从简单过渡到复杂转场、从时序编排到物理模拟。
- **可落地**：有决策树、有参考手册、有模板代码。
- **偏工程化**：持续强调性能、可维护性和可访问性。

如果你在 Flutter 项目里经常遇到“该用哪种动画”“如何让动效不抖不卡”“怎样把 demo 变成可维护代码”，这个技能的参考价值很高。


---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-14_flutter-animations.md