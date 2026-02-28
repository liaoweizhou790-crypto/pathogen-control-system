# 柳州市疾病预防控制中心病原微生物防控系统 v1.5.0

> 原名：消毒剂配比计算器

## 安装说明

### 方法一：PWA安装（推荐）

#### iPhone/iPad (Safari)
1. 用 Safari 打开本网页
2. 点击底部分享按钮 ⬆️
3. 选择"添加到主屏幕"
4. 点击"添加"
5. 主屏幕上会出现 APP 图标，可直接使用

#### Android (Chrome)
1. 用 Chrome 浏览器打开本网页
2. 点击右上角菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"
4. 点击"安装"
5. 主屏幕上会出现 APP 图标

#### 电脑 (Chrome/Edge)
1. 用 Chrome 或 Edge 浏览器打开
2. 地址栏右侧会出现"安装"图标 ➕
3. 点击"安装"
4. 可以像普通软件一样从开始菜单启动

### 方法二：Android APK安装

1. 将 `app-release.apk` 文件传输到安卓手机
2. 在手机上打开 APK 文件
3. 如果提示"未知来源"，请允许安装
4. 安装完成后即可使用

## 功能特点

- ✅ 离线使用（安装后无需网络）
- ✅ 双模式计算（稀释倍数/配制量）
- ✅ 40种法定传染病消毒方案
- ✅ 自动配比记录
- ✅ 常用方案保存
- ✅ 数据本地存储

## 技术信息

- 版本：v1.5.0
- 作者：廖维洲
- 单位：柳州市疾病预防控制中心消毒与病媒生物防制所
- 版权：未经许可不得修改或商用
- GitHub：https://github.com/liaoweizhou790-crypto/pathogen-control-system

## 问题反馈

如有问题或建议，请联系：
柳州市疾病预防控制中心消毒与病媒生物防制所

---

## 开发者说明

### 打包 APK 步骤

需要安装 Node.js 和 Android Studio

```bash
# 1. 安装依赖
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. 添加安卓平台
npx cap add android

# 3. 同步代码
npx cap sync

# 4. 打开 Android Studio
npx cap open android

# 5. 在 Android Studio 中构建 APK
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

生成的 APK 路径：`android/app/build/outputs/apk/release/app-release.apk`

---

## 版本更新记录

### v1.5.0 (2026-02-28)
- 项目名称更新为"柳州市疾病预防控制中心病原微生物防控系统"
- GitHub仓库迁移至 pathogen-control-system
- 更新文档，统一版本号
- 支持Agent-Reach互联网搜索功能
- 系统稳定性优化

### v1.3.1 (2026-02-15)
- 技术文件支持直接打开功能
- 下载后可直接打开文件
- 优化文件管理界面

### v1.3.0 (2026-02-15)
- 符合GB19193-2025《传染病消毒规范》标准
- 尸体消毒浓度调整：5000-10000mg/L
- 增加消毒原则说明

### v1.0.0 (2026-02-14)
- 初版发布
- 配比计算功能
- 消毒剂数据库
- 传染病消毒方案
