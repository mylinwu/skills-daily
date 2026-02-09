# agent-browser 技能分析报告

> **来源**: [inferencesh/skills/agent-browser](https://skills.sh/inferencesh/skills/agent-browser)
> **安装量**: 1,589
> **日期**: 2026-02-09

---

## 一、技能用途

agent-browser 是一个基于 [inference.sh](https://inference.sh) 平台的浏览器自动化技能，底层使用 Playwright，让 AI Agent 能够像人一样操控浏览器。

### 核心能力

- **网页导航与浏览** — 打开任意 URL，获取页面元素列表
- **表单交互** — 填写输入框、勾选复选框、选择下拉菜单、提交表单
- **点击与拖拽** — 单击/双击元素、拖放操作
- **文件上传** — 向文件输入框上传本地文件
- **截图与录屏** — 截取页面快照（支持全页）、录制整个操作过程为视频
- **JavaScript 执行** — 在页面上下文中运行任意 JS 代码
- **代理支持** — 通过 HTTP 代理访问网页，适合地理位置测试

### 典型使用场景

1. **网页数据抓取** — 打开目标页面，提取结构化内容
2. **自动化表单填写** — 登录、注册、提交联系表单等
3. **端到端测试** — 模拟用户操作流程并截图验证
4. **研究与信息收集** — Agent 自主浏览网页、搜索并汇总信息
5. **操作录屏** — 录制浏览器操作视频用于文档或调试

---

## 二、目录结构

```
agent-browser/
├── SKILL.md              # 技能主文件（提示词 + 文档）
├── references/           # 深度参考文档（空目录，引用外部链接）
│   ├── commands.md           # 完整函数参考
│   ├── snapshot-refs.md      # Ref 生命周期与失效规则
│   ├── session-management.md # 会话管理
│   ├── authentication.md     # 登录与认证流程
│   ├── video-recording.md    # 录屏工作流
│   └── proxy-support.md      # 代理配置
└── templates/            # 即用模板（空目录，引用外部链接）
    ├── form-automation.sh        # 表单自动化
    ├── authenticated-session.sh  # 认证会话复用
    └── capture-workflow.sh       # 内容提取 + 截图
```

> 注：下载的技能包中 `references/` 和 `templates/` 为空目录，实际内容通过 SKILL.md 中的文档链接引用。

---

## 三、作用机制分析

### 3.1 整体架构

该技能的核心设计是一个 **"提示词即接口"** 模式：SKILL.md 本身就是一份完整的操作手册，AI Agent 读取后即可理解如何调用 `infsh` CLI 来控制浏览器。

```
AI Agent ──读取──> SKILL.md（提示词/文档）
    │
    └──调用──> infsh CLI ──> inference.sh 云端服务 ──> Playwright 浏览器实例
```

### 3.2 @e 引用系统（核心机制）

这是该技能最关键的设计。每次打开页面或执行 snapshot 时，页面上的可交互元素会被编号为 `@e1`、`@e2`、`@e3`... 的引用标识：

```
@e1 [a] "Home" href="/"
@e2 [input type="text"] placeholder="Search"
@e3 [button] "Submit"
```

Agent 通过这些简短的引用来操作元素，而不需要写 CSS 选择器或 XPath。这大幅降低了 AI 理解和操作网页的难度。

**关键规则**：页面导航后引用会失效，必须重新 snapshot 获取新的引用。

### 3.3 会话（Session）管理

采用有状态会话模式：

1. **创建会话** — `--session new` 启动新浏览器实例，返回 `session_id`
2. **复用会话** — 后续调用传入 `session_id`，保持 Cookie、登录状态等
3. **关闭会话** — 调用 `close` 释放资源，如有录屏则返回视频文件

这让 Agent 可以跨多步操作保持浏览器状态，比如先登录再执行后续操作。

### 3.4 六大函数接口

| 函数 | 作用 | 核心参数 |
|------|------|----------|
| `open` | 打开 URL，初始化浏览器 | `url`, `record_video`, `proxy_url` |
| `snapshot` | 重新获取页面元素引用 | 无 |
| `interact` | 执行交互动作 | `action`, `ref`, `text` 等 |
| `screenshot` | 截图 | `full_page` |
| `execute` | 执行 JavaScript | `code` |
| `close` | 关闭会话 | 无 |

### 3.5 提示词引导策略

SKILL.md 的提示词设计有几个巧妙之处：

- **触发词列表** — 在 frontmatter 中定义了 `browser`, `web automation`, `scrape`, `navigate` 等关键词，确保 Agent 在用户提到相关需求时自动激活该技能
- **工具白名单** — `allowed-tools: Bash(infsh *)` 限制只允许调用 `infsh` 开头的命令，防止 Agent 执行危险操作
- **工作流模板化** — 通过 "Open → Interact → Re-snapshot → Close" 四步标准流程，让 Agent 形成固定的操作模式
- **丰富示例** — 提供表单提交、搜索提取、截图录屏等完整示例，Agent 可以直接模仿

### 3.6 与其他技能的协作

文档推荐搭配使用：

- **web-search** — 先搜索再浏览具体页面
- **llm-models** — 对提取的网页内容进行 AI 分析

---

## 总结

agent-browser 是一个设计精良的浏览器自动化技能，其核心创新在于 **@e 引用系统**——将复杂的 DOM 元素定位简化为简短编号，让 AI Agent 无需理解 HTML 结构即可操作网页。通过 inference.sh 的云端 Playwright 实例，Agent 获得了完整的浏览器能力，同时 `allowed-tools` 机制确保了安全边界。整体是一个"提示词驱动 + CLI 调用"的典型 Skills 架构。


---

**📄 文档地址**: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-09_agent-browser.md