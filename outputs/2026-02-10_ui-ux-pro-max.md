# ui-ux-pro-max 技能分析报告

**日期**：2026-02-10  
**技能名称**：ui-ux-pro-max  
**技能 ID**：nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max  
**安装量**：1,346 次

---

## 一、技能用途

**ui-ux-pro-max** 是一个全面的 UI/UX 设计智能助手，旨在帮助开发者、设计师和产品经理快速生成专业级的界面设计方案。它集成了 50+ 种设计风格、97 种调色板、57 种字体搭配、99 条 UX 准则，以及 25 种图表类型，覆盖 9 种主流技术栈（React、Next.js、Vue、Svelte、SwiftUI、React Native、Flutter、Tailwind、shadcn/ui）。

### 主要应用场景

- **新项目启动**：快速确定整体设计方向和系统
- **组件/页面设计**：生成按钮、表单、卡片、导航栏等组件的设计规范
- **代码审查**：检查现有 UI 代码是否符合最佳实践
- **设计系统构建**：创建完整的设计令牌（颜色、字体、间距、阴影）
- **多平台适配**：为不同技术栈提供针对性的实现指南

### 支持的项目类型

网站/落地页、仪表盘、管理后台、电子商务、SaaS 应用、个人作品集、博客、移动应用

### 支持的文件类型

- `.html` - 纯 HTML/Tailwind
- `.tsx` - React/Next.js
- `.vue` - Vue
- `.svelte` - Svelte

---

## 二、目录结构

```
ui-ux-pro-max/
├── SKILL.md              # 技能说明文档（用户指南）
├── data/                 # 核心数据仓库
│   ├── styles.csv        # 50+ 种设计风格定义
│   ├── colors.csv        # 97 种产品类型调色板
│   ├── typography.csv    # 57 种字体搭配方案
│   ├── charts.csv        # 25 种图表类型推荐
│   ├── landing.csv       # 落地页结构模式
│   ├── products.csv      # 产品类型设计建议
│   ├── ux-guidelines.csv # 99 条 UX 最佳实践
│   ├── icons.csv         # 图标使用指南
│   ├── ui-reasoning.csv  # 智能决策规则（核心推理引擎）
│   ├── stacks/           # 技术栈特定指南
│   │   ├── html-tailwind.csv
│   │   ├── react.csv
│   │   ├── nextjs.csv
│   │   ├── vue.csv
│   │   ├── svelte.csv
│   │   ├── swiftui.csv
│   │   ├── react-native.csv
│   │   ├── flutter.csv
│   │   ├── shadcn.csv
│   │   └── jetpack-compose.csv
│   ├── react-performance.csv
│   └── web-interface.csv
├── scripts/              # 可执行脚本
│   ├── core.py           # BM25 搜索引擎 + 多域搜索
│   ├── design_system.py  # 设计系统生成器 + 持久化层
│   └── search.py         # CLI 入口（命令行接口）
└── README.md             # 额外文档
```

**关键特点**：

- **CSV 驱动**：所有设计知识存储在结构化 CSV 文件中
- **模块化设计**：按领域分离数据
- **技术栈适配**：为不同框架提供专门的实现指南
- **推理引擎**：`ui-reasoning.csv` 提供智能决策规则

---

## 三、作用机制分析

### 核心架构：三层架构

```
用户查询
   ↓
[CLI 层] search.py → 解析参数，路由请求
   ↓
[核心层] core.py → BM25 搜索引擎，多域并行搜索
   ↓
[业务层] design_system.py → 决策推理，设计系统组装
   ↓
输出结果（ASCII 框 / Markdown / 持久化文件）
```

### 1. CLI 层（search.py）

**入口文件**，提供命令行接口：

```bash
# 基本搜索
python3 skills/ui-ux-pro-max/scripts/search.py "fintech dashboard"

# 指定领域
python3 .../search.py "glassmorphism" --domain style

# 生成完整设计系统（核心功能）
python3 .../search.py "beauty spa" --design-system -p "项目名"

# 持久化（Master + Overrides 模式）
python3 .../search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"

# 获取技术栈指南
python3 .../search.py "form validation" --stack react
```

**关键参数**：

- `--design-system`：触发完整设计系统生成
- `--persist`：保存到设计系统文件夹
- `--page`：创建页面特定覆盖文件
- `-f`：输出格式（ascii/markdown）

### 2. 核心层（core.py）—— BM25 搜索引擎

实现了完整的 **BM25 排名算法**（信息检索标准算法，类似 Google 搜索）。

**BM25 核心公式**：

```
score(D,Q) = Σ IDF(q) * (TF(q,D) * (k1+1)) / (TF(q,D) + k1 * (1-b + b * |D|/avgdl))
```

**参数**：k1=1.5（词频饱和度），b=0.75（文档长度归一化）

**搜索流程**：

1. 加载 CSV，将每行数据从多个搜索列拼接成文档
2. 分词、建立倒排索引、计算 IDF
3. 对查询词计算每个文档的 BM25 得分
4. 返回得分 > 0 的前 N 个结果

**领域配置**：每个领域有独立的搜索列和输出列，例如：

- `style`：搜索 5 列，输出 12 列（含 Effects, Performance, Accessibility）
- `ux`：提供 Do/Don't 和代码示例
- `typography`：包含 Google Fonts URL 和 CSS Import

### 3. 业务层（design_system.py）—— 智能决策引擎

#### 3.1 决策推理机制

**核心方法**：`_apply_reasoning(category)`

1. 从 `ui-reasoning.csv` 加载推理规则
2. 根据产品类型匹配最佳规则
3. 提取关键参数：
   - `Recommended_Pattern`：页面结构模式
   - `Style_Priority`：风格优先级列表
   - `Color_Mood` / `Typography_Mood`：色彩/字体情绪
   - `Key_Effects`：关键视觉效果
   - `Anti_Patterns`：应避免的反模式
   - `Decision_Rules`：JSON 格式的决策树

#### 3.2 多域并行搜索

`_multi_domain_search` 同时搜索 5 个关键领域：

1. **product**（1 结果）：确定产品类型
2. **style**（3 结果，带优先级过滤）：基于推理的 style_priority 筛选
3. **color**（2 结果）：调色板
4. **typography**（2 结果）：字体搭配
5. **landing**（2 结果）：页面结构

**风格选择策略**（三级优先级）：

1. 完全匹配 style_priority 中的风格名称
2. 在关键词字段中匹配优先级词汇
3. 在任意字段中匹配，按匹配度评分

#### 3.3 设计系统组装

输出结构化 JSON，包含 pattern、style、colors、typography、effects、anti_patterns 等完整设计系统信息。

#### 3.4 输出格式化

- **ASCII 框**：适合终端显示，带视觉分隔和预交付检查清单
- **Markdown**：适合文档化，包含表格和代码块

### 4. 持久化层：Master + Overrides 模式

这是该技能最先进的设计系统管理方式，支持**分层覆盖**。

#### 文件结构

```
design-system/
├── MASTER.md                      # 全局设计规则（Source of Truth）
└── pages/
    ├── dashboard.md              # Dashboard 页面特定规则
    ├── checkout.md               # Checkout 页面特定规则
    └── landing.md                # Landing 页面特定规则
```

#### 工作流程

1. 使用 `--persist` 创建 MASTER.md
2. 使用 `--page <name>` 创建页面特定覆盖文件
3. 生成代码时，智能检索逻辑优先使用页面覆盖，否则使用 Master

#### Master.md 内容

包含完整的全局设计规则：

- Color Palette（带 CSS 变量）
- Typography（含 Google Fonts URL 和 CSS Import）
- Spacing Variables、Shadow Depths
- Component Specs（Buttons、Cards、Inputs、Modals 的完整 CSS 代码）
- Anti-Patterns
- Pre-Delivery Checklist

#### 页面覆盖文件

只记录**偏离 Master 的规则**，例如：

- Layout Overrides：Max Width、Grid 配置
- Spacing Overrides：内容密度
- Typography Overrides：字体大小调整
- Color Overrides：特定颜色覆盖

**优势**：

- 可维护性：全局规则集中管理
- 可扩展性：新增页面只需创建覆盖文件
- AI 友好：LLM 可以轻松理解并应用分层逻辑

### 5. 智能覆盖生成（`_generate_intelligent_overrides`）

当使用 `--persist --page <name>` 时，系统会自动：

1. 检测页面类型（Dashboard、Checkout、Landing 等）
2. 搜索该页面类型的样式、UX、落地页数据
3. 生成智能的页面特定覆盖建议

这是通过调用核心搜索 API 实现的，而不是硬编码规则。

---

## 四、技术亮点总结

1. **工业级搜索**：完整实现 BM25 算法，支持多域并行搜索和优先级过滤
2. **智能推理**：基于产品类型的决策树，自动匹配最佳设计组合
3. **分层架构**：清晰的三层架构，职责分离，易于扩展
4. **Master + Overrides**：先进的设计系统持久化模式，支持页面特定覆盖
5. **智能覆盖生成**：页面覆盖文件内容基于实时搜索，而非硬编码
6. **丰富的输出**：ASCII 框（终端友好）和 Markdown（文档友好）两种格式
7. **全面的数据**：50+ 风格、97 调色板、57 字体、99 UX 准则、9 技术栈
8. **实用的预交付检查清单**：包含 emoji 图标、cursor-pointer、对比度、focus 状态等常见问题

---

## 五、与其他技能对比

| 技能 | 核心方法 | 数据结构 | 特色 |
|------|---------|---------|------|
| ui-ux-pro-max | BM25 搜索 + 推理引擎 | CSV 数据库（100+ 文件） | Master+Overrides 持久化 |
| skill-creator | 提示词引导 | 纯文本（SKILL.md） | 元技能，用于创建其他技能 |
| web-design-guidelines | 结构化指南 | CSV + 脚本 | 专注于 Web 界面规范 |

ui-ux-pro-max 是目前见过的最复杂、最完善的技能之一，其数据驱动架构和持久化模式值得深入学习。

---

**📄 文档地址**: /Users/admin/Documents/MyProject/agents-space/skills-daily/outputs/2026-02-10_ui-ux-pro-max.md
