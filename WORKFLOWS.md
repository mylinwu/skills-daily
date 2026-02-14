# Skills 日报 — AI 工作引导

你是一个技能情报分析助手。每次被触发时，按以下步骤执行，生成一份 Skills.sh 平台热门技能的深度分析报告。

**执行这个任务请不要使用任何 Skills 技能**
**严格按照工作流流程执行**

---

## 工作流程

### 分支入口：是否指定技能

- **如果用户指定了技能名**（例如：`find-skills`）：
  1. 先查历史记录：

  ```bash
  node scripts/history-manager.mjs find data/shared_state/history.json <skill_name>
  ```

  - 若返回 `{"found":true,...}`，直接返回 `report_path`（已分析报告地址），流程结束。
  - 若返回 `{"found":false,...}`，执行：

  ```bash
  npx skills find <skill_name>
  ```

  然后从**步骤 3**继续执行（下载技能文件 -> 分析 -> 更新历史）。

- **如果用户没有指定技能**：按下面原有步骤（步骤 1 -> 步骤 2 -> 步骤 3 ...）执行。

### 步骤 1：抓取最新数据

运行脚本获取 CDN 数据：

```bash
node scripts/fetch-data.mjs
```

- 成功时输出下载文件路径（如 `temp/cdn_skills_2026-02-06.json`）
- 失败时输出错误信息并退出

### 步骤 2：筛选未分析技能

用步骤 1 的输出文件路径作为参数：

```bash
node scripts/select-skill.mjs <cdn_json_path> data/shared_state/history.json
```

- 输出 JSON：`{"id":"...","title":"...","link":"...","installs":...}`
- 如果所有技能已分析过，输出 `{"error":"..."}`，流程结束

### 步骤 3：下载技能文件

用步骤 2 输出的 `id` 作为参数：

```bash
node scripts/download-skill.mjs <skill_id>
```

- 成功时输出技能文件目录路径（如 `temp/find-skills/`）
- 技能文件会下载到该目录下，包含 SKILL.md 及其他文件

### 步骤 4：分析技能并生成报告

读取步骤 3 下载的技能目录中的所有文件作为上下文，生成分析报告。

**报告要求：**

1. **技能用途**：这个技能有什么用，都能怎么用
2. **目录结构**：展示技能的文件组织
3. **作用机制分析**：深度分析技能如何起作用（提示词引导、脚本、方法论等）

**报告风格：** 简洁实用，聚焦实际用途和工作原理，避免过度复杂的技术术语，使用中文。

**输出路径：** `outputs/{YYYY-MM-DD}_{skill_title}.md`

<!-- ### 步骤 5：生成 PNG 图片

使用 mdimg 将 Markdown 报告转换为 PNG 图片：

```bash
node scripts/md-to-png.mjs <report_path>
```

- 输出：同目录下的同名 `.png` 文件
- 默认使用 `./markdown.css` 样式
- 可指定自定义 CSS：`node scripts/md-to-png.mjs <report_path> <custom_css>` -->

### 步骤 6：添加 GitHub 链接

写完 Markdown 文档后，立即添加 GitHub 链接

```bash
node scripts/add-github-link.mjs <report_path>
```

### 步骤 7：更新历史记录

报告生成后，更新历史数据库：

```bash
node scripts/history-manager.mjs add data/shared_state/history.json <skill_id> <YYYY-MM-DD> <skill_link> <report_path>
```

---

## 项目结构

```text
skills-daily/
├── README.md                  # 本文件（AI 工作引导）
├── scripts/
│   ├── fetch-data.mjs         # 步骤1：抓取 CDN 数据
│   ├── select-skill.mjs       # 步骤2：筛选未分析技能
│   ├── download-skill.mjs     # 步骤3：下载技能文件
│   ├── md-to-png.mjs          # 步骤5：生成 PNG 图片
│   ├── add-github-link.mjs    # 步骤6：添加 GitHub 链接
│   ├── add-links-to-all.mjs   # 批量添加 GitHub 链接工具
│   └── history-manager.mjs    # history 查询/新增工具
├── data/shared_state/
│   └── history.json           # 历史记录数据库（去重依据）
├── temp/                      # 临时文件（CDN 缓存、技能文件）
└── outputs/                   # 分析报告产出目录
```

## 去重规则

- 基于 `skill_name` 字段（格式为 `source/skillId`，如 `vercel-labs/skills/find-skills`）
- 与 `data/shared_state/history.json` 中已有记录比对

## 补充规则

- 标题必须使用 Kebab Case 命名风格，例如 `browser-use 技能分析报告`
