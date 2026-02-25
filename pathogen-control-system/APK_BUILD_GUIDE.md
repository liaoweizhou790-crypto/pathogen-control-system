# Android APK 构建指南

## 前置要求

构建 Android APK 需要以下软件：

### 1. 安装 Node.js
- 下载地址：https://nodejs.org/
- 建议安装 LTS（长期支持）版本
- 安装完成后验证：`node -v` 和 `npm -v`

### 2. 安装 Java JDK
- 下载地址：https://www.oracle.com/java/technologies/downloads/
- 或安装 OpenJDK：https://adoptium.net/
- 需要 JDK 11 或更高版本
- 安装完成后验证：`java -version`

### 3. 安装 Android Studio
- 下载地址：https://developer.android.com/studio
- 安装时选择"Standard"安装
- 完成首次启动向导

## 构建步骤

### 方法一：使用命令行

```bash
# 1. 进入项目目录
cd /Users/liaoweizhou/Desktop/消毒剂配比系统

# 2. 安装依赖（如已安装可跳过）
npm install

# 3. 同步代码
npx cap sync android

# 4. 构建 Debug APK
cd android
./gradlew assembleDebug

# 5. APK 文件位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 方法二：使用 Android Studio（推荐）

```bash
# 1. 打开 Android Studio
npx cap open android
```

然后在 Android Studio 中：

1. 等待 Gradle 同步完成
2. 选择菜单 **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. 构建完成后，右下角会显示提示
4. 点击提示中的 "locate" 找到 APK 文件

### 构建 Release APK（正式版）

Release APK 需要签名才能安装：

```bash
# 1. 生成签名密钥
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias

# 2. 在 android/app/build.gradle 中配置签名

# 3. 构建 Release APK
./gradlew assembleRelease
```

APK 文件位置：`android/app/build/outputs/apk/release/app-release.apk`

## 安装 APK

1. 将 APK 文件传输到安卓手机
2. 在手机上打开 APK 文件
3. 如提示"未知来源"，请前往设置 → 安全 → 允许未知来源安装
4. 完成安装

## 常见问题

### Q: 提示 "JAVA_HOME not set"
A: 设置 Java 环境变量：
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-XX.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

### Q: 提示 "SDK not found"
A: 设置 Android SDK 路径：
```bash
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
```

### Q: 构建失败
A: 尝试清理后重新构建：
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 联系方式

如有问题，请联系：
- 单位：柳州市疾病预防控制中心消毒与病媒生物防制所
- 作者：廖维洲
