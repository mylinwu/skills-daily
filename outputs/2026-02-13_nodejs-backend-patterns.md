# nodejs-backend-patterns 技能分析报告

- 技能链接：https://skills.sh/wshobson/agents/nodejs-backend-patterns
- 分析日期：2026-02-13
- 安装量：943

## 1) 技能用途

这个技能是一套“Node.js 后端工程落地模板 + 约定式最佳实践清单”，适合在你要从 0 到 1 搭建或重构 Node.js 服务端时直接套用。

你可以用它来：

- 快速搭一个可上线的 HTTP 服务骨架：Express/Fastify 初始化、安全中间件、压缩、CORS、请求体解析、日志
- 规范 API 组织方式：路由、控制器、服务、仓储（Repository）分层，避免把业务都写在路由里
- 统一横切能力：认证鉴权、参数校验、限流、日志、错误处理、统一响应格式
- 接入常见基础设施：PostgreSQL 连接池、MongoDB（Mongoose）、Redis 缓存
- 设计生产可用的机制：全局错误处理、避免泄露错误详情、依赖注入（便于测试与替换实现）

典型使用场景：

- 做 REST API / GraphQL 后端、BFF、微服务
- 给已有 Node 服务补齐“工程化能力”（日志、错误、校验、鉴权、限流、缓存）
- 作为团队项目脚手架的参考约定（目录结构与编码规范）

## 2) 目录结构

技能文件（本次下载结果）：

```text
temp/nodejs-backend-patterns/
└── SKILL.md
```

技能推荐的后端项目目录（分层架构示例）：

```text
src/
├── controllers/     # HTTP 入参/出参编排
├── services/        # 业务逻辑
├── repositories/    # 数据访问
├── models/          # 数据模型
├── middleware/      # 中间件（鉴权/校验/限流/日志/错误处理）
├── routes/          # 路由定义
├── utils/           # 工具（错误类/响应封装/缓存等）
├── config/          # 配置（数据库/环境变量等）
└── types/           # TypeScript 类型
```

## 3) 作用机制分析

这个技能本质上不是“可执行脚本”，而是一份高度结构化的工程实践清单，靠“约定 + 可复制代码片段”来驱动你把后端做对、做全。

它的工作方式可以拆成三层：

### A. 框架层：先把生产必需的中间件栈搭起来

它给出 Express 与 Fastify 的基础初始化示例，并强调一上来就把“上线必需品”装上：

- 安全：Helmet（HTTP 安全头）
- 跨域：CORS（生产避免通配）
- 性能：Compression
- 可观测：请求日志（建议结构化日志，如 Pino）
- 可靠性：全局错误处理，避免抛错导致进程崩溃或信息泄露

你可以把它理解为“后端启动模板”，目的是让项目从第一天就具备可上线的默认值，而不是先写业务、最后再补工程化。

### B. 架构层：用分层把复杂度关进笼子

它以 Layered Architecture（Controller/Service/Repository）为核心，把职责切得很清楚：

- Controller：只负责 HTTP 语义（status code、入参提取、调用 service、返回 JSON）
- Service：承载业务规则（校验、编排、事务边界、调用外部依赖）
- Repository：只做数据访问（SQL/ORM/驱动细节），方便替换数据库或写测试

这种拆分的实际收益是：

- 业务可测试：Service 不依赖 Express/Fastify 的 request/response
- 依赖可替换：Repository/Cache/Auth 都能被 mock
- 错误可统一：Service 抛业务错误，外层统一映射成 HTTP 响应

### C. 横切层：把“每个接口都要做的事”统一到中间件/工具

技能覆盖了后端常见横切能力，并给出可直接拷贝的实现骨架：

- 认证鉴权：JWT 校验（authenticate）+ 角色授权（authorize）
- 参数校验：Zod schema + validate 中间件（失败统一转 ValidationError）
- 限流：express-rate-limit + Redis store（支持分布式）
- 错误体系：自定义错误类（AppError、ValidationError、NotFoundError 等）+ 全局 error handler
- 响应规范：ApiResponse.success/error/paginated 统一输出结构
- 缓存：Redis get/set + 简易 Cacheable 装饰器（把“查缓存/回源/写缓存”模板化）

它隐含的“落地顺序”通常是：

1. 先定义错误类型与 error handler（否则后面每个模块都要自己处理错误）
2. 再加 validate / authenticate / logger / limiter 等中间件（把横切能力前置）
3. 最后按分层架构写业务（Controller 调 Service，Service 调 Repository/Cache）

### 如何把这个技能用成“可复用的团队模板”

建议把技能内容沉淀成项目约定（而不是每次临时翻 SKILL.md）：

- 固化目录结构与命名（controllers/services/repositories/middleware/utils/config）
- 固化错误与响应格式（所有接口都走同一套 error handler + ApiResponse）
- 固化中间件顺序（安全 → 解析 → 日志 → 路由 → 错误处理）
- 固化依赖注入入口（集中注册 db、repo、service、controller，便于测试）



---

文档地址: https://github.com/mylinwu/skills-daily/tree/main/outputs/2026-02-13_nodejs-backend-patterns.md