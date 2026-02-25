#!/bin/bash
# 自动构建APK脚本 - 需要Java环境
# 如果没有Java，请先安装：brew install openjdk@17

set -e

echo "=========================================="
echo "  消毒剂配比系统 APK 自动构建工具"
echo "  柳州市疾病预防控制中心"
echo "=========================================="
echo ""

# 检查Java
if ! command -v java &> /dev/null || [ "$(java -version 2>&1 | grep -c 'version')" -eq 0 ]; then
    echo "⚠️  未检测到可用的Java环境"
    echo ""
    echo "请选择以下方式之一安装Java："
    echo ""
    echo "方式1 - Homebrew（推荐）:"
    echo "  brew install openjdk@17"
    echo "  sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk"
    echo ""
    echo "方式2 - 手动下载:"
    echo "  1. 访问 https://adoptium.net/"
    echo "  2. 下载 OpenJDK 17 LTS for macOS"
    echo "  3. 安装并配置JAVA_HOME"
    echo ""
    exit 1
fi

echo "✅ Java版本:"
java -version 2>&1 | head -3
echo ""

# 检查Android SDK
if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        export PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools"
        echo "✅ 已自动设置Android SDK路径"
    else
        echo "⚠️  未找到Android SDK"
        echo "请安装Android Studio: https://developer.android.com/studio"
        echo ""
    fi
fi

# 进入项目目录
cd "$(dirname "$0")"

echo "📦 正在安装依赖..."
npm install

echo ""
echo "🔄 同步Android项目..."
npx cap sync android

echo ""
echo "🔨 构建Debug APK..."
cd android
./gradlew clean
./gradlew assembleDebug

echo ""
echo "=========================================="
echo "✅ 构建成功！"
echo ""
echo "APK文件位置:"
echo "$(pwd)/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "=========================================="
echo ""
echo "安装说明:"
echo "1. 将APK文件传输到安卓手机"
echo "2. 在手机上打开APK文件"
echo "3. 允许'未知来源'安装"
echo "4. 完成安装"
echo ""
