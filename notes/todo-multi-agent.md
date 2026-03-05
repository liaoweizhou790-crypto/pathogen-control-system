# 待办事项：多代理路由配置

> 创建时间：2026-02-19
> 更新时间：2026-02-25
> 优先级：高

---

## 当前状态
- ✅ 7 个 Agent 已配置（main, data_analyst, system_dev, doc_expert, data-assistant, cdc, dev）
- ✅ 飞书渠道路由到 cdc Agent
- ✅ 消毒剂计算器项目已迁移到 cdc 工作空间
- ✅ Dev Agent 已创建并配置完成

---

## 待办清单

### ✅ 已完成
- [x] 1. 创建 `cdc` Agent（疾控业务）
  - 工作空间：`~/.openclaw/workspace-cdc`
  - 已配置 `SOUL.md`, `USER.md`, `AGENTS.md`
  
- [x] 2. 配置 `~/.openclaw/openclaw.json` 多代理路由
  - cdc → feishu（飞书渠道）
  
- [x] 3. Gateway 配置已更新（重启后生效）

- [x] 4. 创建 `dev` Agent（开发工作）✅ 2026-02-25
  - 工作空间：`~/.openclaw/workspace-dev`
  - 已配置 `SOUL.md`, `USER.md`, `AGENTS.md`
  - 已配置 `auth-profiles.json`
  - 已添加到 `openclaw.json`

- [x] 5. 迁移消毒剂计算器项目到 cdc Agent 工作空间 ✅ 2026-02-25
  - 位置：`~/.openclaw/workspace-cdc/projects/disinfectant-calc`
  - 包含完整项目文件和 GitHub Actions 配置

- [x] 6. 配置验证 ✅ 2026-02-25
  - `openclaw.json` 语法验证通过
  - 7 个 Agent 全部配置完成
  - Agent 间通信已启用（7 个 Agent 互相允许）

### 🟡 待完成
- [ ] 7. Telegram 渠道配置（需外部渠道配置）
  - Dev Agent 已准备就绪
  - 需通过 Telegram BotFather 创建 bot 后配置
  
- [ ] 8. 群组 @提及切换规则

- [ ] 9. Agent 间通信深度测试（需运行时代码）

---

## 配置详情

### 已配置的 7 个 Agent

| Agent ID | 名称 | 工作空间 | 状态 |
|----------|------|----------|------|
| **main** | 主助手 | `~/.openclaw/workspace` | ✅ 默认 Agent |
| **data_analyst** | 数据分析专家 | `~/.openclaw/workspace-data` | ✅ 已配置 |
| **system_dev** | 系统开发专家 | `~/.openclaw/workspace-dev` | ✅ 已配置 |
| **doc_expert** | 文书专家 | `~/.openclaw/workspace-doc` | ✅ 已配置 |
| **data-assistant** | 资料整理助手 | `~/.openclaw/workspace-data-assistant` | ✅ 已配置 |
| **cdc** | 疾控业务专家 | `~/.openclaw/workspace-cdc` | ✅ 已配置 |
| **dev** | 开发专家 | `~/.openclaw/workspace-dev` | ✅ 已配置 |

### cdc Agent 配置
- **ID:** `cdc`
- **名称:** 疾控业务专家
- **工作空间:** `~/.openclaw/workspace-cdc`
- **已授权工具:** 文件操作、飞书文档/多维表格/云盘等
- **路由:** 飞书渠道消息自动路由到 cdc Agent

### dev Agent 配置 ✅ 新增
- **ID:** `dev`
- **名称:** 开发专家
- **工作空间:** `~/.openclaw/workspace-dev`
- **已授权工具:** read, write, edit, exec, sessions_spawn, web_search, web_fetch, memory_search
- **用途:** 软件开发、代码编写、技术问题解决

---

## 项目迁移详情

### 消毒剂计算器项目 ✅ 已迁移
- **原位置:** `~/.openclaw/workspace/disinfectant-calc`
- **新位置:** `~/.openclaw/workspace-cdc/projects/disinfectant-calc`
- **包含文件:**
  - index.html (主程序)
  - android/ (Android 项目)
  - .github/workflows/ (GitHub Actions)
  - README.md, 构建指南等

---

## 快速命令备忘

```bash
# 查看所有 Agent
openclaw agents list --bindings

# 连接到指定 Agent 的 TUI
openclaw tui --agent cdc
openclaw tui --agent dev

# 验证配置
openclaw gateway config.get
```

---

## 配置文件位置

- 主配置: `~/.openclaw/openclaw.json`
- cdc Agent: `~/.openclaw/workspace-cdc/`
- dev Agent: `~/.openclaw/workspace-dev/`

---

## 测试记录

### 2026-02-25 测试结果 ✅

| 测试项 | 状态 | 说明 |
|--------|------|------|
| openclaw.json 语法验证 | ✅ 通过 | Python json 解析成功 |
| 7 个 Agent 配置检查 | ✅ 通过 | 全部配置完整 |
| dev Agent 文件检查 | ✅ 通过 | SOUL.md, USER.md, AGENTS.md, auth-profiles.json |
| 项目迁移验证 | ✅ 通过 | disinfectant-calc 已复制到 cdc/projects/ |
| 飞书路由配置 | ✅ 通过 | cdc Agent 绑定到飞书渠道 |
| Agent 间通信配置 | ✅ 通过 | 7 个 Agent 互相允许通信 |

### 待测试项 ⏳
- [ ] Telegram 渠道（需配置 bot）
- [ ] Agent 间实时通信（需运行时代码支持）
- [ ] 飞书消息路由测试（需发送实际消息）

---

## 下一步建议

1. **如需启用 Telegram:**
   - 通过 @BotFather 创建 Telegram Bot
   - 获取 Bot Token
   - 添加到 `openclaw.json` channels.telegram 配置

2. **如需测试 Agent 间通信:**
   - 使用 `sessions_spawn` 功能（需确保 agent 允许）
   - 或通过 gateway API 直接调用

3. **如需重启 Gateway:**
   - 使用 `openclaw gateway restart` 或手动重启服务
