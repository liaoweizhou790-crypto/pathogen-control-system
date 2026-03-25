# TOOLS.md - Tool Configuration & Notes

> Document tool-specific configurations, gotchas, and credentials here.

---

## Obsidian 知识库位置

**CDC库路径：** `/Users/liaoweizhou/Desktop/Obsidian-CDC库`

---

## Credentials Location

All credentials stored in `.credentials/` (gitignored):
- `example-api.txt` — Example API key

---

## [Tool Name]

**Status:** ✅ Working | ⚠️ Issues | ❌ Not configured

**Configuration:**
```
Key details about how this tool is configured
```

**Gotchas:**
- Things that don't work as expected
- Workarounds discovered

**Common Operations:**
```bash
# Example command
tool-name --common-flag
```

---

## Android APK Build Workflow

**Status:** ✅ GitHub Actions自动构建

**仓库地址:** https://github.com/liaoweizhou790-crypto/disinfectant-calc

**自动构建触发:**
- 每次推送到 main 分支
- 手动触发 workflow_dispatch

**Artifact命名规范:**
- 使用 ASCII 字符（英文），避免中文下载问题
- 格式: `CDC-Disinfectant-V{版本号}`

**APK下载方法:**
```bash
# 查看最新构建状态
gh run list --repo liaoweizhou790-crypto/disinfectant-calc

# 下载最新APK (替换 RUN_ID)
gh run download RUN_ID --repo liaoweizhou790-crypto/disinfectant-calc --name "CDC-Disinfectant-V1.5.0"
```

**已知问题:**
- Artifact名称含中文字符时，GitHub API下载会返回400错误
- 解决方案：使用英文artifact名称

**文件位置:**
- 构建配置: `.github/workflows/build.yml`
- 输出APK: `app-release-unsigned.apk` (下载后需重命名)

---

## Writing Preferences

[Document any preferences about writing style, voice, etc.]

---

## What Goes Here

- Tool configurations and settings
- Credential locations (not the credentials themselves!)
- Gotchas and workarounds discovered
- Common commands and patterns
- Integration notes

## Why Separate?

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

## 布雷图指数（Breteau Index, BI）风险等级标准

> ⚠️ 重要：以下为标准定义，必须严格遵守

| 布雷图指数范围 | 风险等级描述 | 防控措施建议 |
|:---:|:---|:---|
| **BI < 5** | 控制登革热传播的阈值 | 维持在当前水平，继续常规监测 |
| **5 ≤ BI < 10** | 有传播风险 | 加强监测频次，开展爱国卫生运动 |
| **10 ≤ BI < 20** | 有聚集性疫情风险 | 紧急消杀，清除积水，健康宣教 |
| **BI ≥ 20** | 有局部暴发风险 | 立即启动应急响应，全面灭蚊，病例搜索 |

**计算公式：**
```
布雷图指数(BI) = (阳性容器数 / 监测户数) × 100
```

**参考标准来源：** WHO登革热防控指南 / 中国疾病预防控制中心登革热监测方案

---

*Add whatever helps you do your job. This is your cheat sheet.*
