#!/bin/bash

# 病媒监测平台启动脚本

echo "=========================================="
echo "  病媒监测平台启动脚本"
echo "=========================================="
echo ""

# 检查前端是否已在运行
if lsof -ti:3003 > /dev/null 2>&1; then
    echo "✅ 前端服务已在运行 (http://localhost:3003)"
else
    echo "🚀 启动前端服务..."
    cd "$(dirname "$0")/../frontend"
    npm run dev &
    echo "✅ 前端启动中，请等待..."
    sleep 3
fi

echo ""
echo "=========================================="
echo "  服务状态"
echo "=========================================="
echo ""
echo "🌐 前端地址: http://localhost:3003"
echo ""
echo "⚠️  后端服务需要手动启动:"
echo "   1. 安装 IntelliJ IDEA"
echo "   2. 打开 backend 文件夹"
echo "   3. 点击运行按钮"
echo ""
echo "   或使用 Docker:"
echo "   docker-compose up -d"
echo ""
echo "=========================================="