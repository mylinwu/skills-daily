# referral-program 技能分析报告

- 技能 ID：`coreyhaines31/marketingskills/referral-program`
- 技能链接：https://skills.sh/coreyhaines31/marketingskills/referral-program
- 安装量：871
- 分析日期：2026-02-13

## 1. 技能用途

`referral-program` 是一个用于**设计、优化、诊断推荐裂变与联盟分销体系**的营销技能，覆盖从策略到落地的完整链路。

它主要解决三类问题：

1. **从 0 到 1 设计推荐计划**
   - 明确是客户推荐（Referral）还是联盟分销（Affiliate），或两者并行
   - 设计激励结构（单边、双边、阶梯奖励）
   - 规划触发时机（Aha 时刻、里程碑后、升级后）

2. **提升已有计划效果**
   - 当“用户不愿分享”时，优化入口位置、分享阻力和奖励类型
   - 当“被推荐人不转化”时，优化落地页体验和首单激励
   - 通过 A/B 测试系统优化激励金额、文案、入口位置

3. **建立可持续增长机制**
   - 用关键指标衡量项目健康度（推荐率、转化率、ROI）
   - 引入防作弊策略（邮箱验证、设备/IP 监控、延迟发奖）
   - 在 B2B/B2C、订阅/电商等不同模式下选择对应工具与佣金方案

---

## 2. 目录结构

```text
referral-program/
├── SKILL.md
└── references/
    ├── affiliate-programs.md
    └── program-examples.md
```

文件分工：

- `SKILL.md`：主流程与决策框架（何时提问、如何设计、如何优化、如何衡量）
- `references/affiliate-programs.md`：联盟分销专项（佣金模型、Cookie 周期、招募与赋能、工具选型、防作弊）
- `references/program-examples.md`：经典案例与量化模型（Dropbox、Uber、Morning Brew 等）

---

## 3. 作用机制分析

这个技能的核心机制可以概括为：**“先校准业务上下文 → 再选择增长模型 → 最后用指标闭环持续迭代”**。

### 3.1 上下文优先：先问对问题，再给方案

技能在开头强制收集关键信息（项目类型、LTV/CAC、现状、可分享性、预算），并优先读取 `.claude/product-marketing-context.md`，避免重复提问。

这让输出不止是“通用建议”，而是能贴合：
- 当前商业模式（B2B/B2C）
- 单客经济模型（LTV 与 CAC）
- 团队资源约束（预算、工具栈）

### 3.2 双模型框架：Referral 与 Affiliate 分层处理

技能明确区分两类增长通道：

- **Referral（客户推荐）**：强调信任与产品内触发，适合自然口碑传播
- **Affiliate（联盟分销）**：强调规模与渠道扩展，适合内容创作者/合作伙伴体系

这种分层避免了常见误区：把“客户推荐奖励”与“联盟佣金计划”混为一谈，导致激励和归因失真。

### 3.3 漏斗化设计：围绕 Referral Loop 拆解执行动作

主文件给出推荐闭环：

`Trigger Moment → Share Action → Convert Referred → Reward → Loop`

并在每个节点提供可执行动作：
- 触发：优先选高意图时刻（里程碑、升级后）
- 分享：优先低摩擦渠道（产品内分享、个性化链接）
- 转化：优化被推荐用户落地页与首单激励
- 奖励：根据场景选择单边/双边/阶梯方案

这本质上是把“裂变”从一个活动，变成一个可优化的长期系统。

### 3.4 指标驱动：从“感觉有效”转为“可量化复盘”

技能内置了完整指标体系：

- 项目健康：活跃推荐人、推荐转化率、奖励发放
- 业务价值：推荐客占比、推荐 CAC、推荐用户 LTV、ROI
- 传播效率：K-factor（邀请量 × 转化率）

并提供奖励上限估算公式：

`Max Referral Reward = (Customer LTV × Gross Margin) - Target CAC`

这使策略设计与财务约束打通，避免“奖励发得多但不赚钱”。

### 3.5 参考库机制：用案例与模板缩短落地路径

两个 `references` 文件承担“加速器”角色：

- **案例库**：给出 Dropbox、Uber、Morning Brew 等可复用机制
- **参数库**：佣金比例、Cookie 周期、行业常见区间
- **模板库**：联盟招募邮件、执行清单、反作弊清单

因此这个技能不仅能回答“该做什么”，也能快速回答“具体怎么做、先做哪一步”。

---

## 总结

`referral-program` 是一个偏“实战型增长操作系统”的技能：

- 用结构化问题把业务背景补齐
- 用 Referral/Affiliate 双框架做策略分流
- 用闭环漏斗和指标体系持续优化
- 用案例与模板把方案变成可执行动作

对于希望降低获客成本、提升自然增长占比的团队，这个技能价值在于：**把推荐增长从一次性活动，升级为可测量、可迭代、可规模化的长期机制**。


---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-13_referral-program.md