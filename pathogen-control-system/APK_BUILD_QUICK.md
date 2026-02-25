# APK 快速构建方案

由于当前机器缺少Java环境，提供以下**三种方案**构建APK：

---

## 方案A：GitHub Actions 自动构建（推荐，最简单）

### 步骤：
1. 将 `消毒剂配比系统` 文件夹上传到 GitHub 仓库
2. 已配置 `.github/workflows/build.yml`，会自动构建APK
3. 每次推送代码或手动触发，GitHub会自动生成APK
4. 在 Actions 页面下载构建好的APK

**优点**：免费、无需配置环境、每次更新自动构建

---

## 方案B：本地构建（需要安装Java）

### 1. 安装Java（选择其一）

**macOS - Homebrew：**
```bash
brew install openjdk@17
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk' >> ~/.zshrc
source ~/.zshrc
```

**macOS - 手动下载：**
1. 访问 https://adoptium.net/
2. 下载 OpenJDK 17 LTS for macOS (pkg安装包)
3. 双击安装

**Windows：**
1. 下载：https://adoptium.net/
2. 安装并设置 JAVA_HOME 环境变量

### 2. 构建APK
```bash
cd ~/Desktop/消毒剂配比系统
./auto-build.sh
```

---

## 方案C：使用在线构建服务

### 1. Capacitor Cloud（推荐）
- 访问 https://ionic.io/appflow
- 免费注册，上传项目
- 云端构建APK，无需本地环境

### 2. Android Studio + 模拟器
- 安装 Android Studio
- 导入 `android` 文件夹
- Build → Build APK

---

## 📱 APK安装指南

构建完成后：

1. **传输到手机**：微信、QQ、数据线、邮件
2. **打开APK文件**：在文件管理器中找到APK
3. **允许安装**：设置 → 安全 → 允许未知来源
4. **完成安装**：点击安装即可

---

## ✅ 推荐流程

**开发者（您）：**
1. 使用 GitHub Actions 自动构建
2. 下载构建好的APK文件
3. 分发给使用者

**使用者：**
1. 下载APK文件
2. 在安卓手机上安装
3. 像普通APP一样使用

---

## 技术支持

如有问题，请联系：
- 单位：柳州市疾病预防控制中心消毒与病媒生物防制所
- 作者：廖维洲

---

**当前状态：** 项目已配置完成，等待构建环境就绪即可生成APK。
