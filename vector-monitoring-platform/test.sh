#!/bin/bash

# 系统测试和修复脚本

echo "=========================================="
echo "  🧪 病媒监测平台测试脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查前端服务
check_frontend() {
  echo "[1/5] 检查前端服务..."
  if curl -s http://localhost:3003 > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} 前端服务运行正常 (http://localhost:3003)"
    return 0
  else
    echo -e "${YELLOW}⚠️${NC} 前端服务未运行"
    return 1
  fi
}

# 启动前端服务
start_frontend() {
  echo "🚀 启动前端服务..."
  cd /Users/liaoweizhou/.openclaw/workspace/vector-monitoring-platform/frontend
  
  # 检查node_modules
  if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install --registry=https://registry.npmmirror.com
  fi
  
  # 杀掉旧进程
  pkill -f "vite" 2> /dev/null
  sleep 1
  
  # 启动服务
  nohup npm run dev > /tmp/vector-frontend.log 2>&1 &
echo $! > /tmp/vector-frontend.pid
  
  sleep 3
  
  if curl -s http://localhost:3003 > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} 前端服务启动成功"
    return 0
  else
    echo -e "${RED}❌${NC} 前端服务启动失败"
    return 1
  fi
}

# 检查Mock配置
check_mock() {
  echo ""
  echo "[2/5] 检查Mock配置..."
  if grep -q "USE_MOCK = true" /Users/liaoweizhou/.openclaw/workspace/vector-monitoring-platform/frontend/src/utils/request.js; then
    echo -e "${GREEN}✅${NC} Mock模式已启用"
  else
    echo -e "${YELLOW}⚠️${NC} Mock模式未启用"
  fi
}

# 检查页面文件
check_pages() {
  echo ""
  echo "[3/5] 检查页面文件..."
  
  views_dir="/Users/liaoweizhou/.openclaw/workspace/vector-monitoring-platform/frontend/src/views"
  pages=("Login/index.vue" "Dashboard/index.vue" "DataEntry/index.vue" "Analysis/index.vue" "Reports/index.vue" "Settings/index.vue")
  
  for page in "${pages[@]}"; do
    if [ -f "$views_dir/$page" ]; then
      lines=$(wc -l < "$views_dir/$page")
      echo -e "${GREEN}✅${NC} $page ($lines 行)"
    else
      echo -e "${RED}❌${NC} $page - 文件不存在"
    fi
  done
}

# 检查构建
check_build() {
  echo ""
  echo "[4/5] 检查项目构建..."
  cd /Users/liaoweizhou/.openclaw/workspace/vector-monitoring-platform/frontend
  
  if npm run build > /tmp/vector-build.log 2>&1; then
    echo -e "${GREEN}✅${NC} 项目构建成功"
  else
    echo -e "${RED}❌${NC} 项目构建失败"
    echo "查看日志: /tmp/vector-build.log"
  fi
}

# 运行测试
run_tests() {
  echo ""
  echo "[5/5] 功能测试..."
  
  # 简单的HTTP测试
  if curl -s http://localhost:3003/login > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} 登录页面可访问"
  else
    echo -e "${RED}❌${NC} 登录页面无法访问"
  fi
  
  if curl -s http://localhost:3003/dashboard > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} 数据看板可访问"
  else
    echo -e "${RED}❌${NC} 数据看板无法访问"
  fi
}

# 显示访问信息
show_info() {
  echo ""
  echo "=========================================="
  echo "  📱 系统访问信息"
  echo "=========================================="
  echo ""
  echo "🌐 前端地址: http://localhost:3003"
  echo ""
  echo "🔑 测试账号:"
  echo "   用户名: admin"
  echo "   密码: 任意"
  echo ""
  echo "📊 功能页面:"
  echo "   - 登录: /login"
  echo "   - 看板: /dashboard"
  echo "   - 录入: /entry"
  echo "   - 分析: /analysis"
  echo "   - 报告: /reports"
  echo "   - 设置: /settings"
  echo ""
  echo "📝 日志文件:"
  echo "   - 前端: /tmp/vector-frontend.log"
  echo "   - 构建: /tmp/vector-build.log"
  echo ""
  echo "=========================================="
}

# 主程序
main() {
  if ! check_frontend; then
    start_frontend
  fi
  
  check_mock
  check_pages
  check_build
  run_tests
  show_info
}

# 执行
main