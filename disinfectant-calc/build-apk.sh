#!/bin/bash
# 消毒剂配比系统 APK 打包脚本
# 作者：廖维洲

echo "========================================"
echo "  消毒剂配比系统 APK 打包工具"
echo "  柳州市疾病预防控制中心"
echo "========================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装："
    echo "   https://nodejs.org/ (建议 LTS 版本)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 未检测到 Java，请先安装 JDK 11 或更高版本"
    exit 1
fi

echo "✅ Java 版本: $(java -version 2>&1 | head -n 1)"

# 安装依赖
echo ""
echo "📦 正在安装依赖..."
npm install @capacitor/core @capacitor/cli @capacitor/android

# 添加安卓平台
if [ ! -d "android" ]; then
    echo ""
    echo "📱 添加 Android 平台..."
    npx cap add android
fi

# 同步代码
echo ""
echo "🔄 同步代码..."
npx cap sync

echo ""
echo "========================================"
echo "✅ 准备完成！"
echo ""
echo "下一步："
echo "1. 打开 Android Studio:"
echo "   npx cap open android"
echo ""
echo "2. 在 Android Studio 中："
echo "   Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""
echo "3. APK 文件位置："
echo "   android/app/build/outputs/apk/release/app-release.apk"
echo "========================================"
