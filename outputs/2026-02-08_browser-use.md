# browser-use 技能分析报告

> 分析日期：2026-02-08  
> 来源：<https://skills.sh/browser-use/browser-use/browser-use>  
> 安装量：2495

---

## 1. 技能用途

**browser-use** 是一个浏览器自动化技能，主要用途包括：

### 核心功能

- **网页导航**：打开网页、前进后退、滚动页面
- **表单操作**：填写表单、点击按钮、选择下拉选项
- **数据提取**：获取页面文本、HTML、元素属性
- **截图功能**：页面截图、全页截图、元素截图
- **Cookie 管理**：导入导出、设置清除、跨域同步
- **自动化工作流**：基于 AI Agent 的复杂任务自动执行

### 典型使用场景

1. **Web 测试**：自动化功能测试、回归测试
2. **数据采集**：抓取网页信息、价格监控
3. **表单自动化**：批量填写表单、自动提交
4. **登录状态管理**：复用浏览器 Cookie 保持登录态
5. **云端浏览器**：通过 API 调用远程浏览器

---

## 2. 目录结构

```
temp/browser-use/
└── SKILL.md          # 技能文档（14.7 KB）
```

技能采用单文件模式，所有文档集中在一个 Markdown 文件中。

---

## 3. 作用机制分析

### 3.1 技术架构

该技能基于 **browser-use CLI** 工具，提供三种浏览器模式：

| 模式 | 说明 | 特点 |
|------|------|------|
| `chromium` | 内置 Chromium | 快速、隔离、默认无头模式 |
| `real` | 用户本地 Chrome | 保留登录态、Cookie、扩展 |
| `remote` | 云端浏览器 | 需要 API Key、支持代理 |

### 3.2 核心工作流

技能采用**索引驱动**的交互模式：

```
open URL → state (获取元素索引列表) → 通过索引执行交互 (click/input/type) → 验证结果
```

关键命令流程：

1. `browser-use open <url>` - 启动浏览器并导航
2. `browser-use state` - 返回可交互元素及其索引
3. 使用索引执行操作：`click <index>` / `input <index> "text"`
4. `screenshot` / `state` 验证结果

### 3.3 会话持久化机制

- **默认会话**：所有命令共享 `default` 会话，浏览器保持打开状态
- **命名会话**：通过 `--session NAME` 支持多浏览器并行
- **Python 状态**：`browser-use python` 命令的变量在会话内持久化

### 3.4 Cookie 同步策略

技能设计了**三级 Cookie 同步控制**：

1. **域名级同步**（推荐）：`--domain youtube.com`，仅同步特定站点
2. **完整配置同步**：同步整个 Chrome Profile（需谨慎）
3. **细粒度控制**：导出 JSON 编辑后导入

**安全要求**：同步前必须询问用户选择 Profile 和指定域名，禁止默认全量同步。

### 3.5 AI Agent 功能

- `browser-use run "任务描述"` - 使用 LLM 自主完成复杂任务
- `browser-use extract "提取需求"` - 基于 LLM 智能提取页面数据
- 需要配置 `BROWSER_USE_API_KEY` 或其他 LLM API Key

### 3.6 CLI 别名设计

提供三个等效命令别名提升易用性：

- `bu`
- `browser`
- `browseruse`

---

## 4. 关键设计亮点

1. **索引化交互**：通过 `state` 命令生成元素索引，避免复杂的 CSS 选择器
2. **多模式浏览器**：支持从快速无头到真实 Chrome 的灵活切换
3. **云状态同步**：支持将本地 Cookie 同步到云端 Profile 供远程使用
4. **Python 脚本支持**：可在持久化会话中执行 Python 操作浏览器对象
5. **严格安全流程**：Cookie 同步前强制用户确认，默认按域名隔离

---

## 5. 使用限制

- AI Agent 功能需要 API Key
- 远程浏览器模式需要配置 `BROWSER_USE_API_KEY`
- 真实浏览器模式需要预先安装 Chrome


---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-08_browser-use.md