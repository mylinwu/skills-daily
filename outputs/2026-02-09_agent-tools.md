# agent-tools 技能分析报告

## 技能用途

agent-tools 基于 inference.sh CLI，提供对 150+ AI 应用的统一调用能力，覆盖图像/视频生成、LLM 调用、搜索与社媒自动化等场景。适合以下用途：

- **图像生成**：通过 FLUX、Gemini、Grok 等模型生成图片。
- **视频生成**：调用 Veo、Seedance、OmniHuman 等模型快速生成视频或虚拟人内容。
- **LLM 调用**：直接调用 Claude、Gemini、Kimi、GLM 及 OpenRouter 上的任意模型。
- **搜索与情报**：一键接入 Tavily/Exa 搜索或抽取。
- **社媒自动化**：自动发推、点赞、关注、私信等 X/Twitter 自动化流程。
- **3D/工具链**：生成 3D 模型、媒体合成、音频转录、字幕生成等。

典型使用流程是：安装 CLI → 登录/配置 API Key → 发现应用 → 生成输入 → 运行应用 → 查询任务结果。

## 目录结构

```text
agent-tools/
├── SKILL.md
└── references/
    ├── app-discovery.md
    ├── authentication.md
    ├── cli-reference.md
    └── running-apps.md
```

## 作用机制分析

1. **统一入口与触发**
   - 通过 `infsh` 命令行作为唯一入口，将「选择模型 + 输入参数 + 运行任务」统一封装。
   - 触发词覆盖 AI 场景高频关键词（如 image generation、video generation、claude api 等），确保在对话或任务规划中能被快速匹配。

2. **鉴权与凭据策略**
   - 支持浏览器登录（`infsh login`）与 API Key 环境变量（`INFSH_API_KEY`）两种模式。
   - 环境变量优先级高于本地配置，适合 CI/CD 或脚本化调用，确保自动化流程稳定可复现。

3. **发现与选择应用**
   - `infsh app list/search` 作为发现入口，支持按分类、关键词、分页、featured/new 排序。
   - `infsh app get` 获取应用详情及输入输出结构，降低参数配置的试错成本。

4. **输入生成与运行机制**
   - `infsh app sample` 自动生成输入模板，用户只需编辑 JSON 即可运行。
   - 运行支持两种模式：
     - **同步执行**：直接返回结果（适合短任务）。
     - **异步执行**：`--no-wait` 提交后返回任务 ID，再用 `infsh task get` 拉取结果（适合长任务）。
   - 输出为结构化 JSON，图片/视频/音频会返回 URL，便于后续下载或串联流程。

5. **任务跟踪与错误处理**
   - 使用 task ID 进行进度查询与结果拉取，支撑批量与异步工作流。
   - 常见错误可通过 `app get` 校验参数、`app list --search` 校验名称、或检查账号配额快速定位。

6. **适用的工作流组合方式**
   - 先通过 `app list/search` 选择模型 → `app sample` 生成输入 → `app run` 执行 → `task get` 获取结果。
   - 可将输出 URL 接入后续处理（如媒体合成、社媒发布），形成端到端自动化链路。

整体上，这个技能的核心价值是**把大量 AI 能力整合为统一的 CLI 运行接口**，用「发现 → 样例 → 运行 → 任务追踪」的标准化流程降低多模型接入成本，适合构建自动化、批量化 AI 工作流。


---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-09_agent-tools.md